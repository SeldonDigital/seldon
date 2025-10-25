import { Placement } from "@lib/types"
import { useCallback } from "react"
import {
  Board,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  invariant,
} from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { findParentNode } from "@seldon/core/workspace/helpers/find-parent-node"
import { getVariantById } from "@seldon/core/workspace/helpers/get-variant-by-id"
import { getVariantIndex } from "@seldon/core/workspace/helpers/get-variant-index"
import { isDefaultVariant } from "@seldon/core/workspace/helpers/is-default-variant"
import { nodeAllowsReordering } from "@seldon/core/workspace/helpers/node-allows-reordering"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useAddToast } from "@components/toaster/use-add-toast"
import { useWorkspace } from "./use-workspace"

export function useMoveObjects() {
  const { workspace, dispatch } = useWorkspace()
  const addToast = useAddToast()

  const moveChildTo = useCallback(
    (
      nodeId: InstanceId,
      parentId: VariantId | InstanceId,
      index: number,
      isPreview = false,
    ) => {
      dispatch(
        {
          type: "move_node",
          payload: { nodeId: nodeId, target: { parentId, index } },
        },
        isPreview,
      )
    },
    [dispatch],
  )

  const moveChildUpOrDown = useCallback(
    (nodeId: InstanceId, direction: "up" | "down", isPreview = false) => {
      const parent = findParentNode(nodeId, workspace)
      invariant(parent, "Parent not found")
      invariant(parent.children, "Parent does not have children")

      if (!nodeAllowsReordering(parent.id, workspace)) {
        const schema = getComponentSchema(parent.component)
        addToast(
          `${schema.name} component does not allow reordering of child components`,
        )
        return
      }

      const currentIndex = parent.children.indexOf(nodeId)
      const isAtLimit =
        direction === "up"
          ? currentIndex <= 0
          : currentIndex === -1 || currentIndex >= parent.children.length - 1

      if (isAtLimit) return

      dispatch(
        {
          type: "reorder_node",
          payload: {
            nodeId: nodeId,
            newIndex: currentIndex + (direction === "up" ? -1 : 1),
          },
        },
        isPreview,
      )
    },
    [workspace, dispatch, addToast],
  )

  const moveChildUp = useCallback(
    (nodeId: InstanceId, isPreview = false) => {
      moveChildUpOrDown(nodeId, "up", isPreview)
    },
    [moveChildUpOrDown],
  )

  const moveChildDown = useCallback(
    (nodeId: InstanceId, isPreview = false) => {
      moveChildUpOrDown(nodeId, "down", isPreview)
    },
    [moveChildUpOrDown],
  )

  const moveBoardNextTo = useCallback(
    ({
      targetBoard,
      subjectBoard,
      position,
      isPreview = false,
    }: {
      targetBoard: Board
      subjectBoard: Board
      position: Placement
      isPreview?: boolean
    }) => {
      if (targetBoard.order === undefined) {
        addToast("Target board does not have an index")
        return
      }

      dispatch(
        {
          type: "reorder_board",
          payload: {
            componentId: subjectBoard.id,
            newIndex:
              position === "before" ? targetBoard.order : targetBoard.order + 1,
          },
        },
        isPreview,
      )
    },
    [dispatch, addToast],
  )

  const reorderVariant = useCallback(
    (variantId: VariantId, index: number, isPreview = false) => {
      const variant = getVariantById(variantId, workspace)
      if (isDefaultVariant(variant) || index === 0) {
        addToast("Default variant cannot be moved or replaced")
        return
      }

      dispatch(
        {
          type: "reorder_node",
          payload: { nodeId: variantId, newIndex: index },
        },
        isPreview,
      )
    },
    [workspace, dispatch, addToast],
  )

  const moveNodeNextTo = useCallback(
    ({
      targetNode,
      subjectNode,
      position,
      isPreview = false,
    }: {
      targetNode: Instance | Variant
      subjectNode: Instance | Variant
      position: Placement
      isPreview?: boolean
    }) => {
      const isChild = workspaceService.isInstance(subjectNode)

      if (isChild) {
        if (workspaceService.isVariant(targetNode)) {
          addToast("Moving an instance next to a variant is not allowed")
          return
        }

        const parent = findParentNode(targetNode.id, workspace)
        invariant(parent, "Parent not found")
        invariant(parent.children, "Parent does not have children")

        let newIndex

        // If we're moving inside a node, we move the subject at the end of the target node
        if (position === "inside") {
          newIndex = parent!.children!.length
        }

        const targetIndex = parent.children.indexOf(targetNode.id)
        const subjectIndex = parent.children.indexOf(subjectNode.id)
        newIndex = position === "before" ? targetIndex : targetIndex + 1

        // If we're reordering within the same parent, we need to take the subject index into account
        if (subjectIndex !== -1 && subjectIndex < targetIndex) {
          newIndex -= 1
        }

        return moveChildTo(subjectNode.id, parent.id, newIndex, isPreview)
      } else {
        const targetVariant = targetNode as Variant
        const subjectVariant = subjectNode as Variant
        const currentIndex = getVariantIndex(targetVariant.id, workspace)

        return reorderVariant(subjectVariant.id, currentIndex, isPreview)
      }
    },
    [workspace, moveChildTo, addToast, reorderVariant],
  )

  const moveNodeInside = useCallback(
    ({
      targetNode,
      subjectNode,
      isPreview = false,
    }: {
      targetNode: Instance | Variant
      subjectNode: Instance | Variant
      isPreview?: boolean
    }) => {
      const isChild = workspaceService.isInstance(subjectNode)

      if (isChild && targetNode.children) {
        return moveChildTo(
          subjectNode.id,
          targetNode.id,
          targetNode.children!.length,
          isPreview,
        )
      } else {
        addToast("Variants cannot be moved inside other variants")
      }
    },
    [moveChildTo, addToast],
  )

  return {
    moveChildTo,
    moveChildUp,
    moveChildDown,
    reorderVariant,
    moveNodeNextTo,
    moveBoardNextTo,
    moveNodeInside,
  }
}
