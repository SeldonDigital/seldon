import { Properties, ValueType } from "@seldon/core"

import { CSSObject } from "./types"

export function getListStyles({
  properties,
}: {
  properties: Properties
}): CSSObject {
  const styles: CSSObject = {}

  if (properties.listStyleType?.type === ValueType.OPTION) {
    styles.listStyleType =
      properties.listStyleType.value as CSSObject["listStyleType"]
  }

  if (properties.listStylePosition?.type === ValueType.OPTION) {
    styles.listStylePosition =
      properties.listStylePosition.value as CSSObject["listStylePosition"]
  }

  return styles
}
