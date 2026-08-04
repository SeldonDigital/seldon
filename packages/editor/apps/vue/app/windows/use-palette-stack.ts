import { defineStore, storeToRefs } from "pinia"
import { computed, ref } from "vue"

import type { ComputedRef } from "vue"

/**
 * Base z-index for the frontmost-ordered palettes. Each open palette sits at
 * `PALETTE_Z_BASE + its index` in the stack, so raising one lifts it above its
 * peers while the whole band stays below the dialog band (50/60). Mirrors the
 * React `use-palette-stack` store.
 */
const PALETTE_Z_BASE = 40

export const usePaletteStackStore = defineStore("palette-stack", () => {
  // Open palette ids in stacking order; the last entry draws on top.
  const order = ref<string[]>([])

  function register(id: string): void {
    if (order.value.includes(id)) return
    order.value = [...order.value, id]
  }

  function unregister(id: string): void {
    order.value = order.value.filter((entry) => entry !== id)
  }

  function raise(id: string): void {
    const last = order.value[order.value.length - 1]

    if (last === id) return
    const rest = order.value.filter((entry) => entry !== id)

    order.value = [...rest, id]
  }

  return { order, register, raise, unregister }
})

/** Register/raise/unregister handles for a floating palette. */
export function usePaletteStack() {
  const store = usePaletteStackStore()

  return {
    register: store.register,
    unregister: store.unregister,
    raise: store.raise,
  }
}

/** The live z-index for a palette, lifting it as it moves up the stack. */
export function usePaletteZIndex(id: string): ComputedRef<number> {
  const { order } = storeToRefs(usePaletteStackStore())

  return computed(() => {
    const index = order.value.indexOf(id)

    return index === -1 ? PALETTE_Z_BASE : PALETTE_Z_BASE + index
  })
}
