import { ComputedFunction } from "../properties"
import { AUTO_FIT_DISPLAY_NAME } from "./compute-auto-fit"
import { HIGH_CONTRAST_COLOR_DISPLAY_NAME } from "./compute-high-contrast-color"
import { MATCH_DISPLAY_NAME } from "./compute-match"
import { OPTICAL_PADDING_DISPLAY_NAME } from "./compute-optical-padding"

// Export display names map for editor to use
export const COMPUTED_FUNCTION_DISPLAY_NAMES: Record<ComputedFunction, string> =
  {
    [ComputedFunction.AUTO_FIT]: AUTO_FIT_DISPLAY_NAME,
    [ComputedFunction.HIGH_CONTRAST_COLOR]: HIGH_CONTRAST_COLOR_DISPLAY_NAME,
    [ComputedFunction.OPTICAL_PADDING]: OPTICAL_PADDING_DISPLAY_NAME,
    [ComputedFunction.MATCH]: MATCH_DISPLAY_NAME,
  }

// Re-export computation functions
export { computeAutoFit } from "./compute-auto-fit"
export { computeHighContrastColor } from "./compute-high-contrast-color"
export { computeOpticalPadding } from "./compute-optical-padding"
export { computeMatch } from "./compute-match"

// Re-export other utilities
export { computeProperties } from "./compute-properties"
export { getBasedOnValue } from "./get-based-on-value"
export type { ComputeContext, ComputeKeys } from "./types"
