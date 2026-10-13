import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/dev/nothing-theme.css", import.meta.url), "utf8");
const layout = readFileSync(new URL("../src/app/dev/layout.js", import.meta.url), "utf8");
const rootLayout = readFileSync(new URL("../src/app/layout.js", import.meta.url), "utf8");
const tailwind = readFileSync(new URL("../tailwind.config.js", import.meta.url), "utf8");

test("design tokens exist for both light and dark themes", () => {
  assert.match(css, /html\[data-theme="light"\]/);
  assert.match(css, /html\[data-theme="dark"\]/);
  for (const token of ["--primary", "--background", "--surface-strong", "--heading", "--foreground", "--muted", "--border", "--brand-fill"]) {
    assert.ok(css.split(token).length > 2, `missing shared theme token: ${token}`);
  }
  assert.match(tailwind, /DEFAULT: "var\(--primary\)"/);
});

test("theme is restored before initial paint and applied across /dev pages", () => {
  assert.match(rootLayout, /themeBootstrap/);
  assert.match(rootLayout, /prefers-color-scheme: dark/);
  assert.match(layout, /import "\.\/nothing-theme\.css";/);
});

test("interactive controls have visible focus and reduced motion support", () => {
  assert.match(css, /focus-visible/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /chat-window/);
});
