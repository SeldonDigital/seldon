import { Properties, ValueType } from "@seldon/core"
import { CSSObject } from "./types"

export function getOpacityStyles({
  properties,
}: {
  properties: Properties
}): CSSObject {
  const styles: CSSObject = {}

  if (
    properties.opacity?.type === ValueType.EXACT &&
    properties.opacity.value.value < 100
  ) {
    // Round to 4 decimal places to avoid floating point precision issues
    // e.g., 99.9 / 100 = 0.9990000000000001 → Math.round(0.9990000000000001 * 10000) / 10000 = 0.999
    styles.opacity =
      Math.round((properties.opacity.value.value / 100) * 10000) / 10000
  }

  return styles
}
