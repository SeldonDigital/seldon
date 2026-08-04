import { create } from "zustand"

/**
 * Base z-index for the frontmost-ordered palettes. Each open palette sits at
 * `PALETTE_Z_BASE + its index` in the stack, so raising one lifts it above its
 * peers while the whole band stays below the dialog band (50/60).
 */
const PALETTE_Z_BASE = 40

interface PaletteStackState {
  /** Open palette ids in stacking order; the last entry draws on top. */
  order: string[]
  register: (id: string) => void
  unregister: (id: string) => void
  raise: (id: string) => void
}

const useStore = create<PaletteStackState>((set) => ({
  order: [],
  register: (id) =>
    set((state) => (state.order.includes(id) ? state : { order: [...state.order, id] })),
  unregister: (id) => set((state) => ({ order: state.order.filter((entry) => entry !== id) })),
  raise: (id) =>
    set((state) => {
      const last = state.order[state.order.length - 1]

      if (last === id) return state

      const rest = state.order.filter((entry) => entry !== id)

      return { order: [...rest, id] }
    }),
}))

export function usePaletteStack() {
  const { register, unregister, raise } = useStore()

  return { register, unregister, raise }
}

/** The live z-index for a palette, lifting it as it moves up the stack. */
export function usePaletteZIndex(id: string): number {
  return useStore((state) => {
    const index = state.order.indexOf(id)

    return index === -1 ? PALETTE_Z_BASE : PALETTE_Z_BASE + index
  })
}
