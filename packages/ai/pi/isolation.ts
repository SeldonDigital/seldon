import { boardKey } from "@seldon/core/workspace/helpers/components/board-ref-resolver"
import { getIsolatedVariantUsage } from "@seldon/core/workspace/helpers/components/get-isolated-variant-usage"
import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import type { BoardKey, Workspace } from "@seldon/core/workspace/types"

import type { IsolationScope } from "../types"

/**
 * The resolved reach of Isolation Mode for one turn. The harness pins the active
 * board and variant to the isolated anchor, bounds discovery to
 * {@link allowedBoardKeys}, and rejects any edit whose target falls outside
 * {@link allowedNodeIds} or {@link allowedBoardKeys}.
 */
export interface IsolationClosure {
  /** Workspace board map key of the isolated board. */
  isolatedBoardKey: BoardKey
  /** Frozen variant root of the isolated board, or null for the whole board. */
  isolatedVariantRootId: string | null
  /** Workspace board map keys reachable from the isolated variant, plus the anchor. */
  allowedBoardKeys: Set<string>
  /** Every node id in the isolated variant's transitive component tree. */
  allowedNodeIds: Set<string>
  /**
   * Per-board used variant roots, keyed by board key ({@link boardKey}). Mirrors
   * the core usage map the editor renders, so the context listing shows the same
   * dependency variants the canvas does.
   */
  usage: Map<string, Set<string>>
}

/**
 * Builds the isolation closure from the request's {@link IsolationScope}. Reuses
 * the core {@link getIsolatedVariantUsage} walk as the single source of truth for
 * which boards and variants the isolated variant depends on, then collects the
 * concrete node ids of those variant subtrees for the commit-time gate.
 *
 * Returns null when the isolated board key does not resolve, so the caller falls
 * back to unscoped behavior instead of scoping to nothing.
 */
export function buildIsolationClosure(
  workspace: Workspace,
  isolation: IsolationScope,
): IsolationClosure | null {
  const isolatedBoard = workspace.boards[isolation.boardKey]
  if (!isolatedBoard) return null

  const boards = Object.values(workspace.boards)
  const usage = getIsolatedVariantUsage(
    isolatedBoard,
    isolation.variantRootId,
    workspace,
    boards,
  )

  const allowedBoardKeys = new Set<string>()
  const allowedNodeIds = new Set<string>()

  for (const [mapKey, board] of Object.entries(workspace.boards)) {
    const key = boardKey(board)
    if (!key) continue
    const usedRoots = usage.get(key)
    if (!usedRoots) continue
    allowedBoardKeys.add(mapKey)
    for (const rootId of usedRoots) {
      const rootRef = board.variants.find((variant) => variant.id === rootId)
      if (!rootRef) continue
      walkBoardTreeRefs([rootRef], (ref) => {
        allowedNodeIds.add(ref.id)
      })
    }
  }

  return {
    isolatedBoardKey: isolation.boardKey,
    isolatedVariantRootId: isolation.variantRootId,
    allowedBoardKeys,
    allowedNodeIds,
    usage,
  }
}
