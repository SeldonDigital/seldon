import { LayoutGroup } from "framer-motion"
import { Fragment, RefObject, useMemo } from "react"
import {
  Action,
  Board,
  Instance,
  Theme,
  Variant,
  Workspace,
} from "@seldon/core"
import { isResourceType } from "@seldon/core/workspace/helpers/components/is-resource-type"
import { buildThemeAssignmentProperty } from "./helpers/theme-assignment-display"
import { Frame } from "../../../seldon/frames/Frame"
import { FramerExpandable } from "../shared/FramerExpandable"
import { CssBlock } from "./CssBlock"
import { RowCategory } from "./RowCategory"
import { RowProperty } from "./RowProperty"
import { useCssStrings } from "./helpers/get-calculated-properties"
import {
  PropertySection,
  getPropertySections,
} from "./helpers/get-property-sections"
import {
  ThemePropertySection,
  getThemePropertySections,
} from "./helpers/get-theme-property-sections"
import { FlatProperty } from "./helpers/properties-data"
import { usePropertyExpansion } from "./helpers/use-property-expansion"

interface ThemeEditingContext {
  isThemeEditing: true
  updateThemeProperty: (property: FlatProperty, newValue: string) => void
  themeProperties: FlatProperty[]
}

interface PropertyTreeProps {
  properties: FlatProperty[]
  workspace: Workspace
  node: Variant | Instance | Board
  theme?: Theme
  scrollerRef?: RefObject<HTMLDivElement | null>
  dispatch: (action: Action) => void
  themeEditingContext?: ThemeEditingContext | null
  /** Read-only Metadata rows rendered as the first section, when provided. */
  metadataProperties?: FlatProperty[]
  /** Read-only Families rows rendered as the last section, when provided. */
  familyProperties?: FlatProperty[]
}

/**
 * Orchestrates rendering of property sections and properties in a tree structure.
 * Groups properties into sections and handles expansion state.
 */
export function PropertyTree({
  properties,
  workspace,
  node,
  theme,
  scrollerRef,
  dispatch,
  themeEditingContext,
  metadataProperties,
  familyProperties,
}: PropertyTreeProps) {
  const { isCategoryExpanded } = usePropertyExpansion()
  const cssStrings = useCssStrings(node)

  // Use theme sections when in theme editing mode
  const sections = useMemo(() => {
    const metadataSection: PropertySection | null =
      metadataProperties && metadataProperties.length > 0
        ? {
            label: "Metadata",
            category: "metadata",
            properties: metadataProperties,
          }
        : null

    const familiesSection: PropertySection | null =
      familyProperties && familyProperties.length > 0
        ? {
            label: "Families",
            category: "families",
            properties: familyProperties,
          }
        : null

    if (themeEditingContext?.isThemeEditing) {
      // Use theme property sections, pass theme for dynamic schema lookup
      const themeSections = getThemePropertySections(properties, theme)
      return [
        ...(metadataSection ? [metadataSection] : []),
        ...themeSections,
      ] as Array<PropertySection | ThemePropertySection>
    }

    const leadingProperties: FlatProperty[] = []

    // Resource boards (theme, font collection, icon set, media) render with their
    // own preview theme and have no component theme, so they do not expose a
    // theme-assignment picker.
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

    // Add CSS section at the end if there are any CSS strings
    if (cssStrings.length > 0) {
      allSections.push({
        label: "CSS",
        category: "css",
        properties: [], // Empty since we're rendering CssBlock instead
      })
    }

    return allSections
  }, [
    properties,
    node,
    workspace,
    cssStrings.length,
    themeEditingContext,
    theme,
    metadataProperties,
    familyProperties,
  ])

  // Combine all properties for RowProperty's allProperties prop
  const allProperties = useMemo(() => {
    if (themeEditingContext?.isThemeEditing) {
      return properties
    }
    const leadingProperties: FlatProperty[] = []

    if (isResourceType(node as Board)) {
      return [...leadingProperties, ...properties]
    }

    const themeProperty = buildThemeAssignmentProperty(node, workspace)
    return [...leadingProperties, themeProperty, ...properties]
  }, [properties, node, workspace, themeEditingContext])

  return (
    <div ref={scrollerRef} style={styles.scroller}>
      <Frame style={styles.tree}>
        <LayoutGroup>
          {sections.map((section) => (
            <Fragment key={section.category}>
              <RowCategory section={section} />
              <FramerExpandable
                isExpanded={isCategoryExpanded(section.category)}
              >
                {section.category === "css" ? (
                  <CssBlock cssProperties={cssStrings} />
                ) : (
                  section.properties.map((property) => (
                    <RowProperty
                      key={property.key}
                      property={property}
                      workspace={workspace}
                      node={node}
                      theme={theme}
                      allProperties={allProperties}
                      themeEditingContext={themeEditingContext}
                    />
                  ))
                )}
              </FramerExpandable>
            </Fragment>
          ))}
        </LayoutGroup>
      </Frame>
    </div>
  )
}

const styles = {
  scroller: {
    height: "100%",
    overflowX: "hidden" as const,
    overflowY: "auto" as const,
  },
  tree: {
    padding: "0.5rem",
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.25rem",
  },
}
