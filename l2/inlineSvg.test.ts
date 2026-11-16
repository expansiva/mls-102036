/// <mls fileReference="_102036_/l2/inlineSvg.test.ts" enhancement="_blank" />

import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MAX_MENU_ICON_SVG_BYTES,
  inlineSvgProblems,
  isSafeInlineSvg,
  isSafeMenuIconSvg,
  menuIconSvgProblems,
} from './inlineSvg.js';
import { lucideArtwork } from './lucideArtwork.js';

const LUCIDE_HOUSE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${lucideArtwork('house')}</svg>`;
const icon = (inner: string, root = 'viewBox="0 0 24 24" fill="none" stroke="currentColor"') => `<svg ${root}>${inner}</svg>`;

test('a real Lucide icon is a safe menu icon', () => {
  assert.deepEqual(menuIconSvgProblems(LUCIDE_HOUSE), []);
  assert.equal(isSafeMenuIconSvg(LUCIDE_HOUSE), true);
});

test('each forbidden construct is refused with its reason', () => {
  const cases: Array<[string, string]> = [
    [icon('<script>alert(1)</script>'), 'forbidden'],
    [icon('<foreignObject></foreignObject>'), 'forbidden'],
    [icon('<image href="x.png"/>'), 'forbidden'],
    [icon('<use href="#a"/>'), 'forbidden'],
    [icon('<style>path{}</style>'), 'forbidden'],
    [icon('<animate attributeName="x"/>'), 'forbidden'],
    [icon('<path d="M0 0" onclick="x()"/>'), 'event-handler'],
    [icon('<path d="M0 0" style="fill:url(http://x/y)"/>'), 'external-url'],
    [icon('<a href="https://x"><path d="M0 0"/></a>'), 'external-url'],
  ];
  for (const [markup, problem] of cases) {
    assert.ok(menuIconSvgProblems(markup).includes(problem as never), `${problem}: ${markup}`);
    assert.equal(isSafeMenuIconSvg(markup), false);
  }
});

test('shape of the markup: one root, viewBox, no intrinsic size on the root', () => {
  assert.deepEqual(menuIconSvgProblems(''), ['empty']);
  assert.ok(menuIconSvgProblems('<div><svg viewBox="0 0 24 24"></svg></div>').includes('not-svg'));
  assert.ok(menuIconSvgProblems('<svg viewBox="0 0 24 24"><svg></svg></svg>').includes('many-roots'));
  assert.ok(menuIconSvgProblems('<svg stroke="currentColor"><path d="M0 0"/></svg>').includes('no-viewbox'));
  assert.ok(menuIconSvgProblems(icon('<path d="M0 0"/>', 'viewBox="0 0 24 24" width="24"')).includes('root-size'));
  assert.equal(isSafeMenuIconSvg(icon('<rect x="1" y="1" width="4" height="4"/>')), true, 'size on inner shapes is fine');
});

test('menu icons are monochrome: a fixed color is refused, currentColor and none pass', () => {
  assert.ok(menuIconSvgProblems(icon('<path d="M0 0" stroke="#ff0000"/>')).includes('fixed-color'));
  assert.ok(menuIconSvgProblems(icon('<path d="M0 0" fill="red"/>')).includes('fixed-color'));
  assert.ok(menuIconSvgProblems(icon('<path d="M0 0" style="stroke: rgb(1,2,3)"/>')).includes('fixed-color'));
  assert.equal(isSafeMenuIconSvg(icon('<path d="M0 0" fill="none" stroke="currentColor"/>')), true);
  assert.equal(isSafeInlineSvg(icon('<path d="M0 0" fill="red"/>'), { maxBytes: 12000 }), true, 'colors are opt-in for the generic rule');
});

test('menu icons are small: over the cap is refused', () => {
  const big = icon(`<path d="${'M0 0 '.repeat(MAX_MENU_ICON_SVG_BYTES / 4)}"/>`);
  assert.ok(menuIconSvgProblems(big).includes('too-large'));
  assert.equal(isSafeInlineSvg(big, { maxBytes: big.length }), true);
});

test('non-string input is empty, never a throw', () => {
  assert.deepEqual(inlineSvgProblems(undefined, { maxBytes: 100 }), ['empty']);
  assert.deepEqual(inlineSvgProblems(42, { maxBytes: 100 }), ['empty']);
});
