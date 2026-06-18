import { Properties, ValueType } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"

import { CSSObject } from "./types"

/** Reads a positive integer from a resolved number value, or null. */
function readCount(value: unknown): number | null {
  if (
    !value ||
    typeof value !== "object" ||
    (value as { type?: unknown }).type !== ValueType.EXACT
  ) {
    return null
  }
  const stored = (value as { value: unknown }).value
  const raw =
    typeof stored === "number"
      ? stored
      : stored &&
          typeof stored === "object" &&
          "value" in stored &&
          typeof (stored as { value: unknown }).value === "number"
        ? (stored as { value: number }).value
        : null
  return raw !== null && raw >= 1 ? Math.floor(raw) : null
}

/** Builds the `grid-column` / `grid-row` shorthand from a start line and span. */
function buildPlacement(
  start: number | null,
  span: number | null,
): string | null {
  if (start !== null && span !== null) return `${start} / span ${span}`
  if (start !== null) return `${start}`
  if (span !== null) return `span ${span}`
  return null
}

/**
 * Emits grid item placement from `columnStart`/`columnSpan` and
 * `rowStart`/`rowSpan`. These only have an effect when the node sits inside a
 * grid container, but the rules are inert otherwise so no parent check is needed.
 */
export function getGridItemStyles({
  properties,
}: {
  properties: Properties
}): CSSObject {
  const styles: CSSObject = {}

  const gridColumn = buildPlacement(
    readCount(resolveValue(properties.columnStart)),
    readCount(resolveValue(properties.columnSpan)),
  )
  if (gridColumn) styles.gridColumn = gridColumn

  const gridRow = buildPlacement(
    readCount(resolveValue(properties.rowStart)),
    readCount(resolveValue(properties.rowSpan)),
  )
  if (gridRow) styles.gridRow = gridRow

  return styles
}
