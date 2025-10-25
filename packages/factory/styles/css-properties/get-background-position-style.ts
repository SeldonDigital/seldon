import { BackgroundPositionValue, ValueType } from "@seldon/core"
import { backgroundPositionMap } from "./background-position-map"

export function getBackgroundPositionStyle(position: BackgroundPositionValue) {
  if (position.type === ValueType.EXACT) {
    // Handle single value case
    if ("value" in position.value && "unit" in position.value) {
      return `${position.value.value}${position.value.unit}`
    }
    // Handle double axis value case
    if ("x" in position.value && "y" in position.value) {
      return `${position.value.x.value}${position.value.x.unit} ${position.value.y.value}${position.value.y.unit}`
    }
  }

  if (position.type === ValueType.PRESET) {
    return backgroundPositionMap[position.value]
  }
}
