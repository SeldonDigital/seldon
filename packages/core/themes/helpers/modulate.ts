import { modulate } from "../../helpers/math/modulate"
import type { ThemePipelineInput } from "../types"

export { modulate }

/**
 * Modulates values using theme defaults for ratio and size from `modulation`.
 */
export function modulateWithTheme({
  theme,
  parameters,
}: {
  theme: ThemePipelineInput
  parameters: {
    ratio?: number
    size?: number
    step: number
  }
}) {
  return modulate({
    ratio: theme.modulation.parameters.ratio,
    size: theme.modulation.parameters.baseSize,
    ...parameters,
  })
}
