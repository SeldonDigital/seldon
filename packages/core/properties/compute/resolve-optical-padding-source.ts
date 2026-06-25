import { ValueType } from "../constants"
import type { ComputeContext } from "./types"

function hasValue(value: unknown): boolean {
  return (
    !!value &&
    typeof value === "object" &&
    "type" in value &&
    (value as { type: ValueType }).type !== ValueType.EMPTY
  )
}

/**
 * Resolves the optical padding source from self first: `#buttonSize`, else `#font.size`, else the
 * parent fallback `#parent.fontSize`. Optical padding tunes an element's own padding to its own size
 * token, so the source lives on the node itself. The parent fontSize is a safety net.
 */
export function resolveOpticalPaddingSource(context: ComputeContext): string {
  const properties = context.properties as Record<string, unknown>

  if (hasValue(properties.buttonSize)) {
    return "#buttonSize"
  }

  const font = properties.font as Record<string, unknown> | undefined
  if (font && hasValue(font.size)) {
    return "#font.size"
  }

  return "#parent.fontSize"
}
