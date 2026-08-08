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

/** Map of `data-seldon-ref` name to override props. */
export type SeldonRefs = Record<string, Record<string, unknown>>

function readString(source: object | null | undefined, key: string) {
  const value = (source as Record<string, unknown> | null | undefined)?.[key]

  return typeof value === "string" ? value : undefined
}

/**
 * Resolves the override a caller addressed to this slot by its baked
 * `data-seldon-ref` name. The ref rides on the slot's defaults, so a view model
 * can drive a slot by a stable name instead of a positional prop.
 */
function readRefOverride(base: object | null | undefined, refs: SeldonRefs | undefined) {
  const name = readString(base, "data-seldon-ref")

  if (name === undefined) return undefined

  return refs?.[name]
}

function layer<T extends object>(
  base: T | null | undefined,
  override: T | null | undefined,
  refOverride: Record<string, unknown> | undefined,
): T {
  const merged: Record<string, unknown> = {
    ...base,
    ...override,
    ...refOverride,
  }

  const className = combineClassNames(
    readString(base, "className"),
    readString(override, "className"),
    readString(refOverride, "className"),
  )

  if (className) merged["className"] = className

  return merged as T
}

/**
 * Layers a caller's slot props over the slot's baked defaults, then applies the
 * matching `seldonRefs` override last. Class names from all three sources are
 * combined so generated styles survive.
 *
 * Returns `null` when the caller passes `null`, which suppresses the slot.
 *
 * @param base - The slot's baked default props from `sdn`
 * @param override - The caller's props for this slot
 * @param refs - The caller's ref-keyed overrides
 */
export function mergeSlot<T extends object>(
  base: T | null | undefined,
  override: T | null | undefined,
  refs?: SeldonRefs,
): T | null {
  if (override === null) return null

  return layer(base, override, readRefOverride(base, refs))
}

/**
 * The opt-in form of `mergeSlot`, for a slot the component does not render by
 * default. It stays hidden until a caller opts it in, either by passing props
 * for the slot or by addressing it through a matching `seldonRefs` entry. A
 * caller that passes `null` suppresses the slot even when a ref exists.
 *
 * @param base - The slot's baked default props from `sdn`
 * @param override - The caller's props for this slot
 * @param refs - The caller's ref-keyed overrides
 */
export function mergeOptionalSlot<T extends object>(
  base: T | null | undefined,
  override: T | null | undefined,
  refs?: SeldonRefs,
): T | null {
  const refOverride = readRefOverride(base, refs)

  if (override === null) return null
  if (override === undefined && refOverride === undefined) return null

  return layer(base, override, refOverride)
}
