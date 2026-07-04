import { MenuEntry } from "@lib/menus"
import { LayoutGroup } from "framer-motion"
import { Fragment, useCallback, useDeferredValue, useMemo } from "react"
import {
  Board,
  Instance,
  type LayeredPaintKey,
  Theme,
  Variant,
  Workspace,
  getBorderSideOptions,
  getLayerAddOptions,
  isThemeCustomTokenSection,
} from "@seldon/core"
import { PropertyDisplayCategory } from "@seldon/core/properties/schemas"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { useObjectProperties } from "@lib/workspace/hooks/use-object-properties"
import {
  useBorderSideVisibility,
  useRevealedBorderSides,
} from "./hooks/use-border-side-visibility"
import { useFilterInput } from "./hooks/use-filter-input"
import { useLayerDragMonitor } from "./hooks/use-layer-drag-monitor"
import { usePropertiesSidebar } from "./hooks/use-properties-sidebar"
import { PropertyEditNavigationProvider } from "./hooks/use-property-edit-navigation"
import { useIsCategoryExpanded } from "./hooks/use-property-expansion"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { Box, FramerExpandable } from "@seldon/components/custom-components"
import { SidebarProperties } from "@seldon/components/modules/SidebarProperties"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { CssBlock } from "./CssBlock"
import { VMCategory } from "./VMCategory"
import { VMProperty } from "./VMProperty"
import {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "./helpers/editing-contexts"
import { filterPropertySections } from "./helpers/filter-property-sections"
import { PropertySection } from "./helpers/get-property-sections"
import { ThemePropertySection } from "./helpers/get-theme-property-sections"
import { getIconRowCategory } from "./helpers/icon-set-properties-data"
import {
  FlatProperty,
  getAllowedBorderSides,
  getPropertiesSubjectId,
} from "./helpers/properties-data"
import { PROPERTIES_TREE_GAP } from "./properties.bespoke"

export interface PropertyTreeProps {
  workspace: Workspace
  node: Variant | Instance | Board
  theme?: Theme
  themeEditingContext?: ThemeEditingContext | null
  fontCollectionEditingContext?: FontCollectionEditingContext | null
  iconSetEditingContext?: IconSetEditingContext | null
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
  cssSelector: string | null
}

/**
 * View-model for the properties sidebar. Renders the no-selection shell or
 * the property tree for the current selection.
 */
export function VMPropertiesSidebar() {
  const state = usePropertiesSidebar()
  const filter = useFilterInput()

  // Selecting a node rebuilds and remounts the whole inspector, which is heavy
  // enough to block the triggering click. Render the tree from a deferred copy
  // of the state so the click commits immediately and the new inspector fills
  // in at transition priority. While a row is being edited the live value comes
  // from the control's own input state, so a one-frame-late tree update is not
  // visible. This works for the external selection store, where startTransition
  // would not.
  const deferredState = useDeferredValue(state)

  // Live-filter the rendered rows by label or current value. The lookup table
  // (`allProperties`) stays full so a matched compound or shorthand parent can
  // still resolve its child rows.
  const sections = useMemo(
    () =>
      deferredState.kind === "tree"
        ? filterPropertySections(deferredState.treeProps.sections, filter.query)
        : [],
    [deferredState, filter.query],
  )

  if (deferredState.kind === "empty") {
    return (
      <SidebarProperties
        data-testid="properties-sidebar"
        comboboxFieldFilter={filter.comboboxField}
        input={filter.input}
        buttonIconic={filter.buttonIconic}
        style={styles.sidebar}
      />
    )
  }

  const seldonRefs = {
    propertiesContainer: {
      style: styles.frame,
      children: (
        <PropertiesTree {...deferredState.treeProps} sections={sections} />
      ),
    },
  }

  return (
    <SidebarProperties
      data-testid="properties-sidebar"
      comboboxFieldFilter={filter.comboboxField}
      input={filter.input}
      buttonIconic={filter.buttonIconic}
      seldonRefs={seldonRefs}
      style={styles.sidebar}
    />
  )
}

/**
 * Orchestrates rendering of property sections and properties in a tree
 * structure. Groups properties into sections and handles expansion state.
 */
function PropertiesTree({
  workspace,
  node,
  theme,
  themeEditingContext,
  fontCollectionEditingContext,
  iconSetEditingContext,
  familyProperties,
  iconProperties,
  sections,
  allProperties,
  cssStrings,
  cssSelector,
}: PropertyTreeProps) {
  useLayerDragMonitor()

  const sectionNodes = sections.map((section) => (
    <TreeSection
      key={section.category}
      section={section}
      workspace={workspace}
      node={node}
      theme={theme}
      cssStrings={cssStrings}
      cssSelector={cssSelector}
      allProperties={allProperties}
      familyProperties={familyProperties}
      iconProperties={iconProperties}
      themeEditingContext={themeEditingContext}
      fontCollectionEditingContext={fontCollectionEditingContext}
      iconSetEditingContext={iconSetEditingContext}
    />
  ))

  return (
    <Box style={styles.scroller}>
      <Box style={styles.tree}>
        <PropertyEditNavigationProvider>
          <LayoutGroup>{sectionNodes}</LayoutGroup>
        </PropertyEditNavigationProvider>
      </Box>
    </Box>
  )
}

interface TreeSectionProps {
  section: PropertySection | ThemePropertySection
  workspace: Workspace
  node: Variant | Instance | Board
  theme?: Theme
  cssStrings: string[]
  cssSelector: string | null
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
  cssSelector,
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

  const handleCopySelector = useCallback(async () => {
    if (!cssSelector) return
    const indentedDeclarations = cssStrings
      .map((declaration) => `  ${declaration}`)
      .join("\n")
    const ruleText = `${cssSelector} {\n${indentedDeclarations}\n}`
    try {
      await navigator.clipboard.writeText(ruleText)
      addToast("Selector copied to clipboard")
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }, [cssSelector, cssStrings, addToast])

  // Theme variants can add a custom token to any custom-capable section. The
  // "+" button shows only in theme editing on a variant, never on `core`.
  const onAddCustom = useMemo<(() => void) | undefined>(() => {
    if (!themeEditingContext?.isThemeEditing) return undefined
    if (!themeEditingContext.canAddCustom) return undefined
    if (!isThemeCustomTokenSection(section.category)) return undefined
    const themeSection = section.category
    return () => themeEditingContext.addCustomToken(themeSection)
  }, [themeEditingContext, section.category])

  const { addNodeLayer, applyBoardPropertiesToAllBoards, resetComponentBoard } =
    useObjectProperties()
  const { toggleBorderSide } = useBorderSideVisibility()
  const borderSubjectId = getPropertiesSubjectId(node)
  const shownBorderSides = useRevealedBorderSides(borderSubjectId)

  // A board's header section (the attributes category) carries the board-level
  // commands: pushing this board's setup (properties and theme) onto every
  // other component board, and resetting the board back to its defaults. Both
  // are single workspace actions, so an AI agent fires the same mutations.
  const boardActions = useMemo<MenuEntry[]>(() => {
    if (!isBoard(node)) return []
    if (section.category !== PropertyDisplayCategory.ATTRIBUTES) return []

    const boardKey = getComponentKey(node)
    return [
      {
        id: "apply-to-all-boards",
        label: "Apply to All Boards",
        onSelect: () => {
          const confirmed = window.confirm(
            "Apply this board's properties and theme to all other component boards? This overwrites their board setup.",
          )
          if (!confirmed) return
          applyBoardPropertiesToAllBoards({ sourceBoardKey: boardKey })
        },
        testId: "board-apply-to-all",
      },
      "separator",
      {
        id: "reset-board",
        label: "Reset Board",
        onSelect: () => {
          const confirmed = window.confirm(
            "Reset this board's properties and theme to their defaults?",
          )
          if (!confirmed) return
          resetComponentBoard({ boardKey })
        },
        testId: "board-reset",
      },
    ]
  }, [
    node,
    section.category,
    applyBoardPropertiesToAllBoards,
    resetComponentBoard,
  ])

  // A component node can stack extra paint layers. Offer "Add Background/Gradient/
  // Shadow" on the category that owns each exposed layered property.
  const layerAddActions = useMemo<MenuEntry[]>(() => {
    const inEditingMode =
      !!themeEditingContext?.isThemeEditing ||
      !!fontCollectionEditingContext?.isFontCollectionEditing ||
      !!iconSetEditingContext?.isIconSetEditing
    if (inEditingMode || isBoard(node)) return []

    const layeredKeys: LayeredPaintKey[] = ["background", "shadow"]
    const exposedKeys = layeredKeys.filter((key) =>
      section.properties.some(
        (property) => property.key === key && property.status !== "not used",
      ),
    )

    // Core decides each layered property's add options (Background splits into
    // typed Color/Image/Gradient seeds; others add a single empty layer).
    const entries: MenuEntry[] = []
    for (const key of exposedKeys) {
      for (const option of getLayerAddOptions(key)) {
        entries.push({
          id: option.id,
          label: option.label,
          onSelect: () => addNodeLayer(key, option.seed),
          testId: option.id,
        })
      }
    }
    return entries
  }, [
    node,
    section.properties,
    themeEditingContext,
    fontCollectionEditingContext,
    iconSetEditingContext,
    addNodeLayer,
  ])

  // The appearance section (the one that owns the `border` row) can show or hide
  // each border side row. Each entry toggles visibility only; it writes nothing
  // to the node. Sides the schema does not expose render dimmed and inert.
  const borderSideActions = useMemo<MenuEntry[]>(() => {
    const inEditingMode =
      !!themeEditingContext?.isThemeEditing ||
      !!fontCollectionEditingContext?.isFontCollectionEditing ||
      !!iconSetEditingContext?.isIconSetEditing
    if (inEditingMode || isBoard(node)) return []

    const hasBorderRow = section.properties.some(
      (property) => property.key === "border",
    )
    if (!hasBorderRow) return []

    const allowed = new Set(getAllowedBorderSides(node, workspace))
    return getBorderSideOptions().map((option) => {
      const isAllowed = allowed.has(option.side)
      const isShown = shownBorderSides.has(option.side)
      return {
        id: option.id,
        label: `${isShown ? "Hide" : "Show"} ${option.label}`,
        disabled: !isAllowed,
        onSelect: isAllowed
          ? () => toggleBorderSide(borderSubjectId, option.side)
          : undefined,
        testId: option.id,
      }
    })
  }, [
    node,
    workspace,
    section.properties,
    shownBorderSides,
    borderSubjectId,
    toggleBorderSide,
    themeEditingContext,
    fontCollectionEditingContext,
    iconSetEditingContext,
  ])

  const sectionActions = useMemo((): MenuEntry[] | undefined => {
    if (boardActions.length > 0) return boardActions
    if (section.category === "css" && cssStrings.length > 0) {
      const actions: MenuEntry[] = [
        {
          id: "copy-css",
          label: "Copy CSS",
          onSelect: () => {
            void handleCopyCss()
          },
          testId: "copy-css",
        },
      ]
      if (cssSelector) {
        actions.push({
          id: "copy-selector",
          label: "Copy Selector",
          onSelect: () => {
            void handleCopySelector()
          },
          testId: "copy-selector",
        })
      }
      return actions
    }
    const appearanceActions: MenuEntry[] =
      layerAddActions.length > 0 && borderSideActions.length > 0
        ? [...layerAddActions, "separator", ...borderSideActions]
        : [...layerAddActions, ...borderSideActions]
    return appearanceActions.length > 0 ? appearanceActions : undefined
  }, [
    section.category,
    cssStrings.length,
    cssSelector,
    handleCopyCss,
    handleCopySelector,
    boardActions,
    layerAddActions,
    borderSideActions,
  ])

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
  sidebar: {
    height: "100%",
    minHeight: 0,
  },
  frame: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column" as const,
  },
  scroller: {
    flex: 1,
    minHeight: 0,
    overflowX: "hidden" as const,
    overflowY: "auto" as const,
  },
  tree: {
    padding: "0.25rem 0 0.75rem 0",
    display: "flex",
    flexDirection: "column" as const,
    gap: PROPERTIES_TREE_GAP,
  },
}
