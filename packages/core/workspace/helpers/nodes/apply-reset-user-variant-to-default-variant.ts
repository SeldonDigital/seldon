import { produce } from "immer"
import type { ComponentTreeRef, Workspace } from "../../types"
import { isComponentBoard, isPlaygroundBoard } from "../../model/components"
import { isEntryNodeVariant } from "../../model/entry-node"
import {
  buildDuplicateEntryVariantSubtreePlan,
  findBoardContainingTreeNodeId,
} from "./duplicate-entry-variant-subtree"
import { walkBoardTreeRefs } from "../components/walk-board-tree-refs"

function collectTreeRefIds(ref: ComponentTreeRef): string[] {
  const ids = [ref.id]
  for (const child of ref.children ?? []) {
    ids.push(...collectTreeRefIds(child))
  }
  return ids
}

function collectAllComponentTreeNodeIds(workspace: Workspace): Set<string> {
  const out = new Set<string>()
  for (const board of Object.values(workspace.components)) {
    walkBoardTreeRefs(board.variants ?? [], (ref) => {
      out.add(ref.id)
    })
  }
  return out
}

/**
 * Resets a user variant to the default variant. Rebuilds the user variant's
 * children as a fresh instance chain that templates from the default variant's
 * children, clears the variant root's overrides and theme, and drops `nodes`
 * rows that nothing references anymore. The user variant keeps its own root id
 * and stays independent from the default while still inheriting default-child
 * changes.
 */
export function applyResetUserVariantToDefaultVariant(
  workspace: Workspace,
  variantRootId: string,
): Workspace {
  return produce(workspace, (draft) => {
    const located = findBoardContainingTreeNodeId(draft, variantRootId)
    if (
      !located ||
      !(isComponentBoard(located.board) || isPlaygroundBoard(located.board))
    ) {
      return
    }

    const { board, boardKey } = located
    const idx = board.variants.findIndex((v) => v.id === variantRootId)
    if (idx <= 0) return

    const userRef = board.variants[idx]
    const defaultRef = board.variants[0]
    if (!userRef || !defaultRef) return

    const userNode = draft.nodes[variantRootId]
    if (!userNode || !isEntryNodeVariant(userNode)) return

    const oldIds = new Set(collectTreeRefIds(userRef))

    // Reuse the variant-creation plan so reset produces the same inheritance
    // chain as a fresh user variant. The plan's generated root is discarded so
    // the existing user root id and template are preserved.
    const plan = buildDuplicateEntryVariantSubtreePlan(
      draft as unknown as Workspace,
      board,
      boardKey,
      defaultRef.id,
      userNode.label,
    )

    const newRef: ComponentTreeRef = {
      id: variantRootId,
      children: plan?.newRootTreeRef.children,
    }
    board.variants[idx] = newRef

    if (plan) {
      for (const [id, node] of Object.entries(plan.newNodes)) {
        if (id === plan.newRootId) continue
        draft.nodes[id] = node
      }
    }

    userNode.overrides = {}
    userNode.theme = null

    const newIds = new Set(collectTreeRefIds(newRef))
    const referenced = collectAllComponentTreeNodeIds(draft)

    for (const id of oldIds) {
      if (newIds.has(id)) continue
      if (referenced.has(id)) continue
      delete draft.nodes[id]
    }
  })
}
