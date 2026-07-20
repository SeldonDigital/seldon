import { useMemo } from "react"
import { create } from "zustand"

import { BORDER_SIDE_KEYS, BorderSideKey } from "@seldon/core"

/**
 * Ephemeral, per-session visibility for the four border sides. Showing a side
 * only toggles whether its row renders in the inspector; it writes nothing to
 * the node. State is keyed by the properties subject id so each node keeps its
 * own shown set. Resets on reload, like the property expand/collapse store.
 */
interface BorderSideVisibilityState {
  shown: Record<string, Partial<Record<BorderSideKey, boolean>>>
  toggle: (subjectId: string, side: BorderSideKey, show?: boolean) => void
}

const useStore = create<BorderSideVisibilityState>((set) => ({
  shown: {},
  toggle: (subjectId, side, show) =>
    set((state) => {
      const current = state.shown[subjectId] ?? {}
      const next = show ?? !current[side]
      return {
        shown: {
          ...state.shown,
          [subjectId]: { ...current, [side]: next },
        },
      }
    }),
}))

/** Reactive read of the sides currently shown for one subject. */
export function useRevealedBorderSides(subjectId: string): Set<BorderSideKey> {
  const shown = useStore((state) => state.shown[subjectId])
  return useMemo(() => {
    const result = new Set<BorderSideKey>()
    if (shown) {
      for (const side of BORDER_SIDE_KEYS) {
        if (shown[side]) result.add(side)
      }
    }
    return result
  }, [shown])
}

/** Border-side visibility action. Use `useRevealedBorderSides` for reads. */
export function useBorderSideVisibility() {
  const toggle = useStore((state) => state.toggle)
  return { toggleBorderSide: toggle }
}
