import { Alignment, Properties, Theme, ValueType } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { CSSObject } from "./types"

const alignmentStyles: Partial<Record<Alignment, CSSObject>> = {
  [Alignment.TOP_LEFT]: { textAlign: "left", verticalAlign: "top" },
  [Alignment.TOP_CENTER]: { textAlign: "center", verticalAlign: "top" },
  [Alignment.TOP_RIGHT]: { textAlign: "right", verticalAlign: "top" },
  [Alignment.CENTER_LEFT]: { textAlign: "left", verticalAlign: "middle" },
  [Alignment.CENTER]: { textAlign: "center", verticalAlign: "middle" },
  [Alignment.CENTER_RIGHT]: { textAlign: "right", verticalAlign: "middle" },
  [Alignment.BOTTOM_LEFT]: { textAlign: "left", verticalAlign: "bottom" },
  [Alignment.BOTTOM_CENTER]: { textAlign: "center", verticalAlign: "bottom" },
  [Alignment.BOTTOM_RIGHT]: { textAlign: "right", verticalAlign: "bottom" },
}

export function getTableStyles({
  properties,
  theme,
}: {
  properties: Properties
  theme: Theme
}): CSSObject {
  const styles: CSSObject = {}

  const cellAlign = resolveValue(properties.cellAlign)

  if (cellAlign?.type === ValueType.INHERIT) {
    styles.verticalAlign = "inherit"
  } else if (cellAlign?.value && cellAlign.value !== Alignment.AUTO) {
    Object.assign(styles, alignmentStyles[cellAlign.value])
  }

  const borderCollapse = resolveValue(properties.borderCollapse)
  if (borderCollapse) {
    styles.borderCollapse = borderCollapse.value
  }

  return styles
}
