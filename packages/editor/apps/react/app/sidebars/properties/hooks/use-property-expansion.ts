import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { PropertyCategoryType } from "@seldon/editor/lib/properties/inspector/get-property-sections"
import type { ThemePropertyCategoryType } from "@seldon/editor/lib/properties/inspector/get-theme-property-sections"

type AllCategoryType = PropertyCategoryType | ThemePropertyCategoryType

interface PropertyExpansionState {
  categories: Record<string, boolean>
  properties: Record<string, boolean>
  toggleCategory: (category: AllCategoryType, shouldExpand?: boolean) => void
  toggleProperty: (propertyKey: string, shouldExpand?: boolean) => void
}

// A single expansion memory, keyed by stable category and property names rather
// than by node, so open/closed carries across selections. Categories default to
// expanded (`?? true`) and properties to collapsed (`?? false`), so the store only
// records explicit toggles. It persists so the state survives reloads.
const useStore = create<PropertyExpansionState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "property-expansion",
      partialize: (state) => ({
        categories: state.categories,
        properties: state.properties,
      }),
    },
  ),
)

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
