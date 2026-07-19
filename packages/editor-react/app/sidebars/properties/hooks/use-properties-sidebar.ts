import { resolveActiveFontCollectionEntryId } from "@seldon/editor/lib/font-collections/resolve-active-font-collection-entry-id"
import { isFontCollectionEditingSelection } from "@seldon/editor/lib/font-collections/resolve-active-font-collection-entry-id"
import { resolveActiveIconSetEntryId } from "@seldon/editor/lib/icon-sets/resolve-active-icon-set-entry-id"
import { isIconSetEditingSelection } from "@seldon/editor/lib/icon-sets/resolve-active-icon-set-entry-id"
import { resolveActiveThemeEntryId } from "@seldon/editor/lib/themes/resolve-active-theme-entry-id"
import { isThemeEditingSelection } from "@seldon/editor/lib/themes/resolve-active-theme-entry-id"
import { useMemo } from "react"
import { Board, Instance, Variant, Workspace } from "@seldon/core"
import { getComputedTheme } from "@seldon/core/workspace/compute"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services/font-collection/font-collection.service"
import { workspaceIconSetService } from "@seldon/core/workspace/services/icon-set/icon-set.service"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import { useNodeActiveState } from "@app/workspace/hooks/use-node-active-state"
import {
  useSelectedNodeRootId,
  useSelection,
} from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { buildPropertyTreeLayout } from "@seldon/editor/lib/properties/inspector/build-property-tree-layout"
import type { PropertyTreeProps } from "../PropertiesSidebar"
import type {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "@seldon/editor/lib/properties/inspector/editing-contexts"
import { flattenFontCollectionFamilies } from "@seldon/editor/lib/properties/inspector/font-collection-properties-data"
import { useCssStrings } from "../helpers/get-calculated-properties"
import { getThemePropertyControlType } from "@seldon/editor/lib/properties/inspector/get-theme-property-controls"
import { flattenIconSetCategories } from "@seldon/editor/lib/properties/inspector/icon-set-properties-data"
import { buildMetadataProperties } from "@seldon/editor/lib/properties/inspector/metadata-properties-data"
import {
  FlatProperty,
  flattenNodeProperties,
  getPropertiesSubjectId,
} from "@seldon/editor/lib/properties/inspector/properties-data"
import { flattenThemeProperties } from "@seldon/editor/lib/properties/inspector/theme-properties-data"
import { useRevealedBorderSides } from "./use-border-side-visibility"
import { useFontCollectionProperties } from "./use-font-collection-properties"
import { useIconSetProperties } from "./use-icon-set-properties"
import { useThemeProperties } from "./use-theme-properties"

/**
 * View state for the properties sidebar. `empty` renders the no-selection
 * shell; `tree` carries the fully assembled property tree props.
 */
export type PropertiesSidebarState =
  | { kind: "empty" }
  | { kind: "tree"; treeProps: PropertyTreeProps }

/** Finds the board whose variants include the given entry id. */
function findBoardForEntry<T extends Board>(
  workspace: Workspace,
  guard: (board: Board) => board is T,
  entryId: string,
): T | undefined {
  for (const board of Object.values(workspace.boards)) {
    if (
      guard(board) &&
      board.variants.some((variant) => variant.id === entryId)
    ) {
      return board
    }
  }
  return undefined
}

/**
 * Derives everything the properties sidebar needs from the current selection
 * and workspace. Owns all Model service access, editing-mode guards, and tree
 * prop assembly so the sidebar view-model stays a binding shell.
 */
export function usePropertiesSidebar(): PropertiesSidebarState {
  const {
    selection,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
    selectedIconSetEntryId,
  } = useSelection()
  const selectedNodeRootId = useSelectedNodeRootId()
  const { workspace } = useWorkspace({ usePreview: false })
  const { showUnusedProperties, showUnusedFonts, showUnusedIcons } =
    useEditorConfig()

  const activeThemeEntryId = useMemo(
    () =>
      resolveActiveThemeEntryId({
        workspace,
        selectedThemeEntryId,
      }),
    [workspace, selectedThemeEntryId],
  )

  const isThemeEditingMode = useMemo(
    () => isThemeEditingSelection(workspace, selectedThemeEntryId),
    [workspace, selectedThemeEntryId],
  )

  const activeFontCollectionEntryId = useMemo(
    () =>
      resolveActiveFontCollectionEntryId({
        workspace,
        selectedFontCollectionEntryId,
      }),
    [workspace, selectedFontCollectionEntryId],
  )

  const isFontCollectionEditingMode = useMemo(
    () =>
      isFontCollectionEditingSelection(
        workspace,
        selectedFontCollectionEntryId,
      ),
    [workspace, selectedFontCollectionEntryId],
  )

  const editedFontCollection = useMemo(() => {
    if (!isFontCollectionEditingMode || !activeFontCollectionEntryId) {
      return null
    }
    return workspaceFontCollectionService.getFontCollection(
      activeFontCollectionEntryId,
      workspace,
    )
  }, [isFontCollectionEditingMode, activeFontCollectionEntryId, workspace])

  const activeIconSetEntryId = useMemo(
    () =>
      resolveActiveIconSetEntryId({
        workspace,
        selectedIconSetEntryId,
      }),
    [workspace, selectedIconSetEntryId],
  )

  const isIconSetEditingMode = useMemo(
    () => isIconSetEditingSelection(workspace, selectedIconSetEntryId),
    [workspace, selectedIconSetEntryId],
  )

  const editedIconSet = useMemo(() => {
    if (!isIconSetEditingMode || !activeIconSetEntryId) return null
    return workspaceIconSetService.getIconSet(activeIconSetEntryId, workspace)
  }, [isIconSetEditingMode, activeIconSetEntryId, workspace])

  const iconInclusion = useMemo(() => {
    if (!isIconSetEditingMode || !activeIconSetEntryId) return {}
    return workspaceIconSetService.getInclusion(activeIconSetEntryId, workspace)
  }, [isIconSetEditingMode, activeIconSetEntryId, workspace])

  const {
    updateThemeProperty,
    resetThemeProperty,
    addCustomToken,
    removeCustomToken,
    renameCustomToken,
  } = useThemeProperties(activeThemeEntryId)

  const editedTheme = useMemo(() => {
    if (!isThemeEditingMode || !activeThemeEntryId) return null
    return getComputedTheme(activeThemeEntryId, workspace)
  }, [isThemeEditingMode, activeThemeEntryId, workspace])

  const themeProperties = useMemo(() => {
    if (!isThemeEditingMode || !editedTheme) return []
    const entry = activeThemeEntryId
      ? workspace.themes[activeThemeEntryId]
      : undefined
    // Swatches the template theme defines. A swatch missing here was added on
    // the entry itself, so its row is base state rather than an override.
    const baseSwatchIds = entry
      ? new Set(Object.keys(getComputedTheme(entry.template, workspace).swatch))
      : undefined
    const flatProps = flattenThemeProperties(
      editedTheme,
      entry?.overrides,
      baseSwatchIds,
    )
    return flatProps.map((prop) => ({
      ...prop,
      controlType: prop.controlType || getThemePropertyControlType(prop),
    }))
  }, [isThemeEditingMode, editedTheme, activeThemeEntryId, workspace])

  const borderSideSubjectId =
    selection && !isThemeEditingMode ? getPropertiesSubjectId(selection) : ""
  const shownBorderSides = useRevealedBorderSides(borderSideSubjectId)

  // The board's active interaction state. In a non-Normal state, display values
  // resolve the node's state override bag so the sidebar matches the canvas.
  const activeState = useNodeActiveState(selection ?? null)

  const theme = useMemo(() => {
    if (isThemeEditingMode) {
      return editedTheme || undefined
    }
    if (!selection) return undefined
    return workspaceThemeService.getObjectTheme(selection, workspace)
  }, [selection, workspace, isThemeEditingMode, editedTheme])

  const flatProperties = useMemo(() => {
    if (isThemeEditingMode) {
      return themeProperties
    }
    if (!selection) return []
    const allProperties = flattenNodeProperties(
      selection,
      workspace,
      theme,
      shownBorderSides,
      activeState,
    )

    if (!showUnusedProperties) {
      return allProperties.filter((property) => property.status !== "not used")
    }

    return allProperties
  }, [
    selection,
    workspace,
    theme,
    showUnusedProperties,
    isThemeEditingMode,
    themeProperties,
    shownBorderSides,
    activeState,
  ])

  const canAddCustom = useMemo(() => {
    if (!isThemeEditingMode || !activeThemeEntryId) return false
    return workspace.themes[activeThemeEntryId]?.type === "variant"
  }, [isThemeEditingMode, activeThemeEntryId, workspace])

  const themeEditingContext = useMemo((): ThemeEditingContext | null => {
    if (!isThemeEditingMode) return null
    return {
      isThemeEditing: true,
      updateThemeProperty,
      resetThemeProperty,
      addCustomToken,
      removeCustomToken,
      renameCustomToken,
      canAddCustom,
    }
  }, [
    isThemeEditingMode,
    updateThemeProperty,
    resetThemeProperty,
    addCustomToken,
    removeCustomToken,
    renameCustomToken,
    canAddCustom,
  ])

  const metadataProperties = useMemo<FlatProperty[] | undefined>(() => {
    if (isThemeEditingMode && editedTheme && activeThemeEntryId) {
      const entry = workspace.themes[activeThemeEntryId]
      const board = findBoardForEntry(
        workspace,
        isThemeBoard,
        activeThemeEntryId,
      )
      const author = board?.author
      return buildMetadataProperties({
        name: entry?.label ?? editedTheme.metadata.name,
        description: editedTheme.metadata.description,
        intent: editedTheme.metadata.intent,
        author,
      })
    }
    if (
      isFontCollectionEditingMode &&
      editedFontCollection &&
      activeFontCollectionEntryId
    ) {
      const entry = workspace["font-collections"][activeFontCollectionEntryId]
      return buildMetadataProperties({
        name: entry?.label ?? editedFontCollection.metadata.name,
        description: editedFontCollection.metadata.description,
        intent: editedFontCollection.metadata.intent,
      })
    }
    if (isIconSetEditingMode && editedIconSet && activeIconSetEntryId) {
      const entry = workspace["icon-sets"][activeIconSetEntryId]
      return buildMetadataProperties({
        name: entry?.label ?? editedIconSet.metadata.name,
        description: editedIconSet.metadata.description,
        intent: editedIconSet.metadata.intent,
      })
    }
    return undefined
  }, [
    isThemeEditingMode,
    editedTheme,
    activeThemeEntryId,
    isFontCollectionEditingMode,
    editedFontCollection,
    activeFontCollectionEntryId,
    isIconSetEditingMode,
    editedIconSet,
    activeIconSetEntryId,
    workspace,
  ])

  // Variant label for the selected resource, used to title the metadata section
  // as "Family · Variant" (mirroring component headers).
  const metadataVariantLabel = useMemo<string | undefined>(() => {
    if (isThemeEditingMode && activeThemeEntryId) {
      return workspace.themes[activeThemeEntryId]?.label
    }
    if (isFontCollectionEditingMode && activeFontCollectionEntryId) {
      return workspace["font-collections"][activeFontCollectionEntryId]?.label
    }
    if (isIconSetEditingMode && activeIconSetEntryId) {
      return workspace["icon-sets"][activeIconSetEntryId]?.label
    }
    return undefined
  }, [
    isThemeEditingMode,
    activeThemeEntryId,
    isFontCollectionEditingMode,
    activeFontCollectionEntryId,
    isIconSetEditingMode,
    activeIconSetEntryId,
    workspace,
  ])

  const fontVariantSelection = useMemo(() => {
    if (!isFontCollectionEditingMode || !activeFontCollectionEntryId) return {}
    return workspaceFontCollectionService.getVariantSelection(
      activeFontCollectionEntryId,
      workspace,
    )
  }, [isFontCollectionEditingMode, activeFontCollectionEntryId, workspace])

  const familyProperties = useMemo<FlatProperty[] | undefined>(() => {
    if (!isFontCollectionEditingMode || !editedFontCollection) return undefined
    return flattenFontCollectionFamilies(
      editedFontCollection,
      fontVariantSelection,
      showUnusedFonts,
    )
  }, [
    isFontCollectionEditingMode,
    editedFontCollection,
    fontVariantSelection,
    showUnusedFonts,
  ])

  const { updateFontCollectionProperty } = useFontCollectionProperties(
    activeFontCollectionEntryId,
  )

  const fontCollectionEditingContext =
    useMemo((): FontCollectionEditingContext | null => {
      if (!isFontCollectionEditingMode) return null
      return {
        isFontCollectionEditing: true,
        updateFontCollectionProperty,
      }
    }, [isFontCollectionEditingMode, updateFontCollectionProperty])

  const iconProperties = useMemo<FlatProperty[] | undefined>(() => {
    if (!isIconSetEditingMode || !editedIconSet) return undefined
    return flattenIconSetCategories(
      editedIconSet,
      iconInclusion,
      showUnusedIcons,
    )
  }, [isIconSetEditingMode, editedIconSet, iconInclusion, showUnusedIcons])

  const { updateIconSetProperty } = useIconSetProperties(activeIconSetEntryId)

  const iconSetEditingContext = useMemo((): IconSetEditingContext | null => {
    if (!isIconSetEditingMode) return null
    return {
      isIconSetEditing: true,
      updateIconSetProperty,
    }
  }, [isIconSetEditingMode, updateIconSetProperty])

  const propertyTreeNode = useMemo((): Variant | Instance | Board | null => {
    if (selection) {
      return selection as Variant | Instance | Board
    }
    if (isThemeEditingMode && activeThemeEntryId) {
      const board = findBoardForEntry(
        workspace,
        isThemeBoard,
        activeThemeEntryId,
      )
      if (board) return board
    }
    if (isFontCollectionEditingMode && activeFontCollectionEntryId) {
      const board = findBoardForEntry(
        workspace,
        isFontCollectionBoard,
        activeFontCollectionEntryId,
      )
      if (board) return board
    }
    if (isIconSetEditingMode && activeIconSetEntryId) {
      const board = findBoardForEntry(
        workspace,
        isIconSetBoard,
        activeIconSetEntryId,
      )
      if (board) return board
    }
    return null
  }, [
    selection,
    isThemeEditingMode,
    activeThemeEntryId,
    isFontCollectionEditingMode,
    activeFontCollectionEntryId,
    isIconSetEditingMode,
    activeIconSetEntryId,
    workspace,
  ])

  const { declarations: cssStrings, selector: cssSelector } = useCssStrings(
    propertyTreeNode,
    selectedNodeRootId,
  )

  const { sections, allProperties } = useMemo(() => {
    if (!propertyTreeNode) {
      return { sections: [], allProperties: [] }
    }
    return buildPropertyTreeLayout({
      properties: flatProperties,
      workspace,
      node: propertyTreeNode,
      theme,
      themeEditingContext,
      metadataProperties,
      metadataVariantLabel,
      familyProperties,
      iconProperties,
      cssStringCount: cssStrings.length,
    })
  }, [
    flatProperties,
    workspace,
    propertyTreeNode,
    theme,
    themeEditingContext,
    metadataProperties,
    metadataVariantLabel,
    familyProperties,
    iconProperties,
    cssStrings.length,
  ])

  if (!propertyTreeNode) {
    return { kind: "empty" }
  }

  return {
    kind: "tree",
    treeProps: {
      workspace,
      node: propertyTreeNode,
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
    },
  }
}
