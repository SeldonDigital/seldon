import { create } from "zustand"
import { ComponentLevel } from "@seldon/core/components/constants"

type ExpandableSection = ComponentLevel | "THEME" | "FONT_COLLECTION"
type ToggleableSection = ExpandableSection | "CORE"

interface SectionExpansionState {
  // Sparse map of explicit user toggles. Sections without an entry fall back to
  // a content-based default: non-empty sections open, empty sections closed.
  overrides: Partial<Record<ExpandableSection, boolean>>
  toggleSection: (section: ToggleableSection, expanded: boolean) => void
}

const useStore = create<SectionExpansionState>((set) => ({
  overrides: {},
  toggleSection: (section: ToggleableSection, expanded: boolean) =>
    set((state) => {
      if (section === "CORE") {
        // CORE section doesn't have expansion state, just return
        return state
      }
      return {
        overrides: {
          ...state.overrides,
          [section]: expanded,
        },
      }
    }),
}))

/**
 * This hook is used to expand and collapse sections in the objects panel.
 */
export const useSectionExpansion = () => {
  const { overrides, toggleSection } = useStore()

  return {
    toggleSection,
    isSectionExpanded: (section: ToggleableSection, hasContent = false) => {
      if (section === "CORE") {
        // CORE section is always expanded (no collapse state)
        return true
      }
      // Until the user toggles a section, empty sections start collapsed and
      // sections with content start expanded.
      return overrides[section] ?? hasContent
    },
  }
}
