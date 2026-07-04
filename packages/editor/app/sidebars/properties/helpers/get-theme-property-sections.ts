import {
  getAllThemeTokenSchemas,
  getAllThemeTokenSectionSchemas,
  getThemeTokenSchema,
} from "@seldon/core/themes/schemas"
import { Theme } from "@seldon/core/themes/types"
import { FlatProperty } from "./properties-data"

export type ThemePropertyCategoryType =
  | "core"
  | "swatch"
  | "size"
  | "dimension"
  | "margin"
  | "padding"
  | "gap"
  | "background"
  | "border"
  | "borderWidth"
  | "corners"
  | "font"
  | "fontSize"
  | "fontWeight"
  | "lineHeight"
  | "gradient"
  | "shadow"
  | "blur"
  | "scrollbar"

export interface ThemePropertySection {
  label: string
  category: ThemePropertyCategoryType
  properties: FlatProperty[]
}

/**
 * Extracts section ID from a theme property key
 * Examples: "swatch.primary" -> "swatch", "shadow.xlight.offsetX" -> "shadow"
 */
function getSectionFromPropertyKey(
  key: string,
): ThemePropertyCategoryType | null {
  const parts = key.split(".")
  const firstPart = parts[0]

  // Map first part to section ID
  const sectionMap: Record<string, ThemePropertyCategoryType> = {
    core: "core",
    color: "core", // color properties are in core section
    fontFamily: "core", // fontFamily properties are in core section
    swatch: "swatch",
    size: "size",
    dimension: "dimension",
    margin: "margin",
    padding: "padding",
    gap: "gap",
    background: "background",
    border: "border",
    borderWidth: "borderWidth",
    corners: "corners",
    font: "font",
    fontSize: "fontSize",
    fontWeight: "fontWeight",
    lineHeight: "lineHeight",
    gradient: "gradient",
    shadow: "shadow",
    blur: "blur",
    scrollbar: "scrollbar",
  }

  return sectionMap[firstPart] || null
}

/**
 * Groups theme properties into sections using schema system.
 * Properties are grouped by their schema section and ordered according to schema.
 */
export function getThemePropertySections(
  properties: FlatProperty[],
  theme?: Theme,
): ThemePropertySection[] {
  // Get all sections from schema system, sorted by order
  const sectionSchemas = getAllThemeTokenSectionSchemas()

  // Dynamic schemas (theme-derived tokens such as custom slots) resolve section
  // and order for keys the static registry does not know.
  const dynamicSchemas = new Map<
    string,
    { section: ThemePropertyCategoryType; order: number }
  >()
  if (theme) {
    for (const schema of getAllThemeTokenSchemas(theme)) {
      dynamicSchemas.set(schema.key, {
        section: schema.section as ThemePropertyCategoryType,
        order: schema.order,
      })
    }
  }

  // Group properties by section
  const propertiesBySection = new Map<
    ThemePropertyCategoryType,
    FlatProperty[]
  >()

  // Facet rows render nested inside their look parent via the disclosure, so keep
  // them out of the top-level section list to avoid rendering them twice.
  const topLevelProperties = properties.filter(
    (property) => !property.isSubProperty,
  )

  for (const property of topLevelProperties) {
    const schema =
      getThemeTokenSchema(property.key) ?? dynamicSchemas.get(property.key)
    const sectionId = schema
      ? (schema.section as ThemePropertyCategoryType)
      : getSectionFromPropertyKey(property.key)
    if (!sectionId) continue

    const bucket = propertiesBySection.get(sectionId)
    if (bucket) {
      bucket.push(property)
    } else {
      propertiesBySection.set(sectionId, [property])
    }
  }

  const schemaOrder = (key: string): number =>
    (getThemeTokenSchema(key) ?? dynamicSchemas.get(key))?.order ?? 0

  // Convert to sections array in schema order
  const sections: ThemePropertySection[] = []
  for (const sectionSchema of sectionSchemas) {
    const sectionProperties = propertiesBySection.get(
      sectionSchema.id as ThemePropertyCategoryType,
    )
    if (!sectionProperties || sectionProperties.length === 0) continue

    sections.push({
      label: sectionSchema.label,
      category: sectionSchema.id as ThemePropertyCategoryType,
      properties: sectionProperties.sort(
        (a, b) => schemaOrder(a.key) - schemaOrder(b.key),
      ),
    })
  }

  return sections
}
