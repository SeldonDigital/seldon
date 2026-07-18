/*****
 *
 * This code was generated using Seldon (https://github.com/SeldonDigital/seldon)
 *
 * License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it, in whole or in part,
 * for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly)
 * any machine learning or artificial intelligence system without written permission.
 *
 *****/
import { combineClassNames } from "./class-name"

/**
 * Layers a caller-supplied override onto a slot's merged props, keyed by the
 * slot's `data-seldon-ref` name. This is the ref override channel: a view model
 * passes `seldonRefs` to a component, and each slot whose ref matches receives
 * the override last. `className` is merged with the slot's existing classes so
 * generated styles are preserved while extra classes are added.
 *
 * @param seldonRefs - Map of ref name to override props, or undefined
 * @param props - The slot's merged props (carries its `data-seldon-ref`), or null
 * @returns The props with the matching override applied, or the input unchanged
 */
export function applyRef<T extends Record<string, unknown> | null>(
  seldonRefs: Record<string, Record<string, unknown>> | undefined,
  props: T,
): T {
  if (!seldonRefs || props === null) return props

  const ref = (props as Record<string, unknown>)["data-seldon-ref"]
  if (typeof ref !== "string") return props

  const override = seldonRefs[ref]
  if (!override) return props

  const merged: Record<string, unknown> = {
    ...(props as Record<string, unknown>),
    ...override,
  }

  const baseClassName = (props as Record<string, unknown>)["className"]
  const overrideClassName = override["className"]
  if (
    typeof baseClassName === "string" ||
    typeof overrideClassName === "string"
  ) {
    merged["className"] = combineClassNames(
      typeof baseClassName === "string" ? baseClassName : undefined,
      typeof overrideClassName === "string" ? overrideClassName : undefined,
    )
  }

  return merged as T
}
