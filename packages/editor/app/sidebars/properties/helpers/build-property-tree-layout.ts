import {
  Board,
  Instance,
  NODE_FIELD_DISPLAY_ORDER,
  Theme,
  Variant,
  Workspace,
} from "@seldon/core"
import { rules } from "@seldon/core/rules/config/rules.config"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { isResourceType } from "@seldon/core/workspace/helpers/components/is-resource-type"
import { typeCheckingService } from "@seldon/core/workspace/services"
import { ThemeEditingContext } from "./editing-contexts"
import { PropertySection, getPropertySections } from "./get-property-sections"
import {
  ThemePropertySection,
  getThemePropertySections,
} from "./get-theme-property-sections"
import {
  getIconRowCategory,
  iconCategoryLabel,
} from "./icon-set-properties-data"
import { FlatProperty } from "./properties-data"
import { buildReferenceProperty } from "./reference-display"
import { buildThemeAssignmentProperty } from "./theme-assignment-display"

/** A reference is only editable where `setRef` rules allow it (boards excluded). */
function isReferenceFieldAllowed(node: Variant | Instance | Board): boolean {
  if (isBoard(node)) return false
  const entityType = typeCheckingService.getEntityType(node)
  return rules.mutations.setRef[entityType].allowed
}

/**
 * Builds the leading node-field rows shown before the property rows, in the
 * core-owned `NODE_FIELD_DISPLAY_ORDER`. Theme applies to every non-resource
 * node and board; Reference only to nodes where `setRef` is allowed.
 */
function buildLeadingNodeFieldRows(
  node: Variant | Instance | Board,
  workspace: Workspace,
): FlatProperty[] {
  const rows: FlatProperty[] = []
  for (const field of NODE_FIELD_DISPLAY_ORDER) {
    if (field === "theme") {
      rows.push(buildThemeAssignmentProperty(node, workspace))
    } else if (field === "reference" && isReferenceFieldAllowed(node)) {
      rows.push(buildReferenceProperty(node))
    }
  }
  return rows
}

export function buildPropertyTreeSections({
  properties,
  workspace,
  node,
  theme,
  themeEditingContext,
  metadataProperties,
  metadataVariantLabel,
  familyProperties,
  iconProperties,
  cssStringCount,
}: {
  properties: FlatProperty[]
  workspace: Workspace
  node: Variant | Instance | Board
  theme?: Theme
  themeEditingContext?: ThemeEditingContext | null
  metadataProperties?: FlatProperty[]
  /** Selected resource variant label, used to title the metadata section. */
  metadataVariantLabel?: string
  familyProperties?: FlatProperty[]
  iconProperties?: FlatProperty[]
  cssStringCount: number
}): Array<PropertySection | ThemePropertySection> {
  // The metadata section heads resource trees the way the attributes section
  // heads component trees: title it "Family · Variant" (just the family when the
  // variant label matches), falling back to "Metadata" when no family label.
  const metadataLabel = node.label
    ? metadataVariantLabel && metadataVariantLabel !== node.label
      ? `${node.label} · ${metadataVariantLabel}`
      : node.label
    : "Metadata"

  const metadataSection: PropertySection | null =
    metadataProperties && metadataProperties.length > 0
      ? {
          label: metadataLabel,
          category: "metadata",
          properties: metadataProperties,
        }
      : null

  const familiesSection: PropertySection | null =
    familyProperties && familyProperties.length > 0
      ? {
          label: "Families",
          category: "families",
          properties: familyProperties.filter((p) => !p.isSubProperty),
        }
      : null

  if (themeEditingContext?.isThemeEditing) {
    const themeSections = getThemePropertySections(properties, theme)
    return [
      ...(metadataSection ? [metadataSection] : []),
      ...themeSections,
    ] as Array<PropertySection | ThemePropertySection>
  }

  const propertiesWithLeadingFields = isResourceType(node as Board)
    ? [...properties]
    : [...buildLeadingNodeFieldRows(node, workspace), ...properties]

  const regularSections = getPropertySections(
    propertiesWithLeadingFields,
    node,
    workspace,
  )

  const allSections: Array<PropertySection | ThemePropertySection> = [
    ...(metadataSection ? [metadataSection] : []),
    ...regularSections,
  ]

  if (familiesSection) {
    allSections.push(familiesSection)
  }

  if (iconProperties && iconProperties.length > 0) {
    const parentRows = iconProperties.filter((p) => !p.isSubProperty)
    const seen = new Set<string>()
    for (const row of parentRows) {
      const category = getIconRowCategory(row.key)
      if (!category || seen.has(category)) continue
      seen.add(category)
      allSections.push({
        label: iconCategoryLabel(category),
        category,
        properties: parentRows.filter(
          (p) => getIconRowCategory(p.key) === category,
        ),
      })
    }
  }

  if (cssStringCount > 0) {
    allSections.push({
      label: "CSS",
      category: "css",
      properties: [],
    })
  }

  return allSections
}

export function buildPropertyTreeAllProperties({
  properties,
  workspace,
  node,
  themeEditingContext,
}: {
  properties: FlatProperty[]
  workspace: Workspace
  node: Variant | Instance | Board
  themeEditingContext?: ThemeEditingContext | null
}): FlatProperty[] {
  if (themeEditingContext?.isThemeEditing) {
    return properties
  }

  if (isResourceType(node as Board)) {
    return [...properties]
  }

  return [...buildLeadingNodeFieldRows(node, workspace), ...properties]
}
