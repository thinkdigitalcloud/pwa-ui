/**
 * Responsive scaling helpers ported from the PWA apps' `scale.js`
 * (which mirror `react-native-size-matters` to keep parity with the RN apps).
 *
 * Sizes are authored against a 375px-wide baseline phone and scaled up toward
 * a capped maximum so the UI doesn't blow out on desktop/tablet widths.
 */

const BASELINE_WIDTH = 375;
const MAX_EFFECTIVE_WIDTH = 430;

function effectiveWidth(): number {
  const width =
    (typeof window !== 'undefined' && window.innerWidth) || BASELINE_WIDTH;
  return Math.min(width > 0 ? width : BASELINE_WIDTH, MAX_EFFECTIVE_WIDTH);
}

/** Linear scale relative to baseline width. */
export function scale(size: number): number {
  return Math.round((effectiveWidth() / BASELINE_WIDTH) * size);
}

/**
 * Moderate scale — dampens the linear scale by `factor` (default 0.5) so type
 * and spacing grow gently rather than 1:1 with viewport width.
 */
export function ms(size: number, factor = 0.5): number {
  const ratio = effectiveWidth() / BASELINE_WIDTH;
  return Math.round(size + (ratio - 1) * size * factor);
}

/** Convenience: `ms()` result as a px string. */
export function msPx(size: number, factor = 0.5): string {
  return `${ms(size, factor)}px`;
}
