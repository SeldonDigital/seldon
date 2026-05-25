import { create } from "zustand"
import { ComponentLevel } from "@seldon/core/components/constants"

interface SectionExpansionState {
  sections: Record<ComponentLevel, boolean>
  toggleSection: (section: ComponentLevel, shouldExpand?: boolean) => void
}

const useStore = create<SectionExpansionState>((set) => ({
  sections: {
    [ComponentLevel.BOARD]: true,
    [ComponentLevel.FRAME]: true,
    [ComponentLevel.PRIMITIVE]: true,
    [ComponentLevel.ELEMENT]: true,
    [ComponentLevel.PART]: true,
    [ComponentLevel.MODULE]: true,
    [ComponentLevel.SCREEN]: true,
  },
  toggleSection: (section: ComponentLevel, shouldExpand?: boolean) =>
    set((state) => {
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
 * Hook for managing expansion state of component level sections in the objects panel.
 * Sections are organized by component level (Primitives, Elements, Parts, Modules, Screens).
 * All sections start expanded by default.
 *
 * @returns Object with toggle function and expansion check function
 */
export const useSectionExpansion = () => {
  const { sections, toggleSection } = useStore()

  return {
    toggleSection,
    isSectionExpanded: (section: ComponentLevel) => sections[section],
  }
}
