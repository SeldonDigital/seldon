import { ImageFit, SingleBackgroundSizeValue, ValueType } from "@seldon/core"
import { backgroundSizeMap } from "./image-fit-map"

export function getBackgroundSizeStyle(
  size: SingleBackgroundSizeValue,
): string {
  if (size.type === ValueType.EXACT) {
    // A named fit (cover, contain, …) is stored as an exact string value.
    if (typeof size.value === "string") {
      return String(backgroundSizeMap[size.value as ImageFit] ?? size.value)
    }
    return `${size.value.value}${size.value.unit}`
  }

  if (size.type === ValueType.OPTION) {
    return String(backgroundSizeMap[size.value as ImageFit] ?? size.value)
  }

  return ""
}
