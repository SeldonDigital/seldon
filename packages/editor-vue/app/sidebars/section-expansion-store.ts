import { defineStore } from "pinia"
import { ref, watch } from "vue"

import type { ComponentLevel } from "@seldon/core/components/constants"

export type ExpandableSection =
  | ComponentLevel
  | "THEME"
  | "FONT_COLLECTION"
  | "ICON_SET"
  | "MEDIA"
  | "PLAYGROUND"

const STORAGE_KEY = "objects-section-expansion"

function loadOverrides(): Partial<Record<ExpandableSection, boolean>> {
  if (typeof localStorage === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as {
      overrides?: Partial<Record<ExpandableSection, boolean>>
    }
    return parsed.overrides ?? {}
  } catch {
    return {}
  }
}

/**
 * Section header expansion, persisted to localStorage under the same key as the
 * React editor. Sections without an entry read as closed, so the first launch
 * starts fully collapsed and later launches restore saved expansions. Mirrors
 * the React `use-section-expansion` store.
 */
export const useSectionExpansionStore = defineStore(
  "objects-section-expansion",
  () => {
    const overrides =
      ref<Partial<Record<ExpandableSection, boolean>>>(loadOverrides())

    function isSectionExpanded(section: ExpandableSection): boolean {
      return overrides.value[section] ?? false
    }

    function toggleSection(
      section: ExpandableSection,
      expanded: boolean,
    ): void {
      overrides.value = { ...overrides.value, [section]: expanded }
    }

    watch(
      overrides,
      () => {
        if (typeof localStorage === "undefined") return
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ overrides: overrides.value }),
        )
      },
      { deep: false },
    )

    return { overrides, isSectionExpanded, toggleSection }
  },
)
