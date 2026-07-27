import { Direction, ValueType } from "@seldon/core"

import type { CSSObject } from "./types"
import type { Properties } from "@seldon/core"

export function getRTLStyles({ properties }: { properties: Properties }): CSSObject {
  const styles: CSSObject = {}

  if (properties.direction?.type === ValueType.OPTION) {
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
