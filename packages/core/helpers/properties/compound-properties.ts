import { ValueType } from "../../properties/constants/value-types"
import { BackgroundValue } from "../../properties/values/appearance/background"
import { BorderValue } from "../../properties/values/appearance/border"
import { CornersValue } from "../../properties/values/appearance/corners"
import { GradientValue } from "../../properties/values/appearance/gradient"
import { ShadowValue } from "../../properties/values/effects/shadow"
import { MarginValue } from "../../properties/values/layout/margin"
import { PaddingValue } from "../../properties/values/layout/padding"
import { FontValue } from "../../properties/values/typography/font"

/**
 * Default compound property definitions for testing and initialization.
 *
 * Provides empty compound property structures that can be used as defaults
 * or merged with actual property values. Most properties are empty except
 * for font which includes a theme preset.
 */

export const font = {
  preset: {
    type: ValueType.THEME_CATEGORICAL,
    value: "@font.body",
  },
  family: { type: ValueType.EMPTY, value: null },
  size: { type: ValueType.EMPTY, value: null },
  weight: { type: ValueType.EMPTY, value: null },
  lineHeight: { type: ValueType.EMPTY, value: null },
} satisfies FontValue

export const background = {
  preset: { type: ValueType.EMPTY, value: null },
  image: { type: ValueType.EMPTY, value: null },
  size: { type: ValueType.EMPTY, value: null },
  position: { type: ValueType.EMPTY, value: null },
  repeat: { type: ValueType.EMPTY, value: null },
  color: { type: ValueType.EMPTY, value: null },
  opacity: { type: ValueType.EMPTY, value: null },
} satisfies BackgroundValue

export const shadow = {
  preset: { type: ValueType.EMPTY, value: null },
  offsetX: { type: ValueType.EMPTY, value: null },
  offsetY: { type: ValueType.EMPTY, value: null },
  blur: { type: ValueType.EMPTY, value: null },
  color: { type: ValueType.EMPTY, value: null },
  opacity: { type: ValueType.EMPTY, value: null },
} satisfies ShadowValue

export const border = {
  preset: { type: ValueType.EMPTY, value: null },
  topStyle: { type: ValueType.EMPTY, value: null },
  topColor: { type: ValueType.EMPTY, value: null },
  topWidth: { type: ValueType.EMPTY, value: null },
  topOpacity: { type: ValueType.EMPTY, value: null },
  rightStyle: { type: ValueType.EMPTY, value: null },
  rightColor: { type: ValueType.EMPTY, value: null },
  rightWidth: { type: ValueType.EMPTY, value: null },
  rightOpacity: { type: ValueType.EMPTY, value: null },
  bottomStyle: { type: ValueType.EMPTY, value: null },
  bottomColor: { type: ValueType.EMPTY, value: null },
  bottomWidth: { type: ValueType.EMPTY, value: null },
  bottomOpacity: { type: ValueType.EMPTY, value: null },
  leftStyle: { type: ValueType.EMPTY, value: null },
  leftColor: { type: ValueType.EMPTY, value: null },
  leftWidth: { type: ValueType.EMPTY, value: null },
  leftOpacity: { type: ValueType.EMPTY, value: null },
} satisfies BorderValue

export const gradient = {
  preset: { type: ValueType.EMPTY, value: null },
  gradientType: { type: ValueType.EMPTY, value: null },
  angle: { type: ValueType.EMPTY, value: null },
  startColor: { type: ValueType.EMPTY, value: null },
  startOpacity: { type: ValueType.EMPTY, value: null },
  startPosition: { type: ValueType.EMPTY, value: null },
  endColor: { type: ValueType.EMPTY, value: null },
  endOpacity: { type: ValueType.EMPTY, value: null },
  endPosition: { type: ValueType.EMPTY, value: null },
} satisfies GradientValue

export const margin = {
  top: { type: ValueType.EMPTY, value: null },
  right: { type: ValueType.EMPTY, value: null },
  bottom: { type: ValueType.EMPTY, value: null },
  left: { type: ValueType.EMPTY, value: null },
} satisfies MarginValue

export const padding = {
  top: { type: ValueType.EMPTY, value: null },
  right: { type: ValueType.EMPTY, value: null },
  bottom: { type: ValueType.EMPTY, value: null },
  left: { type: ValueType.EMPTY, value: null },
} satisfies PaddingValue

export const corners = {
  topRight: { type: ValueType.EMPTY, value: null },
  bottomRight: { type: ValueType.EMPTY, value: null },
  bottomLeft: { type: ValueType.EMPTY, value: null },
  topLeft: { type: ValueType.EMPTY, value: null },
} satisfies CornersValue
