import { modulate } from "../../helpers/math/modulate"
import type { ThemePipelineInput } from "../types"

export { modulate }

/**
 * Modulates values using theme defaults for ratio and size from `core`.
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
    ratio: theme.core.ratio,
    size: theme.core.size,
    ...parameters,
  })
}
