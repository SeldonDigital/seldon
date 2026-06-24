import { ComputedAutoFitValue } from "./auto-fit"
import { ComputedHighContrastValue } from "./high-contrast-color"
import { ComputedMatchColorValue } from "./match-color"
import { ComputedOpticalPaddingValue } from "./optical-padding"

export type ComputedValue =
  | ComputedAutoFitValue
  | ComputedMatchColorValue
  | ComputedHighContrastValue
  | ComputedOpticalPaddingValue
