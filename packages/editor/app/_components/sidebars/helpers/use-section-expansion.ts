import { create } from "zustand"
import { ComponentLevel } from "@seldon/core/components/constants"

type ExpandableSection = ComponentLevel | "THEME" | "FONT_COLLECTION"

interface SectionExpansionState {
  sections: Record<ExpandableSection, boolean>
  toggleSection: (
    section: ComponentLevel | "THEME" | "FONT_COLLECTION" | "CORE",
    shouldExpand?: boolean,
  ) => void
}

const useStore = create<SectionExpansionState>((set) => ({
  sections: {
    [ComponentLevel.FRAME]: true,
    THEME: true,
    FONT_COLLECTION: true,
    [ComponentLevel.PRIMITIVE]: true,
    [ComponentLevel.ELEMENT]: true,
    [ComponentLevel.PART]: true,
    [ComponentLevel.MODULE]: true,
    [ComponentLevel.SCREEN]: true,
    [ComponentLevel.BOARD]: true,
  },
  toggleSection: (
    section: ComponentLevel | "THEME" | "FONT_COLLECTION" | "CORE",
    shouldExpand?: boolean,
  ) =>
    set((state) => {
      if (section === "CORE") {
        // CORE section doesn't have expansion state, just return
        return state
      }
      const expand = shouldExpand ?? !state.sections[section]
      return {
        sections: {
          ...state.sections,
          [section]: expand,
        },
      }
    }),
}))

/**
 * This hook is used to expand and collapse sections in the objects panel.
 */
export const useSectionExpansion = () => {
  const { sections, toggleSection } = useStore()

  return {
    toggleSection,
    isSectionExpanded: (
      section: ComponentLevel | "THEME" | "FONT_COLLECTION" | "CORE",
    ) => {
      if (section === "CORE") {
        // CORE section is always expanded (no collapse state)
        return true
      }
      return sections[section]
    },
  }
}
