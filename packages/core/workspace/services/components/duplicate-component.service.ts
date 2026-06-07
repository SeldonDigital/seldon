import type { WritableDraft } from "immer"

import { walkBoardTreeRefs } from "../../helpers/components/walk-board-tree-refs"
import {
  getBoardOrder,
  setBoardOrder,
} from "../../helpers/components/board-sort-order"
import type { ComponentTreeRef } from "../../model/component-tree"
import type {
  Board,
  FontCollectionBoard,
  IconSetBoard,
  MediaBoard,
  ThemeBoard,
} from "../../model/components"
import {
  isComponentBoard,
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "../../model/components"
import type { EntryNode } from "../../model/entry-node"
import type { EntryTheme } from "../../model/entry-theme"
import {
  formatNodeLink,
  formatThemeLink,
  parseNodeLink,
  parseThemeTemplate,
} from "../../model/template-ref"
import { invariant } from "../../../index"
import type { Workspace } from "../../types"
import { mutateWorkspace } from "../shared/workspace-mutation.helper"
import { boardOrderService } from "./board-order.service"

function collectTreeIds(roots: ComponentTreeRef[]): string[] {
  const ids: string[] = []
  walkBoardTreeRefs(roots, (ref) => {
    ids.push(ref.id)
  })
  return [...new Set(ids)]
}

function remapComponentTree(roots: ComponentTreeRef[], idMap: Map<string, string>): ComponentTreeRef[] {
  const mapRef = (ref: ComponentTreeRef): ComponentTreeRef => ({
    id: idMap.get(ref.id) ?? ref.id,
    children: ref.children?.map(mapRef),
  })
  return roots.map(mapRef)
}

function buildPrefixIdMap(
  sourceBoardKey: string,
  newBoardKey: string,
  ids: string[],
  prefix: string,
): Map<string, string> {
  const fullPrefix = `${prefix}${sourceBoardKey}-`
  const map = new Map<string, string>()
  for (const id of ids) {
    if (id.startsWith(fullPrefix)) {
      map.set(id, `${prefix}${newBoardKey}-` + id.slice(fullPrefix.length))
    }
  }
  return map
}

function cloneNodeEntry(
  node: EntryNode,
  newId: string,
  idMap: Map<string, string>,
): EntryNode {
  const clone = structuredClone(node) as EntryNode
  clone.id = newId
  const link = parseNodeLink(clone.template)
  if (link && idMap.has(link.nodeId)) {
    clone.template = formatNodeLink(idMap.get(link.nodeId)!)
  }
  return clone
}

function cloneThemeEntry(
  entry: EntryTheme,
  newId: string,
  idMap: Map<string, string>,
): EntryTheme {
  const clone = structuredClone(entry) as EntryTheme
  clone.id = newId
  const parsed = parseThemeTemplate(clone.template)
  if (parsed?.kind === "theme" && idMap.has(parsed.themeId)) {
    clone.template = formatThemeLink(idMap.get(parsed.themeId)!)
  }
  return clone
}

function clonePlainRow<T extends { id: string }>(row: T, newId: string): T {
  const c = structuredClone(row) as T
  c.id = newId
  return c
}

/**
 * Clones the rows for a plain resource board (font collections, icon sets, media)
 * into the draft map under remapped ids and returns the new variant references.
 */
function cloneResourceVariants(
  sourceBoardKey: string,
  newBoardKey: string,
  variants: { id: string }[],
  prefix: string,
  sourceMap: Record<string, { id: string }>,
  draftMap: Record<string, { id: string }>,
): { id: string }[] {
  const idMap = buildPrefixIdMap(
    sourceBoardKey,
    newBoardKey,
    variants.map((v) => v.id),
    prefix,
  )
  for (const [oldId, newId] of idMap) {
    const row = sourceMap[oldId]
    if (row) draftMap[newId] = clonePlainRow(row, newId)
  }
  return variants.map((v) => ({ id: idMap.get(v.id) ?? v.id }))
}

/**
 * Clones a board to `newBoardKey`, remaps dependent ids in `nodes`, `themes`,
 * `font-collections`, `icon-sets`, or `media`, and appends the new board to sort order.
 * Call only after validation; missing source or colliding target throws.
 */
export function cloneBoard(
  workspace: Workspace,
  sourceBoardKey: string,
  newBoardKey: string,
  label?: string,
): Workspace {
  const sourceBoard = workspace.components[sourceBoardKey]
  invariant(
    sourceBoard,
    `cloneBoard: missing source board ${sourceBoardKey}`,
  )
  invariant(
    !workspace.components[newBoardKey],
    `cloneBoard: board key already exists ${newBoardKey}`,
  )

  return mutateWorkspace(workspace, (draft) => {
    const src = draft.components[sourceBoardKey]
    invariant(
      src,
      `cloneBoard: source board disappeared ${sourceBoardKey}`,
    )

    const newBoard = structuredClone(src) as Board
    const maxOrder = Math.max(
      0,
      ...Object.values(draft.components).map((b) => getBoardOrder(b)),
    )
    setBoardOrder(newBoard, maxOrder + 1)

    if (label !== undefined && "label" in newBoard) {
      ;(newBoard as { label: string }).label = label
    }

    if (isComponentBoard(src) || isPlaygroundBoard(src)) {
      const treeIds = collectTreeIds(src.variants)
      const idMap = new Map([
        ...buildPrefixIdMap(sourceBoardKey, newBoardKey, treeIds, "component-"),
        ...buildPrefixIdMap(sourceBoardKey, newBoardKey, treeIds, "playground-"),
      ])
      for (const [oldId, newId] of idMap) {
        const node = workspace.nodes[oldId] as EntryNode | undefined
        if (!node) continue
        draft.nodes[newId] = cloneNodeEntry(node, newId, idMap) as WritableDraft<EntryNode>
      }
      newBoard.variants = remapComponentTree(src.variants, idMap)
    } else if (isThemeBoard(src)) {
      const ids = src.variants.map((v) => v.id)
      const idMap = buildPrefixIdMap(sourceBoardKey, newBoardKey, ids, "theme-")
      for (const [oldId, newId] of idMap) {
        const row = workspace.themes[oldId] as EntryTheme | undefined
        if (!row) continue
        draft.themes[newId] = cloneThemeEntry(row, newId, idMap) as WritableDraft<EntryTheme>
      }
      ;(newBoard as ThemeBoard).variants = src.variants.map((v) => ({
        id: idMap.get(v.id) ?? v.id,
      }))
    } else if (isFontCollectionBoard(src)) {
      if (!draft["font-collections"]) draft["font-collections"] = {}
      ;(newBoard as FontCollectionBoard).variants = cloneResourceVariants(
        sourceBoardKey,
        newBoardKey,
        src.variants,
        "font-collection-",
        workspace["font-collections"],
        draft["font-collections"] as Record<string, { id: string }>,
      )
    } else if (isIconSetBoard(src)) {
      if (!draft["icon-sets"]) draft["icon-sets"] = {}
      ;(newBoard as IconSetBoard).variants = cloneResourceVariants(
        sourceBoardKey,
        newBoardKey,
        src.variants,
        "icon-set-",
        workspace["icon-sets"],
        draft["icon-sets"] as Record<string, { id: string }>,
      )
    } else if (isMediaBoard(src)) {
      ;(newBoard as MediaBoard).variants = cloneResourceVariants(
        sourceBoardKey,
        newBoardKey,
        src.variants,
        "media-",
        workspace.media,
        draft.media as Record<string, { id: string }>,
      )
    }

    draft.components[newBoardKey] = newBoard as WritableDraft<Board>

    const realigned = boardOrderService.realignBoardOrder(
      draft as Workspace,
    )
    Object.assign(draft.components, realigned.components)
  })
}
