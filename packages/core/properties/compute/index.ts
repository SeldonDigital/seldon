import { ComputedFunction } from "../constants"
import { AUTO_FIT_DISPLAY_NAME } from "./compute-auto-fit"
import { HIGH_CONTRAST_COLOR_DISPLAY_NAME } from "./compute-high-contrast-color"
import { MATCH_COLOR_DISPLAY_NAME } from "./compute-match-color"
import { OPTICAL_PADDING_DISPLAY_NAME } from "./compute-optical-padding"

/** Maps each `ComputedFunction` to its editor-facing label. */
export const COMPUTED_FUNCTION_DISPLAY_NAMES: Record<ComputedFunction, string> =
  {
    [ComputedFunction.AUTO_FIT]: AUTO_FIT_DISPLAY_NAME,
    [ComputedFunction.HIGH_CONTRAST_COLOR]: HIGH_CONTRAST_COLOR_DISPLAY_NAME,
    [ComputedFunction.OPTICAL_PADDING]: OPTICAL_PADDING_DISPLAY_NAME,
    [ComputedFunction.MATCH_COLOR]: MATCH_COLOR_DISPLAY_NAME,
  }

export { computeAutoFit } from "./compute-auto-fit"
export { computeHighContrastColor } from "./compute-high-contrast-color"
export { computeOpticalPadding } from "./compute-optical-padding"
export { computeMatchColor } from "./compute-match-color"

export { computeProperties } from "./compute-properties"
export { getBasedOnValue, resolveBasedOnWithAnchor } from "./get-based-on-value"
export type { ResolvedBasedOnWithAnchor } from "./get-based-on-value"
export type { ComputeContext, ComputeKeys, LayoutMode } from "./types"
