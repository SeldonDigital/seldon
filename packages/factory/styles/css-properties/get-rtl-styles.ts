import { Direction, Properties, ValueType } from "@seldon/core"
import { CSSObject } from "./types"

export function getRTLStyles({
  properties,
}: {
  properties: Properties
}): CSSObject {
  const styles: CSSObject = {}

  if (properties.direction?.type === ValueType.PRESET) {
    const { value } = properties.direction

    if (value === Direction.RTL) {
      styles.direction = "rtl"
    }

    if (value === Direction.LTR) {
      styles.direction = "ltr"
    }
  }

  return styles
}
