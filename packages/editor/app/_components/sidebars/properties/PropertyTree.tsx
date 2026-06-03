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
import { getPropertySections } from "./helpers/get-property-sections"
import { getThemePropertySections } from "./helpers/get-theme-property-sections"
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
}: PropertyTreeProps) {
  const { isCategoryExpanded } = usePropertyExpansion()
  const cssStrings = useCssStrings(node)

  // Use theme sections when in theme editing mode
  const sections = useMemo(() => {
    if (themeEditingContext?.isThemeEditing) {
      // Use theme property sections, pass theme for dynamic schema lookup
      return getThemePropertySections(properties, theme)
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

    // Add CSS section at the end if there are any CSS strings
    const allSections = [...regularSections]
    if (cssStrings.length > 0) {
      allSections.push({
        label: "CSS",
        category: "css",
        properties: [], // Empty since we're rendering CssBlock instead
      })
    }

    return allSections
  }, [properties, node, workspace, cssStrings.length, themeEditingContext])

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
