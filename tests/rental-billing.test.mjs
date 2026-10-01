import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function loadRentalPlans() {
  const source = read("src/lib/server/rental-plans.js")
    .replace(/\bexport\s+/g, "");
  const context = { globalThis: {} };
  vm.runInNewContext(
    source + "\n;globalThis.__exports = { RENTAL_CONFIG, calculateRentalBill, getBillBreakdown, shouldRefreshRentalPaymentLink };",
    context,
  );
  return context.globalThis.__exports;
}

function walkFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(absolute) : [absolute];
  });
}

test("rental billing charges exact usage instead of 20-hour slabs", () => {
  const { calculateRentalBill } = loadRentalPlans();
  const cases = [
    [0.01, 0.1],
    [1.25, 12.5],
    [5, 50],
    [12.5, 125],
    [19.99, 199.9],
    [20, 200],
    [20.01, 200.1],
    [21.75, 217.5],
  ];

  for (const [hours, expected] of cases) {
    assert.equal(calculateRentalBill(hours), expected, `${hours} hours`);
  }
});

test("rental payment email link refreshes when missing or expired", () => {
  const { shouldRefreshRentalPaymentLink } = loadRentalPlans();
  const now = Date.parse("2026-10-01T09:56:00Z");

  assert.equal(
    shouldRefreshRentalPaymentLink({ billAmountINR: 125, paymentUrl: null, expiresAt: null, nowMs: now }),
    true,
  );
  assert.equal(
    shouldRefreshRentalPaymentLink({
      billAmountINR: 125,
      paymentUrl: "https://example.test/pay",
      expiresAt: new Date(now - 1),
      nowMs: now,
    }),
    true,
  );
  assert.equal(
    shouldRefreshRentalPaymentLink({
      billAmountINR: 125,
      paymentUrl: "https://example.test/pay",
      expiresAt: new Date(now + 60_000),
      nowMs: now,
    }),
    false,
  );
  assert.equal(
    shouldRefreshRentalPaymentLink({ billAmountINR: 0, paymentUrl: null, expiresAt: null, nowMs: now }),
    false,
  );
});

test("admin rental billing accepts precise decimal usage", () => {
  const source = read("src/app/dev/admin/page.js");
  assert.match(source, /step="0\.01"/);
  assert.match(source, /Actual usage hours/);
});

test("rent terms explicitly reject 20-hour rounding and use theme-safe surfaces", () => {
  const source = read("src/app/dev/terms/page.js");
  assert.match(source, /not a minimum|not a billing block/i);
  assert.match(source, /not rounded\s+up/i);
  assert.match(source, /nearest paisa/i);
  assert.match(source, /var\(--heading\)/);
  assert.match(source, /var\(--surface/);
  assert.doesNotMatch(source, /bg-(?:amber|blue|emerald)-50/);
});

test("support email is consistent across application sources", () => {
  const roots = ["src", "scripts"].map((name) => path.join(root, name));
  const stale = [];

  for (const directory of roots) {
    for (const file of walkFiles(directory)) {
      if (!/\.(?:js|mjs|py)$/.test(file)) continue;
      if (fs.readFileSync(file, "utf8").includes("mitraricky06@gmail.com")) {
        stale.push(path.relative(root, file));
      }
    }
  }

  assert.deepEqual(stale, []);
  assert.match(read("src/lib/site-contact.js"), /devsoftwarestudios@gmail\.com/);
  assert.match(read("src/lib/server/newsletter.js"), /SUPPORT_EMAIL/);
});

test("all email templates use the shared current logo asset", () => {
  const newsletter = read("src/lib/server/newsletter.js");
  const logo = read("public/dev-infinity-email-logo.svg");

  assert.match(newsletter, /dev-infinity-email-logo\.svg/);
  assert.match(newsletter, /renderEmailBrandLogo/);
  assert.match(newsletter, /ensureEmailBrandLogo/);
  assert.match(newsletter, /html:\s*ensureEmailBrandLogo\(html\)/);
  assert.match(logo, /DEV Infinity/);
  assert.match(logo, /M22\.3 17\.1/);
});
