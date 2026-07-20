// The rainbow strip has no generated View yet. Its layout and resting gradient
// live on these classes in editor-chrome.css; the export animation repaints the
// strip from JS (see use-topbar-gradient-animation).

/** Class that owns the strip's layout and resting interface gradient. */
export const TOPBAR_GRADIENT_CLASS = "topbar-gradient"

/** Added while a local export runs; grows the strip. */
export const TOPBAR_GRADIENT_ACTIVE_CLASS = "topbar-gradient--active"

/** Interface swatches the animation cross-fades between, sampled at random. */
export const INTERFACE_SWATCH_TOKENS = [
  "--sdn-swatch-negative",
  "--sdn-swatch-positive",
  "--sdn-swatch-warning",
  "--sdn-swatch-active",
  "--sdn-swatch-punch",
  "--sdn-swatch-accent",
] as const

/**
 * Resting gradient stops, left to right. The animation settles back to these
 * when an export ends. Must match the resting gradient in editor-chrome.css so
 * the handoff back to CSS is seamless.
 */
export const TOPBAR_RESTING_TOKENS = [
  "--sdn-swatch-negative",
  "--sdn-swatch-warning",
  "--sdn-swatch-positive",
  "--sdn-swatch-active",
  "--sdn-swatch-negative",
] as const

/**
 * Stop positions in percent, matching the original strip's uneven spacing. Stops
 * hold these positions the whole time; only their colors animate.
 */
export const TOPBAR_STOP_POSITIONS = [0, 20, 40, 70, 100] as const
