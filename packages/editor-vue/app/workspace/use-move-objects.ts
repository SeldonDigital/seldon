import { useToastStore } from "@app/toaster/toast-store"
import { getCurrentWorkspace } from "@app/workspace/history-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import type { Placement } from "@seldon/editor/lib/types"
import { getNodeChildIds } from "@seldon/editor/lib/workspace/node-tree"

import {
  Instance,
  InstanceId,
  Variant,
  VariantId,
  invariant,
} from "@seldon/core"
import { findParentNode } from "@seldon/core/workspace/helpers/nodes/find-parent-node"
import { typeCheckingService } from "@seldon/core/workspace/services"

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

  // Shared duplicate primitive. Holds the only variant-vs-instance branch so
  // paste stays in lockstep: a variant subject is instantiated, an instance
  // subject is duplicated, both into the same (parentId, index). Returns the
  // resulting workspace so callers can resolve the freshly created node.
  function duplicateNodeInto(
    subjectNode: Instance | Variant,
    parentId: VariantId | InstanceId,
    index: number,
  ) {
    if (typeCheckingService.isVariant(subjectNode)) {
      return dispatch({
        type: "insert_variant_instance",
        payload: {
          variantId: subjectNode.id as VariantId,
          target: { parentId, index },
        },
      })
    }
    return dispatch({
      type: "insert_duplicate_instance",
      payload: {
        instanceId: subjectNode.id as InstanceId,
        target: { parentId, index },
      },
    })
  }

  function duplicateVariantOnBoard(variantId: VariantId) {
    return dispatch({
      type: "duplicate_node",
      payload: { nodeId: variantId },
    })
  }

  // Alt-duplicate a subject next to a target (before/after). An instance
  // subject is duplicated into the target's parent at the computed slot; a
  // variant subject has no next-to duplicate and duplicates on its board.
  function duplicateNodeNextTo(
    targetId: string,
    subjectId: string,
    position: Exclude<Placement, "inside">,
  ): void {
    const workspace = getCurrentWorkspace()
    const subject = workspace.nodes[subjectId as InstanceId]
    if (!subject) return

    if (typeCheckingService.isVariant(subject)) {
      duplicateVariantOnBoard(subject.id as VariantId)
      return
    }

    const parent = findParentNode(targetId as InstanceId, workspace)
    invariant(parent, "Parent not found")
    const childIds = getNodeChildIds(parent, workspace)
    const targetIndex = childIds.indexOf(targetId)
    const newIndex = position === "before" ? targetIndex : targetIndex + 1

    duplicateNodeInto(
      subject as Instance | Variant,
      parent.id as VariantId | InstanceId,
      newIndex,
    )
  }

  return {
    moveChildTo,
    moveNodeNextTo,
    moveNodeInside,
    duplicateNodeInto,
    duplicateNodeNextTo,
    duplicateVariantOnBoard,
  }
}
