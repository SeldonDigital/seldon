/**
 * Theme token sections: list and ordering for grouping `ThemeTokenSchema` catalog entries.
 * Order follows `PROPERTY_DISPLAY_ORDER` via anchor properties (see `TOKEN_FIELD_SECTION_ANCHOR`);
 * `core` and `swatch` stay first with fixed sort keys.
 */
import { getPropertySchema } from "../../properties/schemas/helpers"
import type {
  ThemeTokenSectionId,
  ThemeTokenSectionSchema,
} from "../types/schema"

const TOKEN_FIELD_SECTION_ANCHOR: Partial<Record<ThemeTokenSectionId, string>> =
  {
    size: "size",
    dimension: "dimension",
    margin: "margin",
    padding: "padding",
    gap: "gap",
    background: "backgroundPreset",
    border: "borderPreset",
    borderWidth: "borderWidth",
    corners: "corners",
    font: "fontPreset",
    fontSize: "fontSize",
    fontWeight: "fontWeight",
    lineHeight: "fontLineHeight",
    gradient: "gradientPreset",
    shadow: "shadowPreset",
    blur: "shadowBlur",
    spread: "shadowSpread",
    scrollbar: "scrollbarStyle",
  }

const TOKEN_FIELD_SECTION_SORT_OVERRIDES: Partial<
  Record<ThemeTokenSectionId, number>
> = {
  core: -10_000,
  swatch: -9_999,
}

function sortKeyForTokenFieldSection(id: ThemeTokenSectionId): number {
  const override = TOKEN_FIELD_SECTION_SORT_OVERRIDES[id]
  if (override !== undefined) return override

  const anchor = TOKEN_FIELD_SECTION_ANCHOR[id]
  if (!anchor) return 0

  return getPropertySchema(anchor)?.displayOrder ?? 0
}

const RAW_THEME_TOKEN_SECTIONS: Array<Omit<ThemeTokenSectionSchema, "order">> =
  [
    { id: "core", label: "Core" },
    { id: "swatch", label: "Swatch" },
    { id: "size", label: "Size" },
    { id: "dimension", label: "Dimension" },
    { id: "margin", label: "Margin" },
    { id: "padding", label: "Padding" },
    { id: "gap", label: "Gap" },
    { id: "background", label: "Background" },
    { id: "border", label: "Border" },
    { id: "borderWidth", label: "Border Width" },
    { id: "corners", label: "Corners" },
    { id: "font", label: "Font" },
    { id: "fontSize", label: "Font Size" },
    { id: "fontWeight", label: "Font Weight" },
    { id: "lineHeight", label: "Line Height" },
    { id: "gradient", label: "Gradient" },
    { id: "shadow", label: "Shadow" },
    { id: "blur", label: "Blur" },
    { id: "spread", label: "Spread" },
    { id: "scrollbar", label: "Scrollbar" },
  ]

for (const { id } of RAW_THEME_TOKEN_SECTIONS) {
  const hasSortOverride = TOKEN_FIELD_SECTION_SORT_OVERRIDES[id] !== undefined
  const anchor = TOKEN_FIELD_SECTION_ANCHOR[id]
  if (!hasSortOverride && anchor === undefined) {
    throw new Error(
      `Theme token section "${id}" must define TOKEN_FIELD_SECTION_SORT_OVERRIDES or TOKEN_FIELD_SECTION_ANCHOR`,
    )
  }
  if (anchor !== undefined && !getPropertySchema(anchor)) {
    throw new Error(
      `Theme token section "${id}" anchor "${anchor}" is not a catalog key in PROPERTY_SCHEMAS`,
    )
  }
}

export const THEME_TOKEN_SECTIONS: ThemeTokenSectionSchema[] = [
  ...RAW_THEME_TOKEN_SECTIONS,
]
  .sort(
    (a, b) =>
      sortKeyForTokenFieldSection(a.id) - sortKeyForTokenFieldSection(b.id) ||
      RAW_THEME_TOKEN_SECTIONS.findIndex((s) => s.id === a.id) -
        RAW_THEME_TOKEN_SECTIONS.findIndex((s) => s.id === b.id),
  )
  .map((section, index) => ({ ...section, order: index }))

export function getThemeTokenSectionSchema(
  sectionId: ThemeTokenSectionId,
): ThemeTokenSectionSchema | undefined {
  return THEME_TOKEN_SECTIONS.find((section) => section.id === sectionId)
}

export function getAllThemeTokenSectionSchemas(): ThemeTokenSectionSchema[] {
  return [...THEME_TOKEN_SECTIONS].sort((a, b) => a.order - b.order)
}
