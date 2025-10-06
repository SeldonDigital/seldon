import { Properties, ValueType } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { CSSObject } from "./types"

export function getScrollStyles({
  properties,
}: {
  properties: Properties
}): CSSObject {
  const styles: CSSObject = {}

  const scroll = resolveValue(properties.scroll)

  // Handle empty values - don't generate any styles
  if (!scroll) {
    return styles
  }

  // Handle preset values
  if (scroll.type === ValueType.PRESET) {
    if (scroll.value === "none") {
      styles.overflow = "hidden"
    } else if (scroll.value === "horizontal") {
      styles.overflowX = "auto"
      styles.overflowY = "hidden"
    } else if (scroll.value === "vertical") {
      styles.overflowX = "hidden"
      styles.overflowY = "auto"
    } else if (scroll.value === "both") {
      styles.overflow = "auto"
    } else {
      // Default case for other preset values
      styles.overflow = "auto"
    }
  }

  return styles
}
