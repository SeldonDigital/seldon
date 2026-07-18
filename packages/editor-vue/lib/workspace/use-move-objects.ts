import { InstanceId, VariantId, invariant } from "@seldon/core"
import { findParentNode } from "@seldon/core/workspace/helpers/nodes/find-parent-node"
import { typeCheckingService } from "@seldon/core/workspace/services"
import { getNodeChildIds } from "@seldon/editor/lib/workspace/node-tree"
import type { Placement } from "@seldon/editor/lib/types"
import { getCurrentWorkspace } from "@lib/stores/history-store"
import { useToastStore } from "@lib/stores/toast-store"
import { useDispatch } from "@lib/workspace/use-dispatch"

/**
 * Instance drag-and-drop moves for the objects tree. Index math reads the
 * committed workspace so a same-parent reorder computes against stable state.
 * A pragmatic subset of the React `useMoveObjects`: it handles instance
 * subjects dropped next to or inside another node, and instantiates a variant
 * subject as a child when dropped inside.
 */
export function useMoveObjects() {
  const dispatch = useDispatch()
  const toast = useToastStore()

  function moveChildTo(
    nodeId: InstanceId,
    parentId: VariantId | InstanceId,
    index: number,
  ): void {
    dispatch({
      type: "move_instance",
      payload: { instanceId: nodeId, target: { parentId, index } },
    })
  }

  function moveNodeNextTo(
    targetId: string,
    subjectId: string,
    position: Exclude<Placement, "inside">,
  ): void {
    const workspace = getCurrentWorkspace()
    const subject = workspace.nodes[subjectId as InstanceId]
    if (!subject || !typeCheckingService.isInstance(subject)) {
      toast.addToast("Only instances can be moved here")
      return
    }

    const parent = findParentNode(targetId as InstanceId, workspace)
    invariant(parent, "Parent not found")
    const childIds = getNodeChildIds(parent, workspace)

    const targetIndex = childIds.indexOf(targetId)
    const subjectIndex = childIds.indexOf(subjectId)
    let newIndex = position === "before" ? targetIndex : targetIndex + 1

    if (subjectIndex !== -1) {
      if (subjectIndex < targetIndex) newIndex -= 1
      dispatch({
        type: "reorder_instance_in_parent",
        payload: { instanceId: subjectId as InstanceId, newIndex },
      })
      return
    }

    moveChildTo(
      subjectId as InstanceId,
      parent.id as VariantId | InstanceId,
      newIndex,
    )
  }

  function moveNodeInside(targetId: string, subjectId: string): void {
    const workspace = getCurrentWorkspace()
    const target = workspace.nodes[targetId as InstanceId]
    if (!target) return
    const childIds = getNodeChildIds(target, workspace)
    const subject = workspace.nodes[subjectId as InstanceId]

    if (subject && typeCheckingService.isVariant(subject)) {
      dispatch({
        type: "insert_variant_instance",
        payload: {
          variantId: subjectId as VariantId,
          target: {
            parentId: targetId as VariantId | InstanceId,
            index: childIds.length,
          },
        },
      })
      return
    }

    if (!subject || !typeCheckingService.isInstance(subject)) {
      toast.addToast("Only instances can be nested here")
      return
    }

    moveChildTo(
      subjectId as InstanceId,
      targetId as VariantId | InstanceId,
      childIds.length,
    )
  }

  return { moveChildTo, moveNodeNextTo, moveNodeInside }
}
