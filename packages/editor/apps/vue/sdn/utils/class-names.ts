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

export function combineClassNames(...names: Array<string | null | undefined>): string {
  return names.filter(Boolean).join(" ")
}

type SlotProps = Record<string, unknown> | null | undefined

/** Map of `data-seldon-ref` name to override props. */
export type SeldonRefs = Record<string, Record<string, unknown>>

function readString(source: SlotProps, key: string) {
  const value = source?.[key]

  return typeof value === "string" ? value : undefined
}

/**
 * Resolves the override a caller addressed to this slot by its baked
 * `data-seldon-ref` name. The ref rides on the slot's defaults, so a view model
 * can drive a slot by a stable name instead of a positional prop.
 */
function readRefOverride(base: SlotProps, refs: SeldonRefs | undefined) {
  const name = readString(base, "data-seldon-ref")

  if (name === undefined) return undefined

  return refs?.[name]
}

function layer(base: SlotProps, override: SlotProps, refOverride: SlotProps) {
  const merged: Record<string, unknown> = {
    ...(base ?? {}),
    ...(override ?? {}),
    ...(refOverride ?? {}),
  }

  const className = combineClassNames(
    readString(base, "className"),
    readString(override, "className"),
    readString(refOverride, "className"),
  )

  if (className) merged.className = className

  return merged
}

/**
 * Layers a caller's slot override over the component's baked default props, then
 * applies the matching `seldonRefs` override last. Returning `null` when the
 * caller explicitly passes `null` lets a component suppress a default child,
 * matching the export's slot semantics.
 */
export function mergeSlot(
  base: SlotProps,
  override: SlotProps,
  refs?: SeldonRefs,
): Record<string, unknown> | null {
  if (override === null) return null

  return layer(base, override, readRefOverride(base, refs))
}

/**
 * The opt-in form of `mergeSlot`, for a slot the component does not render by
 * default. It stays hidden until a caller opts it in, either by passing props
 * for the slot or by addressing it through a matching `seldonRefs` entry. A
 * caller that passes `null` suppresses the slot even when a ref exists.
 */
export function mergeOptionalSlot(
  base: SlotProps,
  override: SlotProps,
  refs?: SeldonRefs,
): Record<string, unknown> | null {
  const refOverride = readRefOverride(base, refs)

  if (override === null) return null
  if (override === undefined && refOverride === undefined) return null

  return layer(base, override, refOverride)
}
