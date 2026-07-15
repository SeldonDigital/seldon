import { ImageFit, SingleBackgroundSizeValue, ValueType } from "@seldon/core"

import { backgroundSizeMap } from "./image-fit-map"

export function getBackgroundSizeStyle(
  size: SingleBackgroundSizeValue,
): string {
  if (size.type === ValueType.EXACT) {
    // Lengths are stored as an exact measure payload.
    return `${size.value.value}${size.value.unit}`
  }

  if (size.type === ValueType.OPTION) {
    // A named fit (cover, contain, …) is stored as an option string value.
    return String(backgroundSizeMap[size.value as ImageFit] ?? size.value)
  }

  return ""
}
