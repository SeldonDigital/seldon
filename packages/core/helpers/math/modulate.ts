import { StaticTheme } from "../../themes/types"
import { ModulationParameters, Ratio } from "../../themes/types"
import { round } from "./round"

/**
 * Calculates modulated values using ratio-based scaling to maintain visual rhythm.
 *
 * @param params - The modulation parameters
 * @param params.ratio - The ratio to use for modulation (default: MajorThird)
 * @param params.step - The modulation step (0 = no modulation)
 * @param params.size - The base size to modulate (default: 1)
 * @param options - Additional options
 * @param options.round - Whether to round the result (default: true)
 * @returns The modulated value
 */
export function modulate(
  {
    ratio = Ratio.MajorThird, // Default ratio
    step = 0, // Default is zero, which does not modulate the value
    size = 1,
  }: {
    ratio?: Ratio | number
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

/**
 * Modulates values using theme defaults for ratio and size.
 *
 * @param theme - The theme to use for default values
 * @param parameters - The modulation parameters (step is required)
 * @param parameters.ratio - Override theme ratio (optional)
 * @param parameters.size - Override theme size (optional)
 * @param parameters.step - The modulation step
 * @returns The modulated value using theme defaults
 */
export function modulateWithTheme({
  theme,
  parameters,
}: {
  theme: StaticTheme
  parameters: {
    ratio?: Ratio | number
    size?: number
    step: number
  }
}) {
  return modulate({
    ratio: theme.core.ratio,
    size: theme.core.size,
    ...parameters,
  })
}
