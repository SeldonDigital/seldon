import { computed, type ComputedRef } from "vue"
import {
  type Board,
  type Instance,
  type Theme,
  type ThemeCustomTokenSection,
  type Variant,
  type Workspace,
  buildEmptyCustomTokenPayload,
} from "@seldon/core"
import { getComputedTheme } from "@seldon/core/workspace/compute"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { nodeRelationshipService } from "@seldon/core/workspace/services"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services/font-collection/font-collection.service"
import { workspaceIconSetService } from "@seldon/core/workspace/services/icon-set/icon-set.service"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import type { EntryThemeId } from "@seldon/core/workspace/types"
import {
  buildThemeEditActions,
  buildThemeResetAction,
} from "@seldon/editor/lib/themes/build-theme-edit-actions"
import {
  buildFontCollectionEditAction,
  buildIconSetEditAction,
} from "@seldon/editor/lib/resources/build-resource-edit-actions"
import { buildPropertyTreeLayout } from "@seldon/editor/lib/properties/inspector/build-property-tree-layout"
import type {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "@seldon/editor/lib/properties/inspector/editing-contexts"
import { flattenFontCollectionFamilies } from "@seldon/editor/lib/properties/inspector/font-collection-properties-data"
import { getThemePropertyControlType } from "@seldon/editor/lib/properties/inspector/get-theme-property-controls"
import { flattenIconSetCategories } from "@seldon/editor/lib/properties/inspector/icon-set-properties-data"
import { buildMetadataProperties } from "@seldon/editor/lib/properties/inspector/metadata-properties-data"
import {
  type FlatProperty,
  flattenNodeProperties,
  getPropertiesSubjectId,
} from "@seldon/editor/lib/properties/inspector/properties-data"
import { flattenThemeProperties } from "@seldon/editor/lib/properties/inspector/theme-properties-data"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { useBoardStateStore } from "@app/canvas/board-state-store"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import { useSelection } from "@app/workspace/use-selection"
import { useWorkspace } from "@app/workspace/use-workspace"
import { getScopedNodeCss } from "../helpers/get-calculated-properties"
import { useBorderSideVisibilityStore } from "./use-border-side-visibility"
import type { PropertySection } from "../types"

export interface PropertiesSidebarTree {
  workspace: Workspace
  node: Variant | Instance | Board
  theme?: Theme
  sections: PropertySection[]
  allProperties: FlatProperty[]
  familyProperties?: FlatProperty[]
  iconProperties?: FlatProperty[]
  cssStrings: string[]
  cssSelector: string | null
  themeEditingContext: ThemeEditingContext | null
  fontCollectionEditingContext: FontCollectionEditingContext | null
  iconSetEditingContext: IconSetEditingContext | null
}

export type PropertiesSidebarState =
  | { kind: "empty" }
  | { kind: "tree"; tree: PropertiesSidebarTree }

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
 * Derives the properties sidebar state from the current selection and
 * workspace: the no-selection shell or the assembled property tree with sections,
 * the full row lookup, editing contexts, and CSS. Vue port of the React
 * `usePropertiesSidebar`, reusing the shared `buildPropertyTreeLayout`.
 */
export function usePropertiesSidebar(): ComputedRef<PropertiesSidebarState> {
  const dispatch = useDispatch()
  const { workspace } = useWorkspace()
  const {
    selectedItem,
    selectedNodeRootId,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
    selectedIconSetEntryId,
  } = useSelection()
  const config = useEditorConfigStore()
  const boardState = useBoardStateStore()
  const borderSides = useBorderSideVisibilityStore()

  return computed<PropertiesSidebarState>(() => {
    const ws = workspace.value
    const selection = selectedItem.value

    const themeEntryId = selectedThemeEntryId.value as EntryThemeId | null
    const fontEntryId = selectedFontCollectionEntryId.value
    const iconEntryId = selectedIconSetEntryId.value

    const isThemeEditing = Boolean(themeEntryId && ws.themes[themeEntryId])
    const isFontEditing = Boolean(fontEntryId && ws["font-collections"][fontEntryId])
    const isIconEditing = Boolean(iconEntryId && ws["icon-sets"][iconEntryId])

    // ---- Theme editing ----
    let themeEditingContext: ThemeEditingContext | null = null
    let flatProperties: FlatProperty[] = []
    let theme: Theme | undefined
    let metadataProperties: FlatProperty[] | undefined
    let metadataVariantLabel: string | undefined
    let familyProperties: FlatProperty[] | undefined
    let iconProperties: FlatProperty[] | undefined
    let node: Variant | Instance | Board | null = selection

    if (selection) {
      theme = workspaceThemeService.getObjectTheme(selection, ws) ?? undefined
      const boardKey = isBoard(selection)
        ? getComponentKey(selection)
        : (() => {
            const board = nodeRelationshipService.findBoardForNode(selection, ws)
            return board ? getComponentKey(board) : undefined
          })()
      const activeState = boardKey
        ? boardState.getActiveState(boardKey)
        : undefined
      const shownBorderSides = borderSides.revealed(
        getPropertiesSubjectId(selection),
      )
      flatProperties = flattenNodeProperties(
        selection,
        ws,
        theme,
        shownBorderSides,
        activeState,
      ).filter(
        (property) =>
          config.showUnusedProperties || property.status !== "not used",
      )
    } else if (isThemeEditing && themeEntryId) {
      const entry = ws.themes[themeEntryId]
      const computedTheme = getComputedTheme(themeEntryId, ws)
      theme = computedTheme
      const baseSwatchIds = new Set(
        Object.keys(getComputedTheme(entry.template, ws).swatch),
      )
      flatProperties = flattenThemeProperties(
        computedTheme,
        entry.overrides,
        baseSwatchIds,
      ).map((property) => ({
        ...property,
        controlType: property.controlType || getThemePropertyControlType(property),
      }))
      metadataVariantLabel = entry.label
      const board = findBoardForEntry(ws, isThemeBoard, themeEntryId)
      metadataProperties = buildMetadataProperties({
        name: entry.label ?? computedTheme.metadata.name,
        description: computedTheme.metadata.description,
        intent: computedTheme.metadata.intent,
        author: board?.author,
      })
      const canAddCustom = entry.type === "variant"
      themeEditingContext = {
        isThemeEditing: true,
        canAddCustom,
        updateThemeProperty: (property, value) => {
          for (const action of buildThemeEditActions(
            themeEntryId,
            property.key,
            value,
            ws,
          )) {
            dispatch(action as never)
          }
        },
        resetThemeProperty: (property) => {
          const action = buildThemeResetAction(themeEntryId, property.key)
          if (action) dispatch(action as never)
        },
        addCustomToken: (section: ThemeCustomTokenSection) =>
          dispatch({
            type: `add_theme_custom_${section}`,
            payload: {
              themeId: themeEntryId,
              ...buildEmptyCustomTokenPayload(section),
            },
          } as never),
        removeCustomToken: (section, key) =>
          dispatch({
            type: `remove_theme_custom_${section}`,
            payload: { themeId: themeEntryId, key },
          } as never),
        renameCustomToken: (section, key, name) =>
          dispatch({
            type: "set_theme_custom_token_name",
            payload: { themeId: themeEntryId, section, key, name },
          } as never),
      }
      node = findBoardForEntry(ws, isThemeBoard, themeEntryId) ?? null
    }

    // ---- Font collection editing ----
    let fontCollectionEditingContext: FontCollectionEditingContext | null = null
    if (!selection && isFontEditing && fontEntryId) {
      const collection = workspaceFontCollectionService.getFontCollection(
        fontEntryId,
        ws,
      )
      const entry = ws["font-collections"][fontEntryId]
      if (collection) {
        const selectionMap = workspaceFontCollectionService.getVariantSelection(
          fontEntryId,
          ws,
        )
        familyProperties = flattenFontCollectionFamilies(
          collection,
          selectionMap,
          config.showUnusedFonts,
        )
        metadataVariantLabel = entry?.label
        metadataProperties = buildMetadataProperties({
          name: entry?.label ?? collection.metadata.name,
          description: collection.metadata.description,
          intent: collection.metadata.intent,
        })
        fontCollectionEditingContext = {
          isFontCollectionEditing: true,
          updateFontCollectionProperty: (property, value) => {
            const action = buildFontCollectionEditAction(
              fontEntryId,
              property.key,
              value,
            )
            if (action) dispatch(action as never)
          },
        }
        node = findBoardForEntry(ws, isFontCollectionBoard, fontEntryId) ?? null
      }
    }

    // ---- Icon set editing ----
    let iconSetEditingContext: IconSetEditingContext | null = null
    if (!selection && isIconEditing && iconEntryId) {
      const set = workspaceIconSetService.getIconSet(iconEntryId, ws)
      const entry = ws["icon-sets"][iconEntryId]
      if (set) {
        const inclusion = workspaceIconSetService.getInclusion(iconEntryId, ws)
        iconProperties = flattenIconSetCategories(
          set,
          inclusion,
          config.showUnusedIcons,
        )
        metadataVariantLabel = entry?.label
        metadataProperties = buildMetadataProperties({
          name: entry?.label ?? set.metadata.name,
          description: set.metadata.description,
          intent: set.metadata.intent,
        })
        iconSetEditingContext = {
          isIconSetEditing: true,
          updateIconSetProperty: (property, value) => {
            const action = buildIconSetEditAction(iconEntryId, property.key, value)
            if (action) dispatch(action as never)
          },
        }
        node = findBoardForEntry(ws, isIconSetBoard, iconEntryId) ?? null
      }
    }

    if (!node) return { kind: "empty" }

    const cssNodeId = isBoard(node) ? null : node.id
    const { declarations: cssStrings, selector: cssSelector } = cssNodeId
      ? getScopedNodeCss(cssNodeId, selectedNodeRootId.value)
      : { declarations: [], selector: null }

    const { sections, allProperties } = buildPropertyTreeLayout({
      properties: flatProperties,
      workspace: ws,
      node,
      theme,
      themeEditingContext,
      metadataProperties,
      metadataVariantLabel,
      familyProperties,
      iconProperties,
      cssStringCount: cssStrings.length,
    })

    return {
      kind: "tree",
      tree: {
        workspace: ws,
        node,
        theme,
        sections: sections as PropertySection[],
        allProperties,
        familyProperties,
        iconProperties,
        cssStrings,
        cssSelector,
        themeEditingContext,
        fontCollectionEditingContext,
        iconSetEditingContext,
      },
    }
  })
}
