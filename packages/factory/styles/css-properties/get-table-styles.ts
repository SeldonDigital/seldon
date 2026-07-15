import { Align, Properties, Theme, ValueType } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"

import { CSSObject } from "./types"

// Logical start/end so a cascaded direction: rtl mirrors cell text alignment.
const alignmentStyles: Partial<Record<Align, CSSObject>> = {
  [Align.TOP_LEFT]: { textAlign: "start", verticalAlign: "top" },
  [Align.TOP_CENTER]: { textAlign: "center", verticalAlign: "top" },
  [Align.TOP_RIGHT]: { textAlign: "end", verticalAlign: "top" },
  [Align.CENTER_LEFT]: { textAlign: "start", verticalAlign: "middle" },
  [Align.CENTER]: { textAlign: "center", verticalAlign: "middle" },
  [Align.CENTER_RIGHT]: { textAlign: "end", verticalAlign: "middle" },
  [Align.BOTTOM_LEFT]: { textAlign: "start", verticalAlign: "bottom" },
  [Align.BOTTOM_CENTER]: { textAlign: "center", verticalAlign: "bottom" },
  [Align.BOTTOM_RIGHT]: { textAlign: "end", verticalAlign: "bottom" },
}

export function getTableStyles({
  properties,
}: {
  properties: Properties
  theme: Theme
}): CSSObject {
  const styles: CSSObject = {}

  const cellAlign = resolveValue(properties.cellAlign)

  if (cellAlign?.type === ValueType.INHERIT) {
    styles.verticalAlign = "inherit"
  } else if (cellAlign?.value && cellAlign.value !== Align.AUTO) {
    Object.assign(styles, alignmentStyles[cellAlign.value])
  }

  const borderCollapse = properties.borderCollapse
  if (
    borderCollapse &&
    (borderCollapse.type === ValueType.EXACT ||
      borderCollapse.type === ValueType.OPTION)
  ) {
    styles.borderCollapse = borderCollapse.value
  }

  return styles
}
