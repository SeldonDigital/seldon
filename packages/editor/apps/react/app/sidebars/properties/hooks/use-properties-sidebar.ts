import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useNodeActiveState } from "@app/workspace/hooks/use-node-active-state"
import { useSelectedNodeRootId, useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import {
  isFontCollectionEditingSelection,
  resolveActiveFontCollectionEntryId,
} from "@seldon/editor/lib/font-collections/resolve-active-font-collection-entry-id"
import {
  isIconSetEditingSelection,
  resolveActiveIconSetEntryId,
} from "@seldon/editor/lib/icon-sets/resolve-active-icon-set-entry-id"
import { buildPropertyTreeLayout } from "@seldon/editor/lib/properties/inspector/build-property-tree-layout"
import { getThemePropertyControlType } from "@seldon/editor/lib/properties/inspector/get-theme-property-controls"
import { flattenIconSetCategories } from "@seldon/editor/lib/properties/inspector/icon-set-properties-data"
import { buildMetadataProperties } from "@seldon/editor/lib/properties/inspector/metadata-properties-data"
import {
  flattenNodeProperties,
  getPropertiesSubjectId,
} from "@seldon/editor/lib/properties/inspector/properties-data"
import { flattenThemeProperties } from "@seldon/editor/lib/properties/inspector/theme-properties-data"
import {
  isThemeEditingSelection,
  resolveActiveThemeEntryId,
} from "@seldon/editor/lib/themes/resolve-active-theme-entry-id"
import { useMemo } from "react"

import { getComputedTheme } from "@seldon/core/workspace/compute"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { isAuthoredThemeBoard } from "@seldon/core/workspace/helpers/components/resource-board-catalog-ids"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services/font-collection/font-collection.service"
import { workspaceIconSetService } from "@seldon/core/workspace/services/icon-set/icon-set.service"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"

import { useCssStrings } from "../helpers/get-calculated-properties"
import { useRevealedBorderSides } from "./use-border-side-visibility"
import { useFontCollectionProperties } from "./use-font-collection-properties"
import { useIconSetProperties } from "./use-icon-set-properties"
import { useThemeProperties } from "./use-theme-properties"

import type { PropertyTreeProps } from "../PropertiesSidebar"
import type { Board, Instance, Variant, Workspace } from "@seldon/core"
import type {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "@seldon/editor/lib/properties/inspector/editing-contexts"
import type { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"

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
    if (guard(board) && board.variants.some((variant) => variant.id === entryId)) {
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
  const { selection, selectedThemeEntryId, selectedFontCollectionEntryId, selectedIconSetEntryId } =
    useSelection()
  const selectedNodeRootId = useSelectedNodeRootId()
  const { workspace } = useWorkspace({ usePreview: false })
  const { showUnusedProperties, showUnusedIcons } = useEditorConfig()

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

  // Selecting a font collection board directly (not one of its entries) still
  // shows the collection's metadata, so it falls back to the board's default
  // entry. Board component props keep rendering from `selection`.
  const effectiveFontCollectionEntryId = useMemo(() => {
    if (selectedFontCollectionEntryId) return selectedFontCollectionEntryId

    if (selection && isBoard(selection) && isFontCollectionBoard(selection)) {
      return selection.variants[0]?.id ?? null
    }

    return null
  }, [selectedFontCollectionEntryId, selection])

  const activeFontCollectionEntryId = useMemo(
    () =>
      resolveActiveFontCollectionEntryId({
        workspace,
        selectedFontCollectionEntryId: effectiveFontCollectionEntryId,
      }),
    [workspace, effectiveFontCollectionEntryId],
  )

  const isFontCollectionEditingMode = useMemo(
    () => isFontCollectionEditingSelection(workspace, effectiveFontCollectionEntryId),
    [workspace, effectiveFontCollectionEntryId],
  )

  const editedFontCollection = useMemo(() => {
    if (!isFontCollectionEditingMode || !activeFontCollectionEntryId) {
      return null
    }

    return workspaceFontCollectionService.getFontCollection(activeFontCollectionEntryId, workspace)
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

  const activeThemeBoard = useMemo(() => {
    if (!isThemeEditingMode || !activeThemeEntryId) return undefined

    return findBoardForEntry(workspace, isThemeBoard, activeThemeEntryId)
  }, [isThemeEditingMode, activeThemeEntryId, workspace])

  const isAuthoredTheme = activeThemeBoard ? isAuthoredThemeBoard(activeThemeBoard) : false

  const themeProperties = useMemo(() => {
    if (!isThemeEditingMode || !editedTheme) return []
    const entry = activeThemeEntryId ? workspace.themes[activeThemeEntryId] : undefined
    // An authored theme's default variant owns its values: Seldon only seeds the
    // starting tokens, so its stored map is the theme's base, not overrides. Skip
    // the override map for that entry so its rows read as set. A custom variant of
    // the authored theme still layers overrides, so it keeps its override map.
    const isAuthoredDefaultEntry = isAuthoredTheme && entry?.type === "default"
    // Swatches the template theme defines. A swatch missing here was added on
    // the entry itself, so its row is base state rather than an override.
    const baseSwatchIds = entry
      ? new Set(Object.keys(getComputedTheme(entry.template, workspace).swatch))
      : undefined
    const flatProps = flattenThemeProperties(
      editedTheme,
      isAuthoredDefaultEntry ? undefined : entry?.overrides,
      baseSwatchIds,
    )

    return flatProps.map((prop) => ({
      ...prop,
      controlType: prop.controlType || getThemePropertyControlType(prop),
    }))
  }, [isThemeEditingMode, editedTheme, activeThemeEntryId, workspace, isAuthoredTheme])

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
      const author = activeThemeBoard?.author
      // An authored theme owns its identity, so its metadata rows are editable
      // and its Name is the board label shown in the objects sidebar. Stock
      // themes mirror the shipped catalog, so they stay read-only.
      const name = isAuthoredTheme
        ? (activeThemeBoard?.label ?? editedTheme.metadata.name)
        : (entry?.label ?? editedTheme.metadata.name)

      return buildMetadataProperties(
        {
          name,
          description: editedTheme.metadata.description,
          intent: editedTheme.metadata.intent,
          author,
        },
        isAuthoredTheme,
      )
    }

    if (isFontCollectionEditingMode && editedFontCollection && activeFontCollectionEntryId) {
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
    activeThemeBoard,
    isAuthoredTheme,
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

  // Font families now live in the Objects sidebar, so the Properties sidebar no
  // longer builds a families section. Collection-level properties (Name,
  // Description, Font) still render from `metadataProperties`.
  const familyProperties: FlatProperty[] | undefined = undefined

  const { updateFontCollectionProperty } = useFontCollectionProperties(activeFontCollectionEntryId)

  const fontCollectionEditingContext = useMemo((): FontCollectionEditingContext | null => {
    if (!isFontCollectionEditingMode) return null

    return {
      isFontCollectionEditing: true,
      updateFontCollectionProperty,
    }
  }, [isFontCollectionEditingMode, updateFontCollectionProperty])

  const iconProperties = useMemo<FlatProperty[] | undefined>(() => {
    if (!isIconSetEditingMode || !editedIconSet) return undefined

    return flattenIconSetCategories(editedIconSet, iconInclusion, showUnusedIcons)
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
      const board = findBoardForEntry(workspace, isThemeBoard, activeThemeEntryId)

      if (board) return board
    }

    if (isFontCollectionEditingMode && activeFontCollectionEntryId) {
      const board = findBoardForEntry(workspace, isFontCollectionBoard, activeFontCollectionEntryId)

      if (board) return board
    }

    if (isIconSetEditingMode && activeIconSetEntryId) {
      const board = findBoardForEntry(workspace, isIconSetBoard, activeIconSetEntryId)

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
