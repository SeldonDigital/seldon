import { ROOT_FONT_SIZE_PX } from "../resolution/root-font-size"

/** Default ratio when omitted: matches `Ratio.MajorThird` in themes. */
const DEFAULT_MODULATION_RATIO = 1.25

/** Modulated lengths resolve in rem and snap to this pixel grid. */
const PIXEL_SNAP = 0.25

/** Snap steps per whole rem for the pixel grid (`16 / 0.25 = 64`). */
const SNAP_STEPS_PER_REM = ROOT_FONT_SIZE_PX / PIXEL_SNAP

/**
 * Ratio-based scaling for typography and spacing (modular scale).
 */
export function modulate(
  {
    step = 0,
    ratio = DEFAULT_MODULATION_RATIO,
    size = 1,
  }: {
    step: number
    ratio?: number
    size?: number
  },
  options: { round?: boolean } = { round: true },
) {
  if (step === 0) {
    return size
  }

  const modulation = size * ratio ** step

  if (!options.round) {
    return modulation
  }

  return Math.round(modulation * SNAP_STEPS_PER_REM) / SNAP_STEPS_PER_REM
}
