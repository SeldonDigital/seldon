import { Properties, ValueType } from "@seldon/core"
import { getCssValue } from "./get-css-value"
import { CSSObject } from "./types"

export function getRotationStyles({
  properties,
}: {
  properties: Properties
}): CSSObject {
  const styles: CSSObject = {}

  if (properties.rotation?.type === ValueType.EXACT) {
    styles.transform = String(getCssValue(properties.rotation))
  }

  return styles
}
