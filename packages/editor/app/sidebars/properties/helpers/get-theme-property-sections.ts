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

  // Build a map of all schemas (static + dynamic) if theme is provided
  const allSchemasMap = new Map<
    string,
    { section: ThemePropertyCategoryType; order: number }
  >()
  if (theme) {
    const allSchemas = getAllThemeTokenSchemas(theme)
    for (const schema of allSchemas) {
      allSchemasMap.set(schema.key, {
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
    // Try to get schema from static registry first
    let schema = getThemeTokenSchema(property.key)
    let sectionId: ThemePropertyCategoryType | null = null
    let order = 0

    if (schema) {
      // Found in static registry
      sectionId = schema.section as ThemePropertyCategoryType
      order = schema.order
    } else if (theme) {
      // Try dynamic schemas map
      const dynamicSchema = allSchemasMap.get(property.key)
      if (dynamicSchema) {
        sectionId = dynamicSchema.section
        order = dynamicSchema.order
      } else {
        // Fallback: extract section from key
        sectionId = getSectionFromPropertyKey(property.key)
      }
    } else {
      // Fallback: extract section from key
      sectionId = getSectionFromPropertyKey(property.key)
    }

    if (sectionId) {
      if (!propertiesBySection.has(sectionId)) {
        propertiesBySection.set(sectionId, [])
      }
      // Store order with property for sorting
      const propertyWithOrder = { ...property, _order: order }
      propertiesBySection
        .get(sectionId)!
        .push(propertyWithOrder as FlatProperty & { _order: number })
    }
  }

  // Convert to sections array in schema order
  const sections: ThemePropertySection[] = []
  for (const sectionSchema of sectionSchemas) {
    const sectionProperties = propertiesBySection.get(
      sectionSchema.id as ThemePropertyCategoryType,
    )

    if (sectionProperties && sectionProperties.length > 0) {
      // Sort properties by schema order
      const sortedProperties = sectionProperties
        .map((prop) => {
          // Remove temporary _order property
          const { _order, ...rest } = prop as FlatProperty & { _order?: number }
          return rest
        })
        .sort((a, b) => {
          const aSchema = getThemeTokenSchema(a.key) || allSchemasMap.get(a.key)
          const bSchema = getThemeTokenSchema(b.key) || allSchemasMap.get(b.key)
          const aOrder =
            aSchema?.order ??
            (aSchema as { order?: number } | undefined)?.order ??
            0
          const bOrder =
            bSchema?.order ??
            (bSchema as { order?: number } | undefined)?.order ??
            0
          return aOrder - bOrder
        })

      sections.push({
        label: sectionSchema.label,
        category: sectionSchema.id as ThemePropertyCategoryType,
        properties: sortedProperties,
      })
    }
  }

  return sections
}
