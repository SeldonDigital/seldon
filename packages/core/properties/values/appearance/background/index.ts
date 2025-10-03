import { ThemeBackgroundKey, ThemeSwatchKey } from "../../../../themes/types"
import {
  BackgroundPosition,
  BackgroundRepeat,
  ImageFit,
} from "../../../constants"
import { Restricted } from "../../../types/helpers"
import { EmptyValue } from "../../shared/empty"
import { BackgroundBrightnessValue } from "./background-brightness"
import { BackgroundColorValue } from "./background-color"
import { BackgroundImageValue } from "./background-image"
import { BackgroundOpacityValue } from "./background-opacity"
import { BackgroundPositionValue } from "./background-position"
import { BackgroundPresetValue } from "./background-preset"
import { BackgroundRepeatValue } from "./background-repeat"
import { BackgroundSizeValue } from "./background-size"

export interface BackgroundValue {
  preset?: Restricted<BackgroundPresetValue | EmptyValue, ThemeBackgroundKey>
  color?: Restricted<BackgroundColorValue | EmptyValue, ThemeSwatchKey>
  brightness?: BackgroundBrightnessValue | EmptyValue
  opacity?: BackgroundOpacityValue | EmptyValue
  image?: BackgroundImageValue | EmptyValue
  position?: Restricted<
    BackgroundPositionValue | EmptyValue,
    BackgroundPosition
  >
  size?: Restricted<BackgroundSizeValue | EmptyValue, ImageFit>
  repeat?: Restricted<BackgroundRepeatValue | EmptyValue, BackgroundRepeat>
}

export * from "./background-color"
export * from "./background-image"
export * from "./background-opacity"
export * from "./background-position"
export * from "./background-preset"
export * from "./background-repeat"
export * from "./background-size"
