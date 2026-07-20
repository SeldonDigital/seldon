import { PropertyCategoryType } from "@seldon/editor/lib/properties/inspector/get-property-sections"
import { ThemePropertyCategoryType } from "@seldon/editor/lib/properties/inspector/get-theme-property-sections"
import { create } from "zustand"

type AllCategoryType = PropertyCategoryType | ThemePropertyCategoryType

interface PropertyExpansionState {
  categories: Record<string, boolean>
  properties: Record<string, boolean>
  toggleCategory: (category: AllCategoryType, shouldExpand?: boolean) => void
  toggleProperty: (propertyKey: string, shouldExpand?: boolean) => void
}

// Categories default to expanded: reads and toggles fall back with `?? true`,
// so the store only tracks explicit collapses.
const useStore = create<PropertyExpansionState>((set) => ({
  categories: {},
  properties: {},
  toggleCategory: (category: AllCategoryType, shouldExpand?: boolean) =>
    set((state) => {
      const expand = shouldExpand ?? !(state.categories[category] ?? true)
      return {
        categories: {
          ...state.categories,
          [category]: expand,
        },
      }
    }),
  toggleProperty: (propertyKey: string, shouldExpand?: boolean) =>
    set((state) => {
      const expand = shouldExpand ?? !state.properties[propertyKey]
      return {
        properties: {
          ...state.properties,
          [propertyKey]: expand,
        },
      }
    }),
}))

/**
 * Reactive read for one category's expansion state.
 */
export const useIsCategoryExpanded = (category: AllCategoryType): boolean =>
  useStore((state) => state.categories[category] ?? true)

/**
 * Reactive read for one compound property's expansion state.
 */
export const useIsPropertyExpanded = (propertyKey: string): boolean =>
  useStore((state) => state.properties[propertyKey] ?? false)

/**
 * Property expansion actions. Use `useIsCategoryExpanded` and
 * `useIsPropertyExpanded` for reads.
 */
export const usePropertyExpansion = () => {
  const toggleCategory = useStore((state) => state.toggleCategory)
  const toggleProperty = useStore((state) => state.toggleProperty)

  return {
    toggleCategory,
    toggleProperty,
  }
}
