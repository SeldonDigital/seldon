import { create } from "zustand"
import { persist } from "zustand/middleware"

import { ComponentLevel } from "@seldon/core/components/constants"

export type ExpandableSection =
  | ComponentLevel
  | "THEME"
  | "FONT_COLLECTION"
  | "ICON_SET"
  | "MEDIA"
  | "PLAYGROUND"

interface SectionExpansionState {
  // Sparse map of explicit user toggles, persisted to local storage. Sections
  // without an entry are closed, so the first launch starts fully collapsed and
  // later launches restore the user's saved expansions.
  overrides: Partial<Record<ExpandableSection, boolean>>
  toggleSection: (section: ExpandableSection, expanded: boolean) => void
}

const useStore = create<SectionExpansionState>()(
  persist(
    (set) => ({
      overrides: {},
      toggleSection: (section: ExpandableSection, expanded: boolean) =>
        set((state) => ({
          overrides: {
            ...state.overrides,
            [section]: expanded,
          },
        })),
    }),
    {
      name: "objects-section-expansion",
      partialize: (state) => ({ overrides: state.overrides }),
    },
  ),
)

/**
 * Reactive read for one section's expansion state. Subscribe through this
 * selector so only rows for that section re-render on toggle. Sections default
 * to closed until the user expands them.
 */
export const useIsSectionExpanded = (section: ExpandableSection): boolean =>
  useStore((state) => state.overrides[section] ?? false)

/**
 * Section expansion actions. Use `useIsSectionExpanded` for reads so toggles
 * stay reactive without re-rendering every section consumer.
 */
export const useSectionExpansion = () => {
  const toggleSection = useStore((state) => state.toggleSection)
  return { toggleSection }
}
