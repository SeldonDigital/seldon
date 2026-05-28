import { produce } from "immer"
import type { ComponentTreeRef, Workspace } from "../../types"
import { isComponentBoard, isPlaygroundBoard } from "../../model/components"
import { isEntryNodeVariant } from "../../model/entry-node"
import { findComponentContainingTreeNodeId } from "./duplicate-entry-variant-subtree"
import { walkComponentTreeRefs } from "../components/walk-component-tree-refs"

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
    walkComponentTreeRefs(board.variants ?? [], (ref) => {
      out.add(ref.id)
    })
  }
  return out
}

/**
 * Rewires a user variant’s board tree to match the default variant’s child refs,
 * clears that variant root’s overrides, and drops `nodes` rows that nothing references anymore.
 */
export function applyResetUserVariantToDefaultVariant(
  workspace: Workspace,
  variantRootId: string,
): Workspace {
  return produce(workspace, (draft) => {
    const located = findComponentContainingTreeNodeId(draft, variantRootId)
    if (
      !located ||
      !(isComponentBoard(located.board) || isPlaygroundBoard(located.board))
    ) {
      return
    }

    const { board } = located
    const idx = board.variants.findIndex((v) => v.id === variantRootId)
    if (idx <= 0) return

    const userRef = board.variants[idx]
    const defaultRef = board.variants[0]
    if (!userRef || !defaultRef) return

    const userNode = draft.nodes[variantRootId]
    if (!userNode || !isEntryNodeVariant(userNode)) return

    const oldIds = new Set(collectTreeRefIds(userRef))
    const newRef: ComponentTreeRef = {
      id: userRef.id,
      children: defaultRef.children
        ? (structuredClone(defaultRef.children) as ComponentTreeRef[])
        : undefined,
    }
    board.variants[idx] = newRef

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
