import { round } from "./round"

/** Default ratio when omitted: matches `Ratio.MajorThird` in themes. */
const DEFAULT_MODULATION_RATIO = 1.25

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

  return round(modulation)
}
