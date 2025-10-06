import { Properties, ValueType } from "@seldon/core"
import { CSSObject } from "./types"

export function getCursorStyles({
  properties,
}: {
  properties: Properties
}): CSSObject {
  if (!properties.cursor) {
    return {}
  }

  const styles: CSSObject = {}

  // Type guard to check if cursor is not empty
  if (properties.cursor.type !== ValueType.EMPTY) {
    const cursorType = properties.cursor.type
    // Only support PRESET cursor values, throw error for all other types
    if (cursorType === ValueType.PRESET) {
      styles.cursor = properties.cursor.value
    } else {
      throw new Error(`Unknown cursor type: ${cursorType}`)
    }
  }

  return styles
}
