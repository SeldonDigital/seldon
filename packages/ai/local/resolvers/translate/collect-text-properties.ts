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
  const noBoardIsActive = boardKey === undefined
  if (noBoardIsActive) return [rootId]
  const activeBoard = workspace.boards[boardKey]
  const boardHasNoVariantTrees =
    !activeBoard ||
    (!isComponentBoard(activeBoard) && !isAuthoredBoard(activeBoard))
  if (boardHasNoVariantTrees) return [rootId]

  const subtreeNodeIds: string[] = []
  let walkIsInsideSubtree = false
  walkBoardTreeRefs(activeBoard.variants, (ref, parent) => {
    const refIsSubtreeRoot = ref.id === rootId
    if (refIsSubtreeRoot) {
      walkIsInsideSubtree = true
      subtreeNodeIds.push(ref.id)
      return
    }
    if (walkIsInsideSubtree) {
      // walkBoardTreeRefs is depth-first; the subtree ends when a ref appears
      // whose parent is outside the collected set.
      const parentIsInsideSubtree = parent
        ? subtreeNodeIds.includes(parent.id)
        : false
      if (parentIsInsideSubtree) {
        subtreeNodeIds.push(ref.id)
      }
    }
  })
  const walkFoundTheSubtree = subtreeNodeIds.length > 0
  return walkFoundTheSubtree ? subtreeNodeIds : [rootId]
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
  const textProperties: TextProperty[] = []
  for (const nodeId of subtreeIds(workspace, boardKey, rootId)) {
    let effectiveProperties: Record<string, unknown>
    try {
      effectiveProperties = getEffectiveProperties(nodeId, workspace) as Record<
        string,
        unknown
      >
    } catch {
      continue
    }
    for (const propertyKey of TRANSLATABLE_PROPERTY_KEYS) {
      const rawPropertyValue = effectiveProperties[propertyKey]
      const textValue =
        typeof rawPropertyValue === "string"
          ? rawPropertyValue
          : rawPropertyValue &&
              typeof rawPropertyValue === "object" &&
              "value" in rawPropertyValue
            ? (rawPropertyValue as { value: unknown }).value
            : undefined
      const valueIsNonEmptyText =
        typeof textValue === "string" && textValue.trim() !== ""
      if (valueIsNonEmptyText) {
        textProperties.push({ nodeId, propertyKey, text: textValue })
      }
    }
  }
  return textProperties
}
