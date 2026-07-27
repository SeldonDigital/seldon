import type { Board, EntryNode, Workspace } from "../../types"
import { parseNodeTemplate } from "../../types"

/** Catalog id for a component board, or the map key for an authored board. */
export function boardKey(board: Board): string | undefined {
  if ("catalogId" in board && board.catalogId) return board.catalogId
  return (board as { id?: string }).id
}

/** A board reached from a node, identified by its key and the variant root used. */
export interface BoardRef {
  key: string
  rootId: string
}

export interface BoardRefResolver {
  boardsByKey: Map<string, Board>
  variantRootToBoardKey: Map<string, string>
  defaultVariantRootByBoardKey: Map<string, string>
  /**
   * Follows a node's template chain to the variant root of the board it uses.
   * A chain ending at a catalog id resolves to that board's default variant.
   */
  resolveRef: (start: EntryNode) => BoardRef | null
}

/**
 * Builds the board lookup maps and a `resolveRef` walker shared by the usage
 * helpers. `resolveRef` maps any node to the board and variant root it instances,
 * resolving `node:` template chains and `catalog:` references alike.
 */
export function createBoardRefResolver(
  workspace: Workspace,
  boards: Board[],
): BoardRefResolver {
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

  const resolveRef = (start: EntryNode): BoardRef | null => {
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

  return {
    boardsByKey,
    variantRootToBoardKey,
    defaultVariantRootByBoardKey,
    resolveRef,
  }
}
