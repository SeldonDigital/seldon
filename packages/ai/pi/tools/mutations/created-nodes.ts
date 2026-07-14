import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getCompositionContainers } from "@seldon/core/workspace/helpers/general/get-composition-containers"
import type { ComponentTreeRef, Workspace } from "@seldon/core/workspace/types"

/** Variant tree roots across component and playground boards, the only rows with child refs. */
function compositionRoots(workspace: Workspace): ComponentTreeRef[] {
  const roots: ComponentTreeRef[] = []
  for (const board of getCompositionContainers(workspace)) {
    if (board.type === "component" || board.type === "playground") {
      roots.push(...board.variants)
    }
  }
  return roots
}

/** Immediate child node ids of a node, read from the variant trees. */
function childRefIds(workspace: Workspace, nodeId: string): string[] {
  let children: string[] = []
  walkBoardTreeRefs(compositionRoots(workspace), (ref) => {
    if (ref.id !== nodeId) return
    children = (ref.children ?? []).map((child) => child.id)
    return true
  })
  return children
}

/** Node ids present in `after` but not in `before`. */
function newNodeIds(before: Workspace, after: Workspace): Set<string> {
  const seen = new Set(Object.keys(before.nodes ?? {}))
  return new Set(Object.keys(after.nodes ?? {}).filter((id) => !seen.has(id)))
}

/** Board keys present in `after` but not in `before`. */
function newBoardKeys(before: Workspace, after: Workspace): string[] {
  const seen = new Set(Object.keys(before.boards ?? {}))
  return Object.keys(after.boards ?? {}).filter((key) => !seen.has(key))
}

/**
 * Created nodes that root a new subtree: a new node whose parent is not itself
 * new. Inserting a component creates the instance and its descendants, so only
 * the instance is a top created node. The model gets the one id it should target
 * next, not the whole subtree.
 */
function topCreatedNodeIds(before: Workspace, after: Workspace): string[] {
  const created = newNodeIds(before, after)
  const tops = new Set<string>()
  walkBoardTreeRefs(compositionRoots(after), (ref, parent) => {
    if (created.has(ref.id) && (!parent || !created.has(parent.id))) {
      tops.add(ref.id)
    }
  })
  return [...tops]
}

/** One `id "label" [level] — children: ...` line for a created node. */
function summarizeNode(workspace: Workspace, id: string): string {
  const node = workspace.nodes?.[id]
  const label = node?.label ? ` "${node.label}"` : ""
  const level = node?.level ? ` [${node.level}]` : ""
  const childIds = childRefIds(workspace, id)
  const children = childIds
    .map((childId) => {
      const childLabel = workspace.nodes?.[childId]?.label
      return childLabel ? `${childId} "${childLabel}"` : childId
    })
    .join(", ")
  const childText = childIds.length > 0 ? ` — children: ${children}` : ""
  return `${id}${label}${level}${childText}`
}

/** New board keys and created subtree roots with a one-level child summary, or "" when nothing was created. */
function describeCreated(before: Workspace, after: Workspace): string {
  const lines: string[] = []
  const boards = newBoardKeys(before, after)
  if (boards.length > 0) lines.push(`New board: ${boards.join(", ")}.`)
  for (const id of topCreatedNodeIds(before, after)) {
    lines.push(summarizeNode(after, id))
  }
  return lines.join("\n")
}

/**
 * Appends the created board key and node id, plus a one-level child summary, to
 * a create tool's result so the model can keep editing the new node in the same
 * turn instead of stopping to ask. Because the caller adopts the working copy
 * directly, these ids are stable and a follow-on edit lands on them. Returns the
 * bare message when the action created nothing.
 */
export function withCreatedIdentity(
  before: Workspace,
  after: Workspace,
  message: string,
): string {
  const created = describeCreated(before, after)
  if (!created) return message
  return `${message}\n${created}\nUse these ids to finish any remaining edits from the request in this same turn. Do not stop to ask when you can continue.`
}
