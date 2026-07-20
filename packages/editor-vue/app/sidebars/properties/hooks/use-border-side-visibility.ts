import { defineStore } from "pinia"
import { ref } from "vue"

import { BORDER_SIDE_KEYS, type BorderSideKey } from "@seldon/core"

/**
 * Ephemeral, per-session visibility for the four border sides. Showing a side
 * only toggles whether its row renders in the inspector; it writes nothing to
 * the node. Keyed by the properties subject id so each node keeps its own shown
 * set. Resets on reload, like the property expand/collapse store. Vue port of
 * the React `use-border-side-visibility`.
 */
export const useBorderSideVisibilityStore = defineStore(
  "properties-border-side-visibility",
  () => {
    const shown = ref<Record<string, Partial<Record<BorderSideKey, boolean>>>>(
      {},
    )

    function toggle(
      subjectId: string,
      side: BorderSideKey,
      show?: boolean,
    ): void {
      const current = shown.value[subjectId] ?? {}
      const next = show ?? !current[side]
      shown.value = {
        ...shown.value,
        [subjectId]: { ...current, [side]: next },
      }
    }

    function revealed(subjectId: string): Set<BorderSideKey> {
      const set = new Set<BorderSideKey>()
      const entry = shown.value[subjectId]
      if (entry) {
        for (const side of BORDER_SIDE_KEYS) {
          if (entry[side]) set.add(side)
        }
      }
      return set
    }

    return { shown, toggle, revealed }
  },
)
