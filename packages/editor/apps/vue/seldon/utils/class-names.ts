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

export function combineClassNames(
  ...names: Array<string | null | undefined>
): string {
  return names.filter(Boolean).join(" ")
}

type SlotProps = Record<string, unknown> | null | undefined

/**
 * Layers a caller's slot override over the component's baked default props.
 * Returning `null` when the caller explicitly passes `null` lets a component
 * suppress a default child, matching the export's slot semantics.
 */
export function mergeSlot(
  base: SlotProps,
  override: SlotProps,
): Record<string, unknown> | null {
  if (override === null) return null
  const merged: Record<string, unknown> = {
    ...(base ?? {}),
    ...(override ?? {}),
  }
  const baseClass = (base as { className?: string } | null | undefined)
    ?.className
  const overrideClass = (override as { className?: string } | null | undefined)
    ?.className
  const className = combineClassNames(baseClass, overrideClass)
  if (className) merged.className = className
  return merged
}
