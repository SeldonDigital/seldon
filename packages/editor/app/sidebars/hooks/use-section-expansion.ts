import { create } from "zustand"
import { ComponentLevel } from "@seldon/core/components/constants"

type ExpandableSection =
  | ComponentLevel
  | "THEME"
  | "FONT_COLLECTION"
  | "ICON_SET"
  | "MEDIA"
type ToggleableSection = ExpandableSection

interface SectionExpansionState {
  // Sparse map of explicit user toggles. Sections without an entry fall back to
  // a content-based default: non-empty sections open, empty sections closed.
  overrides: Partial<Record<ExpandableSection, boolean>>
  toggleSection: (section: ToggleableSection, expanded: boolean) => void
}

const useStore = create<SectionExpansionState>((set) => ({
  overrides: {},
  toggleSection: (section: ToggleableSection, expanded: boolean) =>
    set((state) => ({
      overrides: {
        ...state.overrides,
        [section]: expanded,
      },
    })),
}))

/**
 * This hook is used to expand and collapse sections in the objects panel.
 */
export const useSectionExpansion = () => {
  const { overrides, toggleSection } = useStore()

  return {
    toggleSection,
    isSectionExpanded: (section: ToggleableSection, hasContent = false) => {
      // Until the user toggles a section, empty sections start collapsed and
      // sections with content start expanded.
      return overrides[section] ?? hasContent
    },
  }
}
