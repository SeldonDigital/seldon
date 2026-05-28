import { create } from "zustand"
import { PropertyCategoryType } from "./get-property-sections"
import { ThemePropertyCategoryType } from "./get-theme-property-sections"

type AllCategoryType = PropertyCategoryType | ThemePropertyCategoryType

interface PropertyExpansionState {
  categories: Record<string, boolean>
  properties: Record<string, boolean>
  toggleCategory: (
    category: AllCategoryType,
    shouldExpand?: boolean,
  ) => void
  toggleProperty: (propertyKey: string, shouldExpand?: boolean) => void
}

const DEFAULT_REGULAR_CATEGORIES: Record<PropertyCategoryType, boolean> = {
  attributes: true,
  layout: true,
  appearance: true,
  typography: true,
  gradients: true,
  effects: true,
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
 * This hook is used to expand and collapse property categories and compound/shorthand properties.
 * Categories default to expanded, properties default to collapsed.
 */
export const usePropertyExpansion = () => {
  const { categories, properties, toggleCategory, toggleProperty } = useStore()

  return {
    toggleCategory,
    isCategoryExpanded: (category: AllCategoryType) =>
      categories[category] ?? true,
    toggleProperty,
    isPropertyExpanded: (propertyKey: string) =>
      properties[propertyKey] ?? false,
  }
}
