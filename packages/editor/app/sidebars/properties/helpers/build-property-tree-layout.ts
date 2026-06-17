import { Board, Instance, Theme, Variant, Workspace } from "@seldon/core"
import { isResourceType } from "@seldon/core/workspace/helpers/components/is-resource-type"
import {
  PropertySection,
  getPropertySections,
} from "./get-property-sections"
import {
  ThemePropertySection,
  getThemePropertySections,
} from "./get-theme-property-sections"
import {
  getIconRowCategory,
  iconCategoryLabel,
} from "./icon-set-properties-data"
import { FlatProperty } from "./properties-data"
import { buildThemeAssignmentProperty } from "./theme-assignment-display"
import { ThemeEditingContext } from "./editing-contexts"

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

  const leadingProperties: FlatProperty[] = []
  const propertiesWithTheme = isResourceType(node as Board)
    ? [...leadingProperties, ...properties]
    : [
        ...leadingProperties,
        buildThemeAssignmentProperty(node, workspace),
        ...properties,
      ]

  const regularSections = getPropertySections(
    propertiesWithTheme,
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

  const leadingProperties: FlatProperty[] = []

  if (isResourceType(node as Board)) {
    return [...leadingProperties, ...properties]
  }

  const themeProperty = buildThemeAssignmentProperty(node, workspace)
  return [...leadingProperties, themeProperty, ...properties]
}
