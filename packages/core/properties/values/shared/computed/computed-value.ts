import { ComputedAutoFitValue } from "./auto-fit"
import { ComputedHighContrastValue } from "./high-contrast-color"
import { ComputedMatchValue } from "./match"
import { ComputedOpticalPaddingValue } from "./optical-padding"

export type ComputedValue =
  | ComputedAutoFitValue
  | ComputedMatchValue
  | ComputedHighContrastValue
  | ComputedOpticalPaddingValue
