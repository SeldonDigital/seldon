import { isDraft } from "immer"

import type { ComponentTreeRef } from "../../types"

/**
 * Minimal catalog row shape for walking composition trees. Matches `workspace.boards`
 * rows and the loose `WorkspaceComponent` used by `compute-node-properties`.
 */
interface CompositionComponentRow {
  type?: string
  variants?: Array<string | ComponentTreeRef>
}

/**
 * Workspace slice needed to derive composition parents from board variant trees.
 * `playgrounds` holds Sandbox-rooted trees that the editor composes the same way
 * as component boards. The factory passes only `boards` so playground content is
 * never part of an export pass.
 */
export interface WorkspaceComponentTreeSource {
  boards?: Record<string, CompositionComponentRow | undefined>
  playgrounds?: Record<string, CompositionComponentRow | undefined>
}

/**
 * Maps each node id to the id of its **composition parent** on component/playground
 * boards: the `ComponentTreeRef` whose `children` array references that node.
 *
 * **Multi-parent rule:** The same `id` may appear under multiple variant trees (e.g.
 * shared instance). The first parent recorded wins. Order is deterministic: boards
 * are visited in ascending board key, then each board's `variants` array order,
 * then depth-first pre-order over `children`. Later edges for an id already in the
 * map are ignored so `#parent.*` in `computeProperties` resolves to one chain.
 */
export type NodeParentIndex = ReadonlyMap<string, string>

function toTreeRef(variant: string | ComponentTreeRef): ComponentTreeRef {
  return typeof variant === "string" ? { id: variant } : variant
}

function walkContainer(
  container: ComponentTreeRef,
  parentByChild: Map<string, string>,
): void {
  for (const raw of container.children ?? []) {
    const child = toTreeRef(raw)
    if (!parentByChild.has(child.id)) parentByChild.set(child.id, container.id)
    walkContainer(child, parentByChild)
  }
}

function isCompositionComponentRow(board: CompositionComponentRow): boolean {
  return board.type === "component" || board.type === "playground"
}

function walkRows(
  rows: Record<string, CompositionComponentRow | undefined> | undefined,
  parentByChild: Map<string, string>,
): void {
  if (!rows) return
  const keys = Object.keys(rows).sort()
  for (const key of keys) {
    const row = rows[key]
    if (!row || !isCompositionComponentRow(row)) continue

    for (const variant of row.variants ?? []) {
      walkContainer(toTreeRef(variant), parentByChild)
    }
  }
}

export function buildNodeParentIndex(
  source: WorkspaceComponentTreeSource,
): Map<string, string> {
  const parentByChild = new Map<string, string>()
  walkRows(source.boards, parentByChild)
  walkRows(source.playgrounds, parentByChild)
  return parentByChild
}

/**
 * Caches the parent index by the `components` object reference. Reducers build a
 * new `components` reference through Immer when a board tree changes, so compute
 * passes over an unchanged workspace reuse one index instead of rebuilding it per
 * node. Drafts bypass the cache because they mutate in place during a reducer pass.
 */
const parentIndexCache = new WeakMap<object, Map<string, string>>()

export function getNodeParentIndex(
  source: WorkspaceComponentTreeSource,
): Map<string, string> {
  if (
    isDraft(source) ||
    isDraft(source.boards) ||
    isDraft(source.playgrounds)
  ) {
    return buildNodeParentIndex(source)
  }

  let index = parentIndexCache.get(source)
  if (!index) {
    index = buildNodeParentIndex(source)
    parentIndexCache.set(source, index)
  }

  return index
}
