import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import { hasVariants } from "../../../components/types"
import { isComponentBoard } from "../../model/components"
import { parseNodeLink } from "../../model/template-ref"
import type { Workspace } from "../../types"
import {
  componentBoardDefaultNodeId,
  componentBoardSchemaVariantNodeId,
} from "../components/entry-node-ids"
import { walkBoardTreeRefs } from "../components/walk-board-tree-refs"

/** A variant on the reset board that another board still references. */
export interface ExternalVariantUsage {
  usingBoardKey: string
  usingBoardLabel: string
  variantId: string
  variantLabel: string
}

/**
 * Finds variants on a component board that would be removed by a catalog reset
 * but are still referenced by another board. A reset rebuilds the default and
 * every catalog schema variant under deterministic ids, so only user variants
 * (and schema variants dropped from the catalog) can become dangling. A match
 * means resetting would delete a variant that another component instantiates.
 *
 * References inside the board being reset are ignored, since those subtrees are
 * rebuilt by the reset itself.
 */
export function collectExternalVariantUsage(
  boardKey: string,
  workspace: Workspace,
): ExternalVariantUsage[] {
  const board = workspace.boards[boardKey]
  if (!board || !isComponentBoard(board)) return []

  const schema = getComponentSchema(board.catalogId as ComponentId)
  const recreatedIds = new Set<string>([componentBoardDefaultNodeId(boardKey)])
  if (hasVariants(schema)) {
    for (const variant of schema.variants) {
      recreatedIds.add(componentBoardSchemaVariantNodeId(boardKey, variant.id))
    }
  }

  const removeSet = new Set(
    board.variants.map((ref) => ref.id).filter((id) => !recreatedIds.has(id)),
  )
  if (removeSet.size === 0) return []

  // Map every tree node id to the board that lists it, and collect the ids that
  // belong to the board being reset so its own references are skipped.
  const nodeOwnerKey = new Map<string, string>()
  const inBoardNodeIds = new Set<string>()
  for (const [otherKey, otherBoard] of Object.entries(workspace.boards)) {
    walkBoardTreeRefs(otherBoard.variants, (ref) => {
      if (!nodeOwnerKey.has(ref.id)) {
        nodeOwnerKey.set(ref.id, otherKey)
      }
      if (otherKey === boardKey) {
        inBoardNodeIds.add(ref.id)
      }
    })
  }

  const issues: ExternalVariantUsage[] = []
  const seen = new Set<string>()

  const addIssue = (usingBoardKey: string, variantId: string) => {
    const key = `${usingBoardKey}:${variantId}`
    if (seen.has(key)) return
    seen.add(key)
    issues.push({
      usingBoardKey,
      usingBoardLabel: workspace.boards[usingBoardKey]?.label ?? usingBoardKey,
      variantId,
      variantLabel: workspace.nodes[variantId]?.label ?? variantId,
    })
  }

  // A variant root listed directly in another board's tree.
  for (const [otherKey, otherBoard] of Object.entries(workspace.boards)) {
    if (otherKey === boardKey) continue
    walkBoardTreeRefs(otherBoard.variants, (ref) => {
      if (removeSet.has(ref.id)) {
        addIssue(otherKey, ref.id)
      }
    })
  }

  // An instance outside the board whose template links to a removed variant.
  for (const [nodeId, node] of Object.entries(workspace.nodes)) {
    if (inBoardNodeIds.has(nodeId)) continue
    const link = parseNodeLink(node.template)
    if (!link || !removeSet.has(link.nodeId)) continue
    const owningBoardKey = nodeOwnerKey.get(nodeId)
    if (!owningBoardKey || owningBoardKey === boardKey) continue
    addIssue(owningBoardKey, link.nodeId)
  }

  return issues
}
