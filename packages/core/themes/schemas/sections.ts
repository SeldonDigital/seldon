/**
 * Theme token sections: the ordered list used to group `ThemeTokenSchema` catalog
 * entries in the properties sidebar. The order is defined here explicitly. Look
 * sections (`border`, `gradient`, `shadow`, `font`) render after the
 * scale sections they relate to. Each section's `order` is its index in
 * {@link THEME_TOKEN_SECTION_ORDER}.
 */
import type {
  ThemeTokenSectionId,
  ThemeTokenSectionSchema,
} from "../types/schema"

const THEME_TOKEN_SECTION_ORDER: Array<Omit<ThemeTokenSectionSchema, "order">> =
  [
    { id: "core", label: "Core" },
    { id: "swatch", label: "Swatch" },
    { id: "size", label: "Size" },
    { id: "margin", label: "Margin" },
    { id: "padding", label: "Padding" },
    { id: "gap", label: "Gap" },
    { id: "dimension", label: "Dimension" },
    { id: "border", label: "Border" },
    { id: "borderWidth", label: "Border Width" },
    { id: "corners", label: "Corners" },
    { id: "fontWeight", label: "Font Weight" },
    { id: "fontSize", label: "Font Size" },
    { id: "lineHeight", label: "Line Height" },
    { id: "font", label: "Font" },
    { id: "gradient", label: "Gradient" },
    { id: "blur", label: "Blur" },
    { id: "spread", label: "Spread" },
    { id: "shadow", label: "Shadow" },
    { id: "scrollbar", label: "Scrollbar" },
  ]

export const THEME_TOKEN_SECTIONS: ThemeTokenSectionSchema[] =
  THEME_TOKEN_SECTION_ORDER.map((section, index) => ({
    ...section,
    order: index,
  }))

export function getThemeTokenSectionSchema(
  sectionId: ThemeTokenSectionId,
): ThemeTokenSectionSchema | undefined {
  return THEME_TOKEN_SECTIONS.find((section) => section.id === sectionId)
}

export function getAllThemeTokenSectionSchemas(): ThemeTokenSectionSchema[] {
  return [...THEME_TOKEN_SECTIONS].sort((a, b) => a.order - b.order)
}
