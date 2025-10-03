import { isCompoundValue } from "../helpers/type-guards/compound/is-compound-value"
import { findInObject } from "../helpers/utils/find-in-object"
import {
  ComputedValue,
  PrimitiveValue,
  Value,
  ValueType,
  invariant,
} from "../index"
import { ComputeContext } from "./types"

/**
 * Resolves the value that a computed property is based on, handling parent context traversal.
 * Supports both current context and parent context property references.
 *
 * @param computedValue - The computed value containing the basedOn reference
 * @param context - The computation context (without theme) containing properties and parent data
 * @returns The resolved primitive value from the referenced property
 */
export function getBasedOnValue(
  computedValue: ComputedValue,
  // Theme is not needed for this function and is not available when creating or resolving tokens
  context: Omit<ComputeContext, "theme">,
): PrimitiveValue {
  let value: Value | undefined = undefined
  const { basedOn } = computedValue.value.input

  /**
   * Handle parent context references (e.g., "#parent.color") by traversing up the context chain
   */
  if (basedOn.includes("#parent.") && context.parentContext) {
    let parent = context.parentContext

    value = findInObject<Value>(
      parent.properties,
      basedOn.replace("#parent.", ""),
    )

    while (
      value &&
      "type" in value &&
      value.value === "transparent" &&
      parent.parentContext
    ) {
      parent = parent.parentContext

      value = findInObject<Value>(
        parent.properties,
        basedOn.replace("#parent.", ""),
      )
    }
  } else {
    value = findInObject<Value>(context.properties, basedOn.replace("#", ""))
  }

  if (!value) {
    console.error(context)
    throw new Error(`Based on value not found for ${basedOn}.`)
  }

  invariant(
    !isCompoundValue(value),
    `Based on value must be a primitive value, got ${JSON.stringify(value)}`,
  )

  return value as PrimitiveValue
}
