import { useCallback, useMemo } from "react"
import {
  resolveFirstChildNodeId,
  resolveNextSiblingNodeId,
  resolveOriginalNodeId,
  resolveParentNodeId,
  resolvePreviousSiblingNodeId,
  resolveSourceNodeId,
} from "@seldon/core/workspace/services/nodes/node-navigation.service"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"

/**
 * Tree-navigation commands for the Select menu. Traversal lives in core resolvers
 * so the editor and a headless agent compute the same target. Each command is a
 * thin `resolve -> selectNode`, and each `can*` flag is true when the resolver
 * returns a different node than the current selection.
 */
export function useSelectCommands() {
  const { selectedNode, selectNode } = useSelection()
  const { workspace } = useWorkspace()

  const currentId = selectedNode?.id ?? null

  const targets = useMemo(() => {
    if (!currentId) {
      return {
        original: null,
        source: null,
        parent: null,
        firstChild: null,
        nextSibling: null,
        previousSibling: null,
      }
    }
    return {
      original: resolveOriginalNodeId(workspace, currentId),
      source: resolveSourceNodeId(workspace, currentId),
      parent: resolveParentNodeId(workspace, currentId),
      firstChild: resolveFirstChildNodeId(workspace, currentId),
      nextSibling: resolveNextSiblingNodeId(workspace, currentId),
      previousSibling: resolvePreviousSiblingNodeId(workspace, currentId),
    }
  }, [currentId, workspace])

  const goTo = useCallback(
    (targetId: string | null) => {
      if (targetId && targetId !== currentId) {
        selectNode(targetId)
      }
    },
    [currentId, selectNode],
  )

  const selectOriginal = useCallback(
    () => goTo(targets.original),
    [goTo, targets.original],
  )
  const selectSource = useCallback(
    () => goTo(targets.source),
    [goTo, targets.source],
  )
  const selectParent = useCallback(
    () => goTo(targets.parent),
    [goTo, targets.parent],
  )
  const selectFirstChild = useCallback(
    () => goTo(targets.firstChild),
    [goTo, targets.firstChild],
  )
  const selectNextSibling = useCallback(
    () => goTo(targets.nextSibling),
    [goTo, targets.nextSibling],
  )
  const selectPreviousSibling = useCallback(
    () => goTo(targets.previousSibling),
    [goTo, targets.previousSibling],
  )

  const canMove = (targetId: string | null) =>
    targetId !== null && targetId !== currentId

  return {
    selectOriginal,
    selectSource,
    selectParent,
    selectFirstChild,
    selectNextSibling,
    selectPreviousSibling,
    canSelectOriginal: canMove(targets.original),
    canSelectSource: canMove(targets.source),
    canSelectParent: canMove(targets.parent),
    canSelectFirstChild: canMove(targets.firstChild),
    canSelectNextSibling: canMove(targets.nextSibling),
    canSelectPreviousSibling: canMove(targets.previousSibling),
  }
}
