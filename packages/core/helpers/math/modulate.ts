import { round } from "./round"

/** Default ratio when omitted: matches `Ratio.MajorThird` in themes. */
const DEFAULT_MODULATION_RATIO = 1.25

/**
 * Ratio-based scaling for typography and spacing (modular scale).
 */
export function modulate(
  {
    ratio = DEFAULT_MODULATION_RATIO,
    step = 0,
    size = 1,
  }: {
    ratio?: number
    step: number
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
