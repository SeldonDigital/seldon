import { findInObject } from "../../helpers/utils/find-in-object"
import { ValueType } from "../constants"
import type { Value } from "../types/value"
import type { AtomicValue } from "../types/value-atomic"
import type { ComputeContext } from "./types"

/** Size token AUTO_FIT scales from when no `buttonSize`/`size` appears in the ancestor chain. */
const AUTO_FIT_FALLBACK = {
  type: ValueType.THEME_ORDINAL,
  value: "@fontSize.medium",
} as AtomicValue

function isUsableSize(value: Value | undefined): value is AtomicValue {
  if (!value || typeof value !== "object" || !("type" in value)) {
    return false
  }
  const type = (value as { type: ValueType }).type
  return type !== ValueType.EMPTY && type !== ValueType.INHERIT
}

/**
 * Resolves the size token AUTO_FIT scales from by walking the ancestor chain: the first ancestor
 * with a usable `buttonSize`, else its `size`. Falls back to the `@fontSize.medium` theme ordinal
 * when neither appears. AUTO_FIT sits on a child, so the walk starts at the parent.
 *
 * @param context - This node's context; the walk reads `parentContext` upward
 * @returns A `THEME_ORDINAL` or `EXACT` size value, or the `@fontSize.medium` fallback
 */
export function resolveAutoFitSource(context: ComputeContext): AtomicValue {
  let cursor: ComputeContext | null = context.parentContext
  while (cursor) {
    const buttonSize = findInObject<Value>(cursor.properties, "buttonSize")
    if (isUsableSize(buttonSize)) {
      return buttonSize
    }
    const size = findInObject<Value>(cursor.properties, "size")
    if (isUsableSize(size)) {
      return size
    }
    cursor = cursor.parentContext
  }
  return AUTO_FIT_FALLBACK
}
