import { Board, Instance, Variant, Workspace } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { isComponentId } from "@seldon/core/components/constants"
import { isComponentEntry } from "@seldon/core/workspace/helpers/components/is-component-entry"
import {
  PROPERTY_DISPLAY_META,
  PropertyDisplayCategory,
  getAllPropertySectionSchemas,
  getCatalogKeyForPropertyPath,
} from "@seldon/core/properties/schemas"
import type { IconCategory } from "@seldon/core/icon-sets/constants"
import { getNodeCatalogComponentId } from "@lib/workspace/node-tree"
import { FlatProperty } from "./properties-data"

/**
 * Inspector section ids: the core property display categories, the editor-only
 * CSS block, the read-only `metadata` and `families` sections used by themes and
 * font collections, and one entry per icon category for icon set editing.
 */
export type PropertyCategoryType =
  | PropertyDisplayCategory
  | "css"
  | "metadata"
  | "families"
  | IconCategory

export interface PropertySection {
  label: string
  category: PropertyCategoryType
  properties: FlatProperty[] // Main properties only (not sub-properties)
}

/**
 * Gets the component name for display in the attributes section.
 * For boards, returns the board label + " Board" (e.g., "Product Card Board").
 * For variants/instances, returns the component schema name.
 */
function getComponentNameForAttributes(
  node: Variant | Instance | Board,
  _workspace: Workspace,
): string {
  if (isComponentEntry(node)) {
    // For boards, use the board label + " Board"
    return `${node.label} Board`
  }

  const catalogId = getNodeCatalogComponentId(node, _workspace)
  if (catalogId && isComponentId(catalogId)) {
    try {
      return getComponentSchema(catalogId).name
    } catch {
      return catalogId
    }
  }

  return node.label
}

/**
 * Resolves the inspector section for a top-level property row from core display metadata.
 * Compound parents resolve through a representative `.preset` facet; unknown keys fall back
 * to the attributes section.
 */
function getSectionForProperty(propertyKey: string): PropertyDisplayCategory {
  const catalogKey =
    getCatalogKeyForPropertyPath(propertyKey) ??
    getCatalogKeyForPropertyPath(`${propertyKey}.preset`)
  const category = catalogKey
    ? PROPERTY_DISPLAY_META[catalogKey]?.displayCategory
    : undefined
  return category ?? PropertyDisplayCategory.ATTRIBUTES
}

/**
 * Groups flat properties into sections using core display categories and section order.
 * Filters out sub-properties (they render as children of their parent properties).
 */
export function getPropertySections(
  properties: FlatProperty[],
  node?: Variant | Instance | Board,
  workspace?: Workspace,
): PropertySection[] {
  const mainProperties = properties.filter(
    (property) => !property.isSubProperty,
  )

  const propertiesByCategory = new Map<PropertyDisplayCategory, FlatProperty[]>()
  for (const property of mainProperties) {
    const category = getSectionForProperty(property.key)
    if (!propertiesByCategory.has(category)) {
      propertiesByCategory.set(category, [])
    }
    propertiesByCategory.get(category)!.push(property)
  }

  const sections: PropertySection[] = []
  for (const sectionSchema of getAllPropertySectionSchemas()) {
    const categoryProperties = propertiesByCategory.get(sectionSchema.id)
    if (!categoryProperties || categoryProperties.length === 0) {
      continue
    }

    let label = sectionSchema.label
    if (
      sectionSchema.id === PropertyDisplayCategory.ATTRIBUTES &&
      node &&
      workspace
    ) {
      label = getComponentNameForAttributes(node, workspace)
    }

    sections.push({
      label,
      category: sectionSchema.id,
      properties: categoryProperties,
    })
  }

  return sections
}
