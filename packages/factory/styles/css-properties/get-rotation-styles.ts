import { ValueType } from "@seldon/core"

import { getCssValue } from "./get-css-value"

import type { CSSObject } from "./types"
import type { Properties } from "@seldon/core"

export function getRotationStyles({ properties }: { properties: Properties }): CSSObject {
  const styles: CSSObject = {}

  if (properties.rotation?.type === ValueType.EXACT) {
    styles.transform = String(getCssValue(properties.rotation))
  }

  return styles
}
