import { SingleBackgroundPositionValue, ValueType } from "@seldon/core"
import { backgroundPositionMap } from "./background-position-map"

export function getBackgroundPositionStyle(
  position: SingleBackgroundPositionValue,
) {
  if (position.type === ValueType.EXACT) {
    return `${position.value.value}${position.value.unit}`
  }

  if (position.type === ValueType.PRESET) {
    return backgroundPositionMap[position.value]
  }
}
