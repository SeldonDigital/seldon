import { LayoutGroup } from "framer-motion"
import { Fragment, RefObject, useMemo } from "react"
import { Board, Instance, Theme, Variant, Workspace } from "@seldon/core"
import { isResourceType } from "@seldon/core/workspace/helpers/components/is-resource-type"
import { usePropertiesSidebar } from "./hooks/use-properties-sidebar"
import { usePropertyExpansion } from "./hooks/use-property-expansion"
import {
  ScrollerShell,
  SidebarContainer,
} from "@seldon/components/custom-components"
import { Frame } from "@seldon/components/frames/Frame"
import {
  sidebarNoSelectionStyle,
  sidebarShellStyle,
} from "../helpers/sidebar-styles"
import { FramerExpandable } from "../shared/FramerExpandable"
import { VMCategory } from "./VMCategory"
import { CssBlock } from "./CssBlock"
import { VMProperty } from "./VMProperty"
import {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "./helpers/editing-contexts"
import { useCssStrings } from "./helpers/get-calculated-properties"
import {
  PropertySection,
  getPropertySections,
} from "./helpers/get-property-sections"
import {
  ThemePropertySection,
  getThemePropertySections,
} from "./helpers/get-theme-property-sections"
import {
  getIconRowCategory,
  iconCategoryLabel,
} from "./helpers/icon-set-properties-data"
import { FlatProperty } from "./helpers/properties-data"
import { buildThemeAssignmentProperty } from "./helpers/theme-assignment-display"

export interface PropertyTreeProps {
  properties: FlatProperty[]
  workspace: Workspace
  node: Variant | Instance | Board
  theme?: Theme
  scrollerRef?: RefObject<HTMLDivElement | null>
  themeEditingContext?: ThemeEditingContext | null
  fontCollectionEditingContext?: FontCollectionEditingContext | null
  iconSetEditingContext?: IconSetEditingContext | null
  /** Read-only Metadata rows rendered as the first section, when provided. */
  metadataProperties?: FlatProperty[]
  /**
   * Families rows for the Families section, when provided. Holds parent family
   * rows and their child variant and license rows in one flat list.
   */
  familyProperties?: FlatProperty[]
  /**
   * Icon rows for the per-category icon set sections, when provided. Holds
   * parent subcategory rows and their child icon rows in one flat list.
   */
  iconProperties?: FlatProperty[]
}

/**
 * View-model for the properties sidebar. Renders the no-selection shell or
 * the property tree for the current selection.
 */
export function VMPropertiesSidebar() {
  const state = usePropertiesSidebar()

  if (state.kind === "empty") {
    return <SidebarContainer style={sidebarNoSelectionStyle} />
  }

  return (
    <SidebarContainer
      style={sidebarShellStyle}
      data-testid="properties-sidebar"
    >
      <PropertiesTree {...state.treeProps} />
    </SidebarContainer>
  )
}

/**
 * Orchestrates rendering of property sections and properties in a tree
 * structure. Groups properties into sections and handles expansion state.
 */
function PropertiesTree({
  properties,
  workspace,
  node,
  theme,
  scrollerRef,
  themeEditingContext,
  fontCollectionEditingContext,
  iconSetEditingContext,
  metadataProperties,
  familyProperties,
  iconProperties,
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
            // Only parent family rows render at the section level; child variant
            // and license rows nest under their parent via allProperties.
            properties: familyProperties.filter((p) => !p.isSubProperty),
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

    // One section per icon category. Parent subcategory rows render at the
    // section level; their child icon rows nest under them via allProperties.
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
    iconProperties,
  ])

  // Combine all properties for the row-level allProperties prop
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
    <ScrollerShell ref={scrollerRef} style={styles.scroller}>
      <Frame style={styles.tree}>
        <LayoutGroup>
          {sections.map((section) => (
            <TreeSection
              key={section.category}
              section={section}
              isExpanded={isCategoryExpanded(section.category)}
              workspace={workspace}
              node={node}
              theme={theme}
              cssStrings={cssStrings}
              allProperties={allProperties}
              familyProperties={familyProperties}
              iconProperties={iconProperties}
              themeEditingContext={themeEditingContext}
              fontCollectionEditingContext={fontCollectionEditingContext}
              iconSetEditingContext={iconSetEditingContext}
            />
          ))}
        </LayoutGroup>
      </Frame>
    </ScrollerShell>
  )
}

interface TreeSectionProps {
  section: PropertySection | ThemePropertySection
  isExpanded: boolean
  workspace: Workspace
  node: Variant | Instance | Board
  theme?: Theme
  cssStrings: string[]
  allProperties: FlatProperty[]
  familyProperties?: FlatProperty[]
  iconProperties?: FlatProperty[]
  themeEditingContext?: ThemeEditingContext | null
  fontCollectionEditingContext?: FontCollectionEditingContext | null
  iconSetEditingContext?: IconSetEditingContext | null
}

/**
 * Renders one property section: its category header and the expandable body.
 * Resolves the row-level `allProperties` and editing contexts once for the
 * section so the row map stays a plain iteration.
 */
function TreeSection({
  section,
  isExpanded,
  workspace,
  node,
  theme,
  cssStrings,
  allProperties,
  familyProperties,
  iconProperties,
  themeEditingContext,
  fontCollectionEditingContext,
  iconSetEditingContext,
}: TreeSectionProps) {
  const isFamilies = section.category === "families"
  const isIconCategory =
    !!iconProperties && getIconRowCategory(`icon.${section.category}`) !== null

  const rowAllProperties =
    isFamilies && familyProperties
      ? familyProperties
      : isIconCategory && iconProperties
        ? iconProperties
        : allProperties
  const rowFontCollectionContext = isFamilies
    ? fontCollectionEditingContext
    : null
  const rowIconSetContext = isIconCategory ? iconSetEditingContext : null

  const content =
    section.category === "css" ? (
      <CssBlock cssProperties={cssStrings} />
    ) : (
      section.properties.map((property) => (
        <VMProperty
          key={property.key}
          property={property}
          workspace={workspace}
          node={node}
          theme={theme}
          allProperties={rowAllProperties}
          themeEditingContext={themeEditingContext}
          fontCollectionEditingContext={rowFontCollectionContext}
          iconSetEditingContext={rowIconSetContext}
        />
      ))
    )

  return (
    <Fragment>
      <VMCategory section={section} />
      <FramerExpandable isExpanded={isExpanded}>{content}</FramerExpandable>
    </Fragment>
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
    gap: "var(--sdn-gaps-tight)",
  },
}
