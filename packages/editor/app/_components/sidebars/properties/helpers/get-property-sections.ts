import { Board, Instance, Variant, Workspace } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { isComponentId } from "@seldon/core/components/constants"
import { isComponentEntry } from "@seldon/core/workspace/helpers/components/is-component-entry"
import { getNodeCatalogComponentId } from "@lib/workspace/node-tree"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { FlatProperty } from "./properties-data"

export type PropertyCategoryType =
  | "attributes"
  | "layout"
  | "appearance"
  | "typography"
  | "gradients"
  | "effects"
  | "css"

export interface PropertySection {
  label: string
  category: PropertyCategoryType
  properties: FlatProperty[] // Main properties only (not sub-properties)
}

const SECTION_LABELS: Record<PropertyCategoryType, string> = {
  attributes: "Attributes",
  layout: "Layout",
  appearance: "Appearance",
  typography: "Typography",
  gradients: "Gradients",
  effects: "Effects",
  css: "CSS",
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

// Property key to category mapping based on PROPERTIES_ORDER.md
const PROPERTY_CATEGORY_MAP: Record<string, PropertyCategoryType> = {
  // Attributes
  content: "attributes",
  symbol: "attributes",
  htmlElement: "attributes",
  wrapperElement: "attributes",
  inputType: "attributes",
  cursor: "attributes",
  board: "attributes",

  // Layout
  direction: "layout",
  position: "layout",
  orientation: "layout",
  align: "layout",
  cellAlign: "layout",
  width: "layout",
  height: "layout",
  screenWidth: "layout",
  screenHeight: "layout",
  margin: "layout",
  padding: "layout",
  gap: "layout",
  rotation: "layout",
  wrapChildren: "layout",
  clip: "layout",
  columns: "layout",
  rows: "layout",

  // Appearance
  color: "appearance",
  accentColor: "appearance",
  brightness: "appearance",
  opacity: "appearance",
  background: "appearance",
  border: "appearance",
  corners: "appearance",
  borderCollapse: "appearance",

  // Typography
  font: "typography",
  textAlign: "typography",
  textCase: "typography",
  textDecoration: "typography",
  wrapText: "typography",
  lines: "typography",

  // Gradients
  gradient: "gradients",

  // Effects
  shadow: "effects",
  scroll: "effects",
  scrollbarStyle: "effects",
}

const CATEGORY_ORDER: PropertyCategoryType[] = [
  "attributes",
  "layout",
  "appearance",
  "typography",
  "gradients",
  "effects",
  "css",
]

/**
 * Groups flat properties into sections based on their category.
 * Filters out sub-properties (they'll be rendered as children of their parent properties).
 */
export function getPropertySections(
  properties: FlatProperty[],
  node?: Variant | Instance | Board,
  workspace?: Workspace,
): PropertySection[] {
  // Filter out sub-properties - they'll be rendered as nested children
  const mainProperties = properties.filter(
    (property) => !property.isSubProperty,
  )

  // Group properties by category
  const propertiesByCategory = new Map<PropertyCategoryType, FlatProperty[]>()

  for (const property of mainProperties) {
    const category = PROPERTY_CATEGORY_MAP[property.key] || "attributes"
    if (!propertiesByCategory.has(category)) {
      propertiesByCategory.set(category, [])
    }
    propertiesByCategory.get(category)!.push(property)
  }

  // Convert to sections array in the correct order
  const sections: PropertySection[] = []
  for (const category of CATEGORY_ORDER) {
    const categoryProperties = propertiesByCategory.get(category)
    if (categoryProperties && categoryProperties.length > 0) {
      // Use component name for "attributes" section if node and workspace are provided
      let label = SECTION_LABELS[category]
      if (category === "attributes" && node && workspace) {
        label = getComponentNameForAttributes(node, workspace)
      }

      sections.push({
        label,
        category,
        properties: categoryProperties,
      })
    }
  }

  return sections
}
