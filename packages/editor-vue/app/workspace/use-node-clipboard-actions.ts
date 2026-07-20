import { useToastStore } from "@app/toaster/toast-store"
import { useObjectClipboardStore } from "@app/workspace/object-clipboard-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import { useMoveObjects } from "@app/workspace/use-move-objects"
import { useSelection } from "@app/workspace/use-selection"
import { useWorkspace } from "@app/workspace/use-workspace"
import { getNodeChildIds } from "@seldon/editor/lib/workspace/node-tree"
import { resolvePasteTarget } from "@seldon/editor/lib/workspace/paste-target"
import { getNode } from "@seldon/editor/lib/workspace/workspace-accessors"

import { InstanceId, VariantId } from "@seldon/core"
import { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"
import { typeCheckingService } from "@seldon/core/workspace/services"

/**
 * Cut/copy/paste for the selected object. The clipboard holds a node id only;
 * the node is re-read at paste time so a deleted source errors instead of
 * pasting stale state. A cut moves an instance by composing a `remove_instance`
 * onto the post-paste workspace and committing it as one `set_workspace`.
 * Mirrors the React `useNodeClipboardActions`.
 */
export function useNodeClipboardActions() {
  const { workspace } = useWorkspace()
  const dispatch = useDispatch()
  const { selectedNode, selectedBoardId, selectNode } = useSelection()
  const { duplicateNodeInto, duplicateVariantOnBoard } = useMoveObjects()
  const clipboard = useObjectClipboardStore()
  const toast = useToastStore()

  function cutOrCopyNode(clipboardMode: "cut" | "copy"): void {
    const node = selectedNode.value
    if (!node) {
      toast.addToast("Select an object to copy")
      return
    }
    clipboard.setClipboard(node.id as VariantId | InstanceId, clipboardMode)
  }

  function pasteNode(): void {
    const nodeId = clipboard.nodeId
    const mode = clipboard.mode
    if (!nodeId) {
      toast.addToast("Nothing to paste")
      return
    }

    const subject = getNode(workspace.value, nodeId)
    if (!subject) {
      toast.addToast("The copied object no longer exists")
      clipboard.clearClipboard()
      return
    }

    const result = resolvePasteTarget({
      subjectId: nodeId,
      selectedNode: selectedNode.value ?? null,
      selectedBoardId: selectedBoardId.value,
      workspace: workspace.value,
    })

    if (result.action === "error") {
      toast.addToast(result.message)
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
    if (newState && mode === "cut" && typeCheckingService.isInstance(subject)) {
      const afterRemove = workspaceReducer(newState, {
        type: "remove_instance",
        payload: { instanceId: subject.id as InstanceId },
      })
      dispatch({ type: "set_workspace", payload: { workspace: afterRemove } })
    }

    if (mode === "cut") clipboard.clearClipboard()
  }

  return {
    copyNode: () => cutOrCopyNode("copy"),
    cutNode: () => cutOrCopyNode("cut"),
    pasteNode,
  }
}
