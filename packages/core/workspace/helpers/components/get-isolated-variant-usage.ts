import type { Board, ComponentTreeRef, EntryNode, Workspace } from "../../types"
import { parseNodeTemplate } from "../../types"
import { walkBoardTreeRefs } from "./walk-board-tree-refs"

/** Catalog id for a component board, or the map key for an authored board. */
function boardKey(board: Board): string | undefined {
  if ("catalogId" in board && board.catalogId) return board.catalogId
  return (board as { id?: string }).id
}

/**
 * Maps each board reachable from one variant of the isolated board to the exact
 * variant root ids that variant's tree uses. The result includes the isolated
 * board mapped to `isolatedVariantRootId`.
 *
 * The walk is scoped to a single variant, not the whole board, so freezing on
 * one variant hides the components only its sibling variants use. It is also
 * transitive: each referenced variant is followed into its own tree, so nested
 * components several boards deep are included.
 *
 * When `isolatedVariantRootId` is null, every variant of the isolated board
 * seeds the walk, matching whole-board behavior.
 */
export function getIsolatedVariantUsage(
  isolatedBoard: Board,
  isolatedVariantRootId: string | null,
  workspace: Workspace,
  boards: Board[],
): Map<string, Set<string>> {
  const variantRootToBoardKey = new Map<string, string>()
  const defaultVariantRootByBoardKey = new Map<string, string>()
  const boardsByKey = new Map<string, Board>()

  for (const board of boards) {
    const key = boardKey(board)
    if (!key) continue
    boardsByKey.set(key, board)
    const rootIds = board.variants.map((variant) => variant.id)
    if (rootIds[0]) defaultVariantRootByBoardKey.set(key, rootIds[0])
    for (const rootId of rootIds) variantRootToBoardKey.set(rootId, key)
  }

  const usage = new Map<string, Set<string>>()

  // Follows a node's template chain to the variant root of a board it uses. A
  // chain ending at a catalog id resolves to that board's default variant.
  const resolveRef = (
    start: EntryNode,
  ): { key: string; rootId: string } | null => {
    const seen = new Set<string>()
    let current: EntryNode | undefined = start
    while (current && !seen.has(current.id)) {
      seen.add(current.id)
      const key = variantRootToBoardKey.get(current.id)
      if (key) return { key, rootId: current.id }
      const parsed = parseNodeTemplate(current.template)
      if (!parsed) return null
      if (parsed.kind === "catalog") {
        const board = boardsByKey.get(parsed.componentId)
        const boardId = board ? boardKey(board) : undefined
        const rootId = boardId
          ? defaultVariantRootByBoardKey.get(boardId)
          : undefined
        return boardId && rootId ? { key: boardId, rootId } : null
      }
      current = workspace.nodes?.[parsed.nodeId]
    }
    return null
  }

  const visited = new Set<string>()
  const queue: { key: string; rootId: string }[] = []

  const enqueue = (key: string, rootId: string): void => {
    const id = `${key}:${rootId}`
    if (visited.has(id)) return
    visited.add(id)
    let set = usage.get(key)
    if (!set) {
      set = new Set<string>()
      usage.set(key, set)
    }
    set.add(rootId)
    queue.push({ key, rootId })
  }

  const isolatedKey = boardKey(isolatedBoard)
  if (isolatedKey) {
    if (isolatedVariantRootId) {
      enqueue(isolatedKey, isolatedVariantRootId)
    } else {
      for (const variant of isolatedBoard.variants) {
        enqueue(isolatedKey, variant.id)
      }
    }
  }

  while (queue.length) {
    const unit = queue.pop()
    if (!unit) continue
    const board = boardsByKey.get(unit.key)
    if (!board) continue
    const rootRef = board.variants.find((variant) => variant.id === unit.rootId)
    if (!rootRef) continue
    // Resource board refs (theme, font collection, icon set, media) carry no
    // child tree, so treat a missing `children` as an empty subtree.
    const children = (rootRef as { children?: ComponentTreeRef[] }).children
    walkBoardTreeRefs(children ?? [], (ref) => {
      const node = workspace.nodes?.[ref.id]
      if (!node) return
      const dependency = resolveRef(node)
      if (dependency) enqueue(dependency.key, dependency.rootId)
    })
  }

  return usage
}
