import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getCompositionContainers } from "@seldon/core/workspace/helpers/general/get-composition-containers"
import type { ComponentTreeRef, Workspace } from "@seldon/core/workspace/types"

import { nodeSummaryTail } from "../../../prompt/context-sections/node-line"

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

/** One pass over the variant trees: node id -> immediate child node ids. */
function childrenIndex(workspace: Workspace): Map<string, string[]> {
  const index = new Map<string, string[]>()
  walkBoardTreeRefs(compositionRoots(workspace), (ref) => {
    index.set(ref.id, (ref.children ?? []).map((child) => child.id))
  })
  return index
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

/** How many levels of the created subtree to print, and the total line cap. */
const MAX_DEPTH = 3
const MAX_LINES = 60

/**
 * Appends one indented line per node down to MAX_DEPTH, using the same node
 * descriptor as the active-board tree so a just-created node reads with its
 * level, catalog id, type, source label, and string values. That lets the model
 * tell a card's title node apart from its other text nodes and target it in the
 * same turn instead of stopping to ask.
 */
function summarizeSubtree(
  workspace: Workspace,
  index: Map<string, string[]>,
  id: string,
  depth: number,
  lines: string[],
): void {
  if (lines.length >= MAX_LINES) return
  lines.push(`${"  ".repeat(depth)}${id}${nodeSummaryTail(workspace, id)}`)
  if (depth >= MAX_DEPTH) return
  for (const childId of index.get(id) ?? []) {
    summarizeSubtree(workspace, index, childId, depth + 1, lines)
  }
}

/**
 * New board keys and the created subtree roots printed a few levels deep, so the
 * model can target a nested node it just created without a drill-down. Returns ""
 * when nothing was created.
 */
function describeCreated(before: Workspace, after: Workspace): string {
  const lines: string[] = []
  const boards = newBoardKeys(before, after)
  if (boards.length > 0) lines.push(`New board: ${boards.join(", ")}.`)
  const index = childrenIndex(after)
  for (const id of topCreatedNodeIds(before, after)) {
    summarizeSubtree(after, index, id, 0, lines)
  }
  return lines.join("\n")
}

/**
 * Appends the created board key and an indented tree of the created subtree,
 * a few levels deep, to a create tool's result so the model can target a nested
 * node it just created and keep editing in the same turn instead of stopping to
 * ask. Because the caller adopts the working copy directly, these ids are stable
 * and a follow-on edit lands on them. Returns the bare message when the action
 * created nothing.
 */
export function withCreatedIdentity(
  before: Workspace,
  after: Workspace,
  message: string,
): string {
  const created = describeCreated(before, after)
  if (!created) return message
  return `${message}\nCreated (indentation shows nesting):\n${created}\nThese ids are stable. Use them to finish any remaining edits from the request in this same turn. If a node you need is deeper than shown, call describe_node on the lowest id to expand it. Do not stop to ask when you can continue.`
}
