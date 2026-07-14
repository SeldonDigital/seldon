/**
 * Inspector panel sections for the flattened property catalog.
 * Same API shape as `themes/schemas/sections.ts` (ordered sections, get by id, list all).
 */
import {
  PROPERTY_DISPLAY_ORDER,
  PropertyDisplayCategory,
} from "../constants/property-display"

export interface PropertySectionSchema {
  id: PropertyDisplayCategory
  label: string
  order: number
  keys: readonly string[]
}

const CATEGORY_LABEL = {
  [PropertyDisplayCategory.ATTRIBUTES]: "Attributes",
  [PropertyDisplayCategory.LAYOUT]: "Layout",
  [PropertyDisplayCategory.APPEARANCE]: "Appearance",
  [PropertyDisplayCategory.TYPOGRAPHY]: "Typography",
  [PropertyDisplayCategory.EFFECTS]: "Effects",
  [PropertyDisplayCategory.ACCESSIBILITY]: "Accessibility",
} as const satisfies Record<PropertyDisplayCategory, string>

/** Panel sections in `PROPERTY_DISPLAY_ORDER` sequence, with stable `order` indices. */
export const PROPERTY_SECTIONS: PropertySectionSchema[] =
  PROPERTY_DISPLAY_ORDER.map((block, index) => ({
    id: block.category,
    label: CATEGORY_LABEL[block.category],
    order: index,
    keys: block.keys,
  }))

export function getAllPropertySectionSchemas(): PropertySectionSchema[] {
  return [...PROPERTY_SECTIONS].sort((a, b) => a.order - b.order)
}
