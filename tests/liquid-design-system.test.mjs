import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/dev/liquid-glass.css", import.meta.url), "utf8");
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
  assert.match(layout, /import "\.\/liquid-glass\.css";/);
});

test("interactive controls have visible focus and reduced motion support", () => {
  assert.match(css, /focus-visible/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /chat-window/);
});

test('usage warnings remain visible against their track in both themes', () => {
  const luminance = (hex) => {
    const rgb = hex.match(/[a-f\d]{2}/gi).map((v) => parseInt(v, 16) / 255)
      .map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  };
  for (const theme of [css.slice(0, css.indexOf('html[data-theme="dark"]')), css.slice(css.indexOf('html[data-theme="dark"]'))]) {
    const token = (name) => theme.match(new RegExp(`--${name}: (#[a-f0-9]{6})`))?.[1];
    assert.ok(token('danger-fill'), 'danger fill token must exist in each theme');
    for (const name of ['danger-fill', 'warning-fill']) {
      const a = luminance(token(name));
      const b = luminance(token('surface-muted'));
      assert.ok((Math.max(a,b) + .05) / (Math.min(a,b) + .05) >= 3, `${name} must contrast with usage track`);
    }
  }
});
