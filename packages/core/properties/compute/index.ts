export { COMPUTED_FUNCTION_DISPLAY_NAMES } from "../constants"

export { computeAutoFit } from "./compute-auto-fit"
export {
  computeHighContrastColor,
  resolveHighContrastForeground,
} from "./compute-high-contrast-color"
export { computeOpticalPadding } from "./compute-optical-padding"
export { computeMatchColor } from "./compute-match-color"

export { computeProperties } from "./compute-properties"
export { getBasedOnValue, resolveBasedOnWithAnchor } from "./get-based-on-value"
export type { ResolvedBasedOnWithAnchor } from "./get-based-on-value"
export { readAnchoredLayerPercentage } from "./compute-layer-color"
export { resolveHighContrastSource } from "./resolve-high-contrast-source"
export { resolveMatchColorSource } from "./resolve-match-color-source"
export { resolveAutoFitSource } from "./resolve-auto-fit-source"
export { resolveOpticalPaddingSource } from "./resolve-optical-padding-source"
export type { ComputeContext, ComputeKeys, LayoutMode } from "./types"
