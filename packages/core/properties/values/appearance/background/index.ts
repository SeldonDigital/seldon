import { ThemeBackgroundKey, ThemeSwatchKey } from "../../../../themes/types"
import { Restricted } from "../../../types/helpers"
import { BackgroundPosition, BackgroundRepeat, ImageFit } from "../../../values"
import { EmptyValue } from "../../shared/empty/empty"
import { StringValue } from "../../shared/exact/string"
import { BackgroundBrightnessValue } from "./background-brightness"
import { BackgroundColorValue } from "./background-color"
import { BackgroundImageValue } from "./background-image"
import { BackgroundOpacityValue } from "./background-opacity"
import { BackgroundPositionValue } from "./background-position"
import { BackgroundRepeatValue } from "./background-repeat"
import { BackgroundSizeValue } from "./background-size"
import type { BackgroundValue } from "./background"

/** One layer in the background stack with optional theme recipe and paint fields. */
export interface BackgroundLayer {
  preset?: Restricted<BackgroundValue | EmptyValue, ThemeBackgroundKey>
  image?: BackgroundImageValue | EmptyValue
  position?: Restricted<
    BackgroundPositionValue | EmptyValue,
    BackgroundPosition
  >
  size?: Restricted<BackgroundSizeValue | EmptyValue, ImageFit>
  repeat?: Restricted<BackgroundRepeatValue | EmptyValue, BackgroundRepeat>
  color?: Restricted<BackgroundColorValue | EmptyValue, ThemeSwatchKey>
  blendMode?: StringValue | EmptyValue
  filter?: StringValue | EmptyValue
  brightness?: BackgroundBrightnessValue | EmptyValue
  opacity?: BackgroundOpacityValue | EmptyValue
}

export * from "./background"
export * from "./background-image"
export * from "./background-position"
export * from "./background-size"
export * from "./background-repeat"
export * from "./background-color"
export * from "./background-blend-mode"
export * from "./background-filter"
export * from "./background-brightness"
export * from "./background-opacity"
