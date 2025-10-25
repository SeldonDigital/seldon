import { create } from "zustand"
import { ComponentLevel } from "@seldon/core/components/constants"

interface SectionExpansionState {
  sections: Record<ComponentLevel, boolean>
  toggleSection: (section: ComponentLevel, shouldExpand?: boolean) => void
}

const useStore = create<SectionExpansionState>((set) => ({
  sections: {
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
 * This hook is used to expand and collapse sections in the objects panel.
 */
export const useSectionExpansion = () => {
  const { sections, toggleSection } = useStore()

  return {
    toggleSection,
    isSectionExpanded: (section: ComponentLevel) => sections[section],
  }
}
