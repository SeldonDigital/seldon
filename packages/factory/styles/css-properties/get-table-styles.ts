import { Align, Properties, Theme, ValueType } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { CSSObject } from "./types"

const alignmentStyles: Partial<Record<Align, CSSObject>> = {
  [Align.TOP_LEFT]: { textAlign: "left", verticalAlign: "top" },
  [Align.TOP_CENTER]: { textAlign: "center", verticalAlign: "top" },
  [Align.TOP_RIGHT]: { textAlign: "right", verticalAlign: "top" },
  [Align.CENTER_LEFT]: { textAlign: "left", verticalAlign: "middle" },
  [Align.CENTER]: { textAlign: "center", verticalAlign: "middle" },
  [Align.CENTER_RIGHT]: { textAlign: "right", verticalAlign: "middle" },
  [Align.BOTTOM_LEFT]: { textAlign: "left", verticalAlign: "bottom" },
  [Align.BOTTOM_CENTER]: { textAlign: "center", verticalAlign: "bottom" },
  [Align.BOTTOM_RIGHT]: { textAlign: "right", verticalAlign: "bottom" },
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
  } else if (cellAlign?.value && cellAlign.value !== Align.AUTO) {
    Object.assign(styles, alignmentStyles[cellAlign.value])
  }

  const borderCollapse = resolveValue(properties.borderCollapse)
  if (borderCollapse) {
    styles.borderCollapse = borderCollapse.value
  }

  return styles
}
