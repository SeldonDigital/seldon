import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { useMoveObjects } from "@app/workspace/hooks/use-move-objects"
import { useObjectClipboard } from "@app/workspace/hooks/use-object-clipboard"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { getNodeChildIds } from "@seldon/editor/lib/workspace/node-tree"
import { resolvePasteTarget } from "@seldon/editor/lib/workspace/paste-target"
import { getNode } from "@seldon/editor/lib/workspace/workspace-accessors"
import { useCallback } from "react"

import { InstanceId, VariantId } from "@seldon/core/index"
import { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"
import { typeCheckingService } from "@seldon/core/workspace/services"

export function useNodeClipboardActions() {
  const addToast = useAddToast()
  const { workspace, dispatch } = useWorkspace()
  const { selectedNode, selectedBoardId, selectNode } = useSelection()
  const { duplicateNodeInto, duplicateVariantOnBoard } = useMoveObjects()
  const { nodeId, mode, setClipboard, clearClipboard } = useObjectClipboard()

  const cutOrCopyNode = useCallback(
    (clipboardMode: "cut" | "copy") => {
      if (!selectedNode) {
        addToast("Select an object to copy")
        return
      }
      setClipboard(selectedNode.id, clipboardMode)
    },
    [selectedNode, setClipboard, addToast],
  )

  const pasteNode = useCallback(() => {
    if (!nodeId) {
      addToast("Nothing to paste")
      return
    }

    const subject = getNode(workspace, nodeId)
    if (!subject) {
      addToast("The copied object no longer exists")
      clearClipboard()
      return
    }

    const result = resolvePasteTarget({
      subjectId: nodeId,
      selectedNode: selectedNode ?? null,
      selectedBoardId,
      workspace,
    })

    if (result.action === "error") {
      addToast(result.message)
      return
    }

    let newState
    if (result.action === "duplicate-into") {
      newState = duplicateNodeInto(subject, result.parentId, result.index)

      // Select the freshly created node at the resolved slot.
      if (newState) {
        const parent = getNode(newState, result.parentId)
        const newNodeId = parent
          ? getNodeChildIds(parent, newState)[result.index]
          : undefined
        if (newNodeId) selectNode(newNodeId as VariantId | InstanceId)
      }
    } else {
      newState = duplicateVariantOnBoard(result.variantId)
    }

    // A cut moves an instance: remove the source after a successful paste.
    // Variants are never auto-removed because their instances reference them.
    // The removal is composed onto the post-paste state and committed as a
    // single dispatch, since the dispatch closure still reads the pre-paste
    // state within this callback.
    if (newState && mode === "cut" && typeCheckingService.isInstance(subject)) {
      const afterRemove = workspaceReducer(newState, {
        type: "remove_instance",
        payload: { instanceId: subject.id as InstanceId },
      })
      dispatch({
        type: "set_workspace",
        payload: { workspace: afterRemove },
      })
    }

    if (mode === "cut") clearClipboard()
  }, [
    nodeId,
    mode,
    workspace,
    selectedNode,
    selectedBoardId,
    duplicateNodeInto,
    duplicateVariantOnBoard,
    selectNode,
    dispatch,
    clearClipboard,
    addToast,
  ])

  return {
    copyNode: () => cutOrCopyNode("copy"),
    cutNode: () => cutOrCopyNode("cut"),
    pasteNode,
  }
}
