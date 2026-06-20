import { create } from "zustand"
import { PropertyCategoryType } from "../helpers/get-property-sections"
import { ThemePropertyCategoryType } from "../helpers/get-theme-property-sections"

type AllCategoryType = PropertyCategoryType | ThemePropertyCategoryType

interface PropertyExpansionState {
  categories: Record<string, boolean>
  properties: Record<string, boolean>
  toggleCategory: (category: AllCategoryType, shouldExpand?: boolean) => void
  toggleProperty: (propertyKey: string, shouldExpand?: boolean) => void
}

const DEFAULT_REGULAR_CATEGORIES: Partial<
  Record<PropertyCategoryType, boolean>
> = {
  attributes: true,
  layout: true,
  appearance: true,
  typography: true,
  effects: true,
  accessibility: true,
  css: true,
}

const DEFAULT_THEME_CATEGORIES: Record<ThemePropertyCategoryType, boolean> = {
  core: true,
  swatch: true,
  size: true,
  dimension: true,
  margin: true,
  padding: true,
  gap: true,
  background: true,
  border: true,
  borderWidth: true,
  corners: true,
  font: true,
  fontSize: true,
  fontWeight: true,
  lineHeight: true,
  gradient: true,
  shadow: true,
  blur: true,
  scrollbar: true,
}

const useStore = create<PropertyExpansionState>((set) => ({
  categories: {
    ...DEFAULT_REGULAR_CATEGORIES,
    ...DEFAULT_THEME_CATEGORIES,
  },
  properties: {},
  toggleCategory: (category: AllCategoryType, shouldExpand?: boolean) =>
    set((state) => {
      const expand = shouldExpand ?? !state.categories[category]
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
