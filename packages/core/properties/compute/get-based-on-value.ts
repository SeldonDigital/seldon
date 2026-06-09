import { isCompoundValue } from "../../helpers/type-guards/compound/is-compound-value"
import { findInObject } from "../../helpers/utils/find-in-object"
import { invariant } from "../../helpers/utils/invariant"
import { ComputedFunction } from "../constants"
import type { Value } from "../types/value"
import type { AtomicValue } from "../types/value-atomic"
import type { ComputedValue } from "../values/shared/computed/computed-value"
import { ComputeContext } from "./types"

const LAYERED_PAINT_ROOTS = ["background", "gradient", "shadow"] as const

/**
 * Maps schema-style paths such as `background.color` to runtime paths `background.0.color`.
 */
function normalizeBasedOnLookupPath(path: string): string {
  for (const root of LAYERED_PAINT_ROOTS) {
    const prefix = `${root}.`
    if (!path.startsWith(prefix)) continue

    const rest = path.slice(prefix.length)
    if (/^\d+\./.test(rest)) continue

    return `${root}.0.${rest}`
  }

  return path
}

/**
 * Reads `computedValue.value.input.basedOn`, walks the path on the current node's `properties`, or
 * on the parent's `properties` when the path starts with `#parent.`. Dot segments follow the same
 * rules as `findInObject`. When the path starts with `#parent.` and the hit is the exact string
 * `transparent`, walks up `parentContext` and reads the same path again until the value is not
 * transparent or there is no further parent.
 *
 * @param computedValue - Any computed value type that carries `basedOn` on `value.input`
 * @param context - Properties and parent chain only; theme is omitted because paths do not read it
 * @returns The atomic property value at the resolved path
 * @throws When the path misses or when the value at the path is not an atomic field value
 */
export function getBasedOnValue(
  computedValue: ComputedValue,
  context: Omit<ComputeContext, "theme">,
): AtomicValue {
  let value: Value | undefined
  const basedOn =
    computedValue.value.input?.basedOn ??
    (computedValue.value.function === ComputedFunction.HIGH_CONTRAST_COLOR
      ? "#parent.background.color"
      : undefined)

  if (!basedOn) {
    throw new Error(
      `Missing basedOn for computed function ${computedValue.value.function}.`,
    )
  }

  const lookupPath = normalizeBasedOnLookupPath(basedOn.replace(/^#/, ""))
  const parentLookupPath = normalizeBasedOnLookupPath(
    basedOn.replace("#parent.", ""),
  )

  if (basedOn.includes("#parent.") && context.parentContext) {
    let parent = context.parentContext

    value = findInObject<Value>(parent.properties, parentLookupPath)

    while (
      value &&
      "type" in value &&
      value.value === "transparent" &&
      parent.parentContext
    ) {
      parent = parent.parentContext

      value = findInObject<Value>(parent.properties, parentLookupPath)
    }
  } else {
    value = findInObject<Value>(context.properties, lookupPath)
  }

  if (!value) {
    throw new Error(`Based on value not found for ${basedOn}.`)
  }

  invariant(
    !isCompoundValue(value),
    `Based on path must resolve to a single field value, not a grouped value: ${JSON.stringify(value)}`,
  )

  return value as AtomicValue
}
