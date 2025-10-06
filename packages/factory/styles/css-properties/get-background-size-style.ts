import { SingleBackgroundSizeValue, ValueType } from "@seldon/core"
import { backgroundSizeMap } from "./image-fit-map"

export function getBackgroundSizeStyle(size: SingleBackgroundSizeValue) {
  if (size.type === ValueType.EXACT) {
    return `${size.value.value}${size.value.unit}`
  }

  if (size.type === ValueType.PRESET) {
    return backgroundSizeMap[size.value]
  }
}
