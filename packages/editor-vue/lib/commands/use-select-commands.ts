import { storeToRefs } from "pinia"
import { computed } from "vue"
import {
  resolveFirstChildNodeId,
  resolveNextSiblingNodeId,
  resolveOriginalNodeId,
  resolveParentNodeId,
  resolvePreviousSiblingNodeId,
  resolveSourceNodeId,
} from "@seldon/core/workspace/services/nodes/node-navigation.service"
import { useSelectionStore } from "@lib/stores/selection-store"
import { useWorkspace } from "@lib/workspace/use-workspace"

/**
 * Tree-navigation commands for the Select menu. Traversal lives in core
 * resolvers so the editor and a headless agent compute the same target. Each
 * command is a thin `resolve -> selectNode`, and each `can*` flag is true when
 * the resolver returns a different node than the current selection. Mirrors the
 * React `useSelectCommands`.
 */
export function useSelectCommands() {
  const selection = useSelectionStore()
  const { selectedNodeId } = storeToRefs(selection)
  const { workspace } = useWorkspace()

  const currentId = computed(() => selectedNodeId.value ?? null)

  const targets = computed(() => {
    const id = currentId.value
    if (!id) {
      return {
        original: null,
        source: null,
        parent: null,
        firstChild: null,
        nextSibling: null,
        previousSibling: null,
      }
    }
    const ws = workspace.value
    return {
      original: resolveOriginalNodeId(ws, id),
      source: resolveSourceNodeId(ws, id),
      parent: resolveParentNodeId(ws, id),
      firstChild: resolveFirstChildNodeId(ws, id),
      nextSibling: resolveNextSiblingNodeId(ws, id),
      previousSibling: resolvePreviousSiblingNodeId(ws, id),
    }
  })

  function goTo(targetId: string | null): void {
    if (targetId && targetId !== currentId.value) {
      selection.selectNode(targetId)
    }
  }

  function canMove(targetId: string | null): boolean {
    return targetId !== null && targetId !== currentId.value
  }

  return {
    selectOriginal: () => goTo(targets.value.original),
    selectSource: () => goTo(targets.value.source),
    selectParent: () => goTo(targets.value.parent),
    selectFirstChild: () => goTo(targets.value.firstChild),
    selectNextSibling: () => goTo(targets.value.nextSibling),
    selectPreviousSibling: () => goTo(targets.value.previousSibling),
    canSelectOriginal: computed(() => canMove(targets.value.original)),
    canSelectSource: computed(() => canMove(targets.value.source)),
    canSelectParent: computed(() => canMove(targets.value.parent)),
    canSelectFirstChild: computed(() => canMove(targets.value.firstChild)),
    canSelectNextSibling: computed(() => canMove(targets.value.nextSibling)),
    canSelectPreviousSibling: computed(() =>
      canMove(targets.value.previousSibling),
    ),
  }
}
