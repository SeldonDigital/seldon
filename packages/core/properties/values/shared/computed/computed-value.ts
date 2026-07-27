import type { ComputedAutoFitValue } from "./auto-fit"
import type { ComputedHighContrastValue } from "./high-contrast-color"
import type { ComputedMatchColorValue } from "./match-color"
import type { ComputedOpticalPaddingValue } from "./optical-padding"

export type ComputedValue =
  | ComputedAutoFitValue
  | ComputedMatchColorValue
  | ComputedHighContrastValue
  | ComputedOpticalPaddingValue
