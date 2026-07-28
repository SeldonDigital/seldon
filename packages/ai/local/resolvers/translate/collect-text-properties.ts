import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getEffectiveProperties } from "@seldon/core/workspace/helpers/properties/shared"
import {
  isAuthoredBoard,
  isComponentBoard,
} from "@seldon/core/workspace/model/components"
import type { BoardKey, Workspace } from "@seldon/core/workspace/types"

/**
 * The property keys that hold translatable, user-facing text. Deliberately a
 * curated allowlist, not "every string property": keys like `source`,
 * `symbol`, `inputType`, or `mediaType` hold identifiers and enum keywords
 * that must never be translated. No equivalent classifier exists in core, so
 * this list is the contract -- extend it when a schema adds a new text-bearing
 * property.
 */
export const TRANSLATABLE_PROPERTY_KEYS = [
  "content",
  "altText",
  "placeholder",
  "trackLabel",
] as const

/** One translatable string found in the target subtree. */
export interface TextProperty {
  nodeId: string
  propertyKey: string
  text: string
}

/** The ids of `rootId` and every descendant, in tree order, on one board. */
function subtreeIds(
  workspace: Workspace,
  boardKey: BoardKey | undefined,
  rootId: string,
): string[] {
  if (boardKey === undefined) return [rootId]
  const board = workspace.boards[boardKey]
  if (!board || (!isComponentBoard(board) && !isAuthoredBoard(board)))
    return [rootId]

  const ids: string[] = []
  let inSubtree = false
  walkBoardTreeRefs(board.variants, (ref, parent) => {
    if (ref.id === rootId) {
      inSubtree = true
      ids.push(ref.id)
      return
    }
    if (inSubtree) {
      // walkBoardTreeRefs is depth-first; the subtree ends when a ref appears
      // whose parent is outside the collected set.
      if (parent && ids.includes(parent.id)) {
        ids.push(ref.id)
      }
    }
  })
  return ids.length > 0 ? ids : [rootId]
}

/**
 * Collects every translatable string in the target node's subtree: for each
 * node, each allowlisted key whose effective value is a non-empty string.
 * Purely deterministic -- no model involvement in deciding what gets
 * translated.
 */
export function collectTextProperties(
  workspace: Workspace,
  boardKey: BoardKey | undefined,
  rootId: string,
): TextProperty[] {
  const found: TextProperty[] = []
  for (const nodeId of subtreeIds(workspace, boardKey, rootId)) {
    let effective: Record<string, unknown>
    try {
      effective = getEffectiveProperties(nodeId, workspace) as Record<
        string,
        unknown
      >
    } catch {
      continue
    }
    for (const propertyKey of TRANSLATABLE_PROPERTY_KEYS) {
      const raw = effective[propertyKey]
      const value =
        typeof raw === "string"
          ? raw
          : raw && typeof raw === "object" && "value" in raw
            ? (raw as { value: unknown }).value
            : undefined
      if (typeof value === "string" && value.trim() !== "") {
        found.push({ nodeId, propertyKey, text: value })
      }
    }
  }
  return found
}
