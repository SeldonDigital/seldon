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
 * Reactive read for one section's expansion state. Subscribe through this
 * selector so only rows for that section re-render on toggle.
 */
export const useIsSectionExpanded = (
  section: ToggleableSection,
  hasContent = false,
): boolean => useStore((state) => state.overrides[section] ?? hasContent)

/**
 * Section expansion actions. Use `useIsSectionExpanded` for reads so toggles
 * stay reactive without re-rendering every section consumer.
 */
export const useSectionExpansion = () => {
  const toggleSection = useStore((state) => state.toggleSection)
  return { toggleSection }
}
