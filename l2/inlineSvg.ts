/// <mls fileReference="_102036_/l2/inlineSvg.ts" enhancement="_blank" />

// The one rule for SVG markup that is INLINED in a page: the header brand mark (102033 isSafeLogoSvg)
// and the apps-menu icons (navigation[i].iconSvg). Inlined markup is executable surface, so anything
// that can script, fetch or embed is refused. Lives here because every project that writes, passes or
// draws such markup (102020, 102025, 102033) already depends on this one.

export interface InlineSvgOptions {
  /** Size cap of the markup, in characters. */
  maxBytes: number;
  /** Only currentColor paint: what makes the drawing follow the theme (light and dark). */
  monochrome?: boolean;
}

/** Cap for an apps-menu icon: a hand-drawn 24x24 stroke icon sits far below it. */
export const MAX_MENU_ICON_SVG_BYTES = 4000;

const FORBIDDEN = [
  '<script', '<foreignobject', '<iframe', '<image', '<use', '<style', '<animate',
  'javascript:', 'xlink:', '<!entity', '<!doctype',
];

export type InlineSvgProblem =
  | 'empty'
  | 'too-large'
  | 'not-svg'
  | 'many-roots'
  | 'no-viewbox'
  | 'forbidden'
  | 'event-handler'
  | 'external-url'
  | 'root-size'
  | 'fixed-color';

/** Why the markup would be refused, in a stable order; empty when it is fine. */
export function inlineSvgProblems(markup: unknown, options: InlineSvgOptions): InlineSvgProblem[] {
  const svg = typeof markup === 'string' ? markup.trim() : '';
  if (!svg) return ['empty'];
  const problems: InlineSvgProblem[] = [];
  if (svg.length > options.maxBytes) problems.push('too-large');

  const lower = svg.toLowerCase();
  if (!lower.startsWith('<svg') || !lower.endsWith('</svg>')) problems.push('not-svg');
  if (lower.split('<svg').length !== 2) problems.push('many-roots');
  if (!/\sviewbox\s*=/u.test(lower)) problems.push('no-viewbox');
  if (FORBIDDEN.some((token) => lower.includes(token))) problems.push('forbidden');
  if (/\son[a-z]+\s*=/u.test(lower)) problems.push('event-handler');
  // A url(#id) points inside this very markup (a gradient it carries); anything else leaves the page.
  if (/url\(\s*(?!#)/u.test(lower) || /(?:href|src)\s*=/u.test(lower)) problems.push('external-url');

  // Intrinsic size on the ROOT tag only: width/height on inner shapes is legitimate.
  const root = lower.slice(0, lower.indexOf('>') + 1);
  if (/\s(width|height)\s*=/u.test(root)) problems.push('root-size');

  if (options.monochrome === true) {
    let fixed = /#[0-9a-f]{3,8}/u.test(lower) || /(rgb|rgba|hsl|hsla)\(/u.test(lower);
    for (const paint of lower.matchAll(/(?:fill|stroke)\s*=\s*"([^"]*)"/gu)) {
      const value = paint[1].trim();
      if (value && value !== 'currentcolor' && value !== 'none') fixed = true;
    }
    if (fixed) problems.push('fixed-color');
  }
  return problems;
}

/** Whether the markup is safe AND suitable to be inlined (see inlineSvgProblems). */
export function isSafeInlineSvg(markup: unknown, options: InlineSvgOptions): boolean {
  return inlineSvgProblems(markup, options).length === 0;
}

/** The rule for an apps-menu icon: monochrome and small. */
export function isSafeMenuIconSvg(markup: unknown): boolean {
  return isSafeInlineSvg(markup, { maxBytes: MAX_MENU_ICON_SVG_BYTES, monochrome: true });
}

/**
 * The `iconSvg` of a config navigation item as the apps menu may carry it: the trimmed markup when it
 * passes the rule, otherwise undefined (logged once per item, so a broken config is visible).
 */
export function readMenuIconSvg(value: unknown, where: string): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const problems = menuIconSvgProblems(value);
  if (problems.length === 0) return (value as string).trim();
  console.warn(`[menuIcon] iconSvg of ${where} dropped: ${problems.join(', ')}`);
  return undefined;
}

/** The problems of an apps-menu icon (same rule as isSafeMenuIconSvg). */
export function menuIconSvgProblems(markup: unknown): InlineSvgProblem[] {
  return inlineSvgProblems(markup, { maxBytes: MAX_MENU_ICON_SVG_BYTES, monochrome: true });
}
