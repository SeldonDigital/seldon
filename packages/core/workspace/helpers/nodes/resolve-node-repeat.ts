import { parseNodeLink } from "../../model/template-ref"
import type { EntryNodeId, Workspace } from "../../types"
import { getBoardByNodeId } from "../components/get-board-by-node-id"
import { getChildrenIds } from "../components/get-children-ids"
import { findParentNode } from "./find-parent-node"
import { getNodeRepeat } from "./node-repeat"

/**
 * Effective repeat for a node after inheritance and override merge. `count` is
 * always concrete and `data` is keyed by the queried node's own descendant ids,
 * so render and inspector lookups match without translation.
 */
export interface ResolvedRepeat {
  count: number
  data: Record<string, string[]>
}

/**
 * Finds the node a given node inherits repeat from: the positionally matching
 * child under the parent's template. Instance children are independent clones
 * that template from a shared catalog default, so the inheritance link runs
 * through the parent rather than the child's own template. Returns null at an
 * origin, where the parent templates from a catalog schema.
 */
export function getRepeatInheritanceSourceId(
  nodeId: EntryNodeId,
  workspace: Workspace,
): EntryNodeId | null {
  const parent = findParentNode(nodeId, workspace)
  if (!parent) return null

  const link = parseNodeLink(parent.template)
  if (!link) return null

  const parentBoard = getBoardByNodeId(workspace, parent.id)
  if (!parentBoard) return null
  const index = getChildrenIds(parentBoard, parent.id).indexOf(nodeId)
  if (index < 0) return null

  const sourceParentId = link.nodeId as EntryNodeId
  const sourceBoard = getBoardByNodeId(workspace, sourceParentId)
  if (!sourceBoard) return null
  const sourceChildId = getChildrenIds(sourceBoard, sourceParentId)[index]
  if (!sourceChildId || sourceChildId === nodeId) return null

  return sourceChildId
}

/** Lists every descendant id under a node in deterministic tree order. */
export function collectDescendantIdsInOrder(
  rootId: EntryNodeId,
  workspace: Workspace,
): EntryNodeId[] {
  const board = getBoardByNodeId(workspace, rootId)
  if (!board) return []

  const ordered: EntryNodeId[] = []
  const walk = (id: EntryNodeId): void => {
    for (const childId of getChildrenIds(board, id)) {
      ordered.push(childId)
      walk(childId)
    }
  }
  walk(rootId)
  return ordered
}

/**
 * Remaps inherited data keyed by the source node's descendant ids onto the
 * queried node's descendant ids by matching tree position. Clones share their
 * structure, so the nth descendant corresponds across the inheritance link.
 */
function translateInheritedData(
  inheritedData: Record<string, string[]>,
  sourceId: EntryNodeId,
  nodeId: EntryNodeId,
  workspace: Workspace,
): Record<string, string[]> {
  const sourceOrder = collectDescendantIdsInOrder(sourceId, workspace)
  const targetOrder = collectDescendantIdsInOrder(nodeId, workspace)
  const sourceIndexById = new Map(sourceOrder.map((id, i) => [id, i]))

  const translated: Record<string, string[]> = {}
  for (const [sourceDescId, values] of Object.entries(inheritedData)) {
    const ordinal = sourceIndexById.get(sourceDescId as EntryNodeId)
    if (ordinal == null) continue
    const targetDescId = targetOrder[ordinal]
    if (targetDescId) translated[targetDescId] = values
  }
  return translated
}

/** Layers own data over inherited data per slot. A non-empty own slot wins. */
function mergeRepeatData(
  inherited: Record<string, string[]>,
  own: Record<string, string[]>,
): Record<string, string[]> {
  const merged: Record<string, string[]> = {}
  const keys = new Set([...Object.keys(inherited), ...Object.keys(own)])
  for (const key of keys) {
    const inheritedSlots = inherited[key] ?? []
    const ownSlots = own[key] ?? []
    const length = Math.max(inheritedSlots.length, ownSlots.length)
    const slots: string[] = []
    for (let i = 0; i < length; i++) {
      const ownValue = ownSlots[i]
      slots[i] =
        ownValue != null && ownValue !== ""
          ? ownValue
          : (inheritedSlots[i] ?? "")
    }
    merged[key] = slots
  }
  return merged
}

/**
 * Returns the repeat data a node inherits from its template's matching child,
 * remapped onto the node's own descendant ids. Excludes the node's own
 * overrides, so callers can compare own values against the inherited baseline.
 */
export function resolveInheritedRepeatData(
  nodeId: EntryNodeId,
  workspace: Workspace,
): Record<string, string[]> {
  const sourceId = getRepeatInheritanceSourceId(nodeId, workspace)
  if (!sourceId) return {}
  const inherited = resolveNodeRepeat(sourceId, workspace)
  if (!inherited) return {}
  return translateInheritedData(inherited.data, sourceId, nodeId, workspace)
}

/**
 * Resolves a node's effective repeat by inheriting from its template's matching
 * child and layering the node's own repeat on top. Count inherits unless the
 * node sets its own; data merges per slot with the node's own value winning.
 * Returns undefined when no count is set anywhere along the chain.
 */
export function resolveNodeRepeat(
  nodeId: EntryNodeId,
  workspace: Workspace,
  visited: Set<EntryNodeId> = new Set(),
): ResolvedRepeat | undefined {
  if (visited.has(nodeId)) return undefined
  visited.add(nodeId)

  const node = workspace.nodes[nodeId]
  const own = node ? getNodeRepeat(node) : undefined

  const sourceId = getRepeatInheritanceSourceId(nodeId, workspace)
  const inherited = sourceId
    ? resolveNodeRepeat(sourceId, workspace, visited)
    : undefined

  const count = own?.count ?? inherited?.count
  if (count == null) return undefined

  const inheritedData =
    inherited && sourceId
      ? translateInheritedData(inherited.data, sourceId, nodeId, workspace)
      : {}
  const data = mergeRepeatData(inheritedData, own?.data ?? {})

  return { count, data }
}
