import { LayoutGroup } from "framer-motion"
import { Fragment, RefObject, useCallback, useMemo } from "react"
import { MenuEntry } from "@lib/menus"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import {
  Board,
  Instance,
  type LayeredPaintKey,
  Theme,
  Variant,
  Workspace,
  isThemeCustomTokenSection,
} from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { useObjectProperties } from "@lib/workspace/hooks/use-object-properties"
import { usePropertiesSidebar } from "./hooks/use-properties-sidebar"
import { useIsCategoryExpanded } from "./hooks/use-property-expansion"
import {
  ScrollerShell,
  SidebarContainer,
} from "@seldon/components/custom-components"
import { Frame } from "@seldon/components/frames/Frame"
import {
  sidebarNoSelectionStyle,
  sidebarShellStyle,
} from "../helpers/sidebar-styles"
import { FramerExpandable } from "@seldon/components/custom-components"
import { VMCategory } from "./VMCategory"
import { CssBlock } from "./CssBlock"
import { VMProperty } from "./VMProperty"
import {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "./helpers/editing-contexts"
import {
  PropertySection,
} from "./helpers/get-property-sections"
import {
  ThemePropertySection,
} from "./helpers/get-theme-property-sections"
import { getIconRowCategory } from "./helpers/icon-set-properties-data"
import { FlatProperty } from "./helpers/properties-data"

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
  sections: Array<PropertySection | ThemePropertySection>
  allProperties: FlatProperty[]
  cssStrings: string[]
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
  sections,
  allProperties,
  cssStrings,
}: PropertyTreeProps) {
  return (
    <ScrollerShell ref={scrollerRef} style={styles.scroller}>
      <Frame style={styles.tree}>
        <LayoutGroup>
          {sections.map((section) => (
            <TreeSection
              key={section.category}
              section={section}
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
  const isExpanded = useIsCategoryExpanded(section.category)
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

  const addToast = useAddToast()
  const handleCopyCss = useCallback(async () => {
    const cssText = cssStrings.join("\n")
    try {
      await navigator.clipboard.writeText(cssText)
      addToast("CSS copied to clipboard")
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }, [cssStrings, addToast])

  // Theme variants can add a custom token to any custom-capable section. The
  // "+" button shows only in theme editing on a variant, never on `core`.
  const onAddCustom = useMemo<(() => void) | undefined>(() => {
    if (!themeEditingContext?.isThemeEditing) return undefined
    if (!themeEditingContext.canAddCustom) return undefined
    if (!isThemeCustomTokenSection(section.category)) return undefined
    const themeSection = section.category
    return () => themeEditingContext.addCustomToken(themeSection)
  }, [themeEditingContext, section.category])

  const { addNodeLayer } = useObjectProperties()

  // A component node can stack extra paint layers. Offer "Add Background/Gradient/
  // Shadow" on the category that owns each exposed layered property.
  const layerAddActions = useMemo<MenuEntry[]>(() => {
    const inEditingMode =
      !!themeEditingContext?.isThemeEditing ||
      !!fontCollectionEditingContext?.isFontCollectionEditing ||
      !!iconSetEditingContext?.isIconSetEditing
    if (inEditingMode || isBoard(node)) return []

    const layeredKeys: LayeredPaintKey[] = ["background", "gradient", "shadow"]
    const labels: Record<LayeredPaintKey, string> = {
      background: "Background",
      gradient: "Gradient",
      shadow: "Shadow",
    }
    return layeredKeys
      .filter((key) =>
        section.properties.some(
          (property) => property.key === key && property.status !== "not used",
        ),
      )
      .map((key) => ({
        id: `add-layer-${key}`,
        label: `Add ${labels[key]}`,
        onSelect: () => addNodeLayer(key),
        testId: `add-layer-${key}`,
      }))
  }, [
    node,
    section.properties,
    themeEditingContext,
    fontCollectionEditingContext,
    iconSetEditingContext,
    addNodeLayer,
  ])

  const sectionActions = useMemo((): MenuEntry[] | undefined => {
    if (section.category === "css" && cssStrings.length > 0) {
      return [
        {
          id: "copy-css",
          label: "Copy CSS",
          onSelect: () => {
            void handleCopyCss()
          },
          testId: "copy-css",
        },
      ]
    }
    return layerAddActions.length > 0 ? layerAddActions : undefined
  }, [section.category, cssStrings.length, handleCopyCss, layerAddActions])

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
      <VMCategory
        section={section}
        actions={sectionActions}
        onAddCustom={onAddCustom}
      />
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
