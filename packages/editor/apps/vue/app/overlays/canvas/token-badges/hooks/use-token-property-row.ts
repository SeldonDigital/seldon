import { useBoardStateStore } from "@app/canvas/board-state-store"
import { useBorderSideVisibilityStore } from "@app/sidebars/properties/hooks/use-border-side-visibility"
import { useSelection } from "@app/workspace/use-selection"
import { useWorkspace } from "@app/workspace/use-workspace"
import {
  flattenNodeProperties,
  getPropertiesSubjectId,
} from "@seldon/editor/lib/properties/inspector/properties-data"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { computed } from "vue"

import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { nodeRelationshipService } from "@seldon/core/workspace/services"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"

import type { Board, Instance, Theme, Variant, Workspace } from "@seldon/core"
import type { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"
import type { ComputedRef } from "vue"

/**
 * The props one `Property` control renders from, for the top-level row of a property
 * key. The editing contexts are always null on a token card, since the canvas edits a
 * component's own properties rather than a theme, font, or icon resource.
 */
export interface TokenRowProps {
  property: FlatProperty
  workspace: Workspace
  node: Variant | Instance | Board
  allProperties: FlatProperty[]
  themeEditingContext: null
  fontCollectionEditingContext: null
  iconSetEditingContext: null
  theme?: Theme
}

/**
 * The selection's property rows, and everything a single `Property` control needs to
 * render from them.
 *
 * The same inputs the properties sidebar builds from, gathered once so both the token
 * badges and their open cards read one flat list. `node` is `null` when nothing is
 * selected, when there is nothing to draw. Vue port of the React `useTokenProperties`.
 */
export interface TokenPropertyData {
  node: ComputedRef<Variant | Instance | Board | null>
  workspace: ComputedRef<Workspace>
  theme: ComputedRef<Theme | undefined>
  flatProperties: ComputedRef<FlatProperty[]>
}

export function useTokenProperties(): TokenPropertyData {
  const { selectedItem } = useSelection()
  const { workspace } = useWorkspace()
  const boardState = useBoardStateStore()
  const borderSides = useBorderSideVisibilityStore()

  const theme = computed(() => {
    const node = selectedItem.value

    if (!node) return undefined

    return workspaceThemeService.getObjectTheme(node, workspace.value) ?? undefined
  })

  const flatProperties = computed<FlatProperty[]>(() => {
    const node = selectedItem.value

    if (!node) return []

    const boardKey = isBoard(node)
      ? getComponentKey(node)
      : (() => {
          const board = nodeRelationshipService.findBoardForNode(node, workspace.value)

          return board ? getComponentKey(board) : undefined
        })()
    const activeState = boardKey ? boardState.getActiveState(boardKey) : undefined
    const shownBorderSides = borderSides.revealed(getPropertiesSubjectId(node))

    return flattenNodeProperties(node, workspace.value, theme.value, shownBorderSides, activeState)
  })

  return { node: selectedItem, workspace, theme, flatProperties }
}

/**
 * The props one `Property` control renders from, for the top-level row of a property
 * key. `null` when the selection does not expose that row.
 */
export function buildTokenRowProps(
  propertyKey: string,
  data: TokenPropertyData,
): TokenRowProps | null {
  const node = data.node.value

  if (!node) return null

  const property = data.flatProperties.value.find(
    (candidate) => !candidate.isSubProperty && candidate.key === propertyKey,
  )

  if (!property) return null

  return {
    property,
    workspace: data.workspace.value,
    node,
    allProperties: data.flatProperties.value,
    theme: data.theme.value,
    themeEditingContext: null,
    fontCollectionEditingContext: null,
    iconSetEditingContext: null,
  }
}
