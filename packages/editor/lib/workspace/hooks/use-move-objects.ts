import { Placement } from "@lib/types"
import { useCallback } from "react"
import {
  Instance,
  InstanceId,
  Variant,
  VariantId,
  invariant,
} from "@seldon/core"
import { getBoardOrder } from "@seldon/core/workspace/helpers/components/board-sort-order"
import { getBoardVariantRootIds } from "@seldon/core/workspace/helpers/components/get-board-variant-root-ids"
import { getVariantById } from "@seldon/core/workspace/helpers/general/get-variant-by-id"
import { getVariantIndex } from "@seldon/core/workspace/helpers/general/get-variant-index"
import { isDefaultVariant } from "@seldon/core/workspace/helpers/general/is-default-variant"
import { findParentNode } from "@seldon/core/workspace/helpers/nodes/find-parent-node"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import type { Board } from "@seldon/core/workspace/types"
import { getNodeChildIds } from "@lib/workspace/node-tree"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { useWorkspace } from "./use-workspace"

export function useMoveObjects() {
  // Index math must read committed state. During a live drag preview the
  // preview-aware workspace already reflects the prior hover's move, which would
  // drift the computed index. `dispatch` rebuilds from committed state regardless.
  const { workspace, dispatch } = useWorkspace({ usePreview: false })
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
          type: "move_instance",
          payload: { instanceId: nodeId, target: { parentId, index } },
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
      const childIds = getNodeChildIds(parent, workspace)
      invariant(childIds.length > 0, "Parent does not have children")

      const currentIndex = childIds.indexOf(nodeId)
      const isAtLimit =
        direction === "up"
          ? currentIndex <= 0
          : currentIndex === -1 || currentIndex >= childIds.length - 1

      if (isAtLimit) return

      dispatch(
        {
          type: "reorder_instance_in_parent",
          payload: {
            instanceId: nodeId,
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
      const targetOrder = getBoardOrder(targetBoard)

      dispatch(
        {
          type: "reorder_board",
          payload: {
            boardKey: getComponentKey(subjectBoard),
            newIndex: position === "before" ? targetOrder : targetOrder + 1,
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
      const board = workspaceService.findBoardForVariant(variant, workspace)
      invariant(board, "Board not found")
      if (isDefaultVariant(variant) || index === 0) {
        addToast("Default variant cannot be moved or replaced")
        return
      }

      dispatch(
        {
          type: "reorder_variant_in_board",
          payload: {
            boardKey: getComponentKey(board),
            variantRootId: variantId,
            newIndex: index,
          },
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
        const childIds = getNodeChildIds(parent, workspace)
        invariant(childIds.length > 0, "Parent does not have children")

        let newIndex

        // If we're moving inside a node, we move the subject at the end of the target node
        if (position === "inside") {
          newIndex = childIds.length
        }

        const targetIndex = childIds.indexOf(targetNode.id)
        const subjectIndex = childIds.indexOf(subjectNode.id)
        newIndex = position === "before" ? targetIndex : targetIndex + 1

        // If we're reordering within the same parent, we need to take the subject index into account
        if (subjectIndex !== -1 && subjectIndex < targetIndex) {
          newIndex -= 1
        }

        // Same-parent reorder. `move_instance` resolves nodes by catalog path and
        // no-ops on `node:` linked instances, so reorder the instance directly.
        if (subjectIndex !== -1) {
          dispatch(
            {
              type: "reorder_instance_in_parent",
              payload: {
                instanceId: subjectNode.id as InstanceId,
                newIndex,
              },
            },
            isPreview,
          )
          return
        }

        return moveChildTo(subjectNode.id, parent.id, newIndex, isPreview)
      } else {
        const targetVariant = targetNode as Variant
        const subjectVariant = subjectNode as Variant
        const currentIndex = getVariantIndex(targetVariant.id, workspace)

        return reorderVariant(subjectVariant.id, currentIndex, isPreview)
      }
    },
    [workspace, moveChildTo, dispatch, addToast, reorderVariant],
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

      // Append after any existing children. An empty container yields index 0,
      // so nesting into an empty container inserts the object as the first child.
      const targetChildIds = getNodeChildIds(targetNode, workspace)

      // A variant subject cannot be moved; instantiate it as a new child instance.
      if (!isChild) {
        dispatch(
          {
            type: "insert_variant_instance",
            payload: {
              variantId: subjectNode.id as VariantId,
              target: {
                parentId: targetNode.id,
                index: targetChildIds.length,
              },
            },
          },
          isPreview,
        )
        return
      }

      return moveChildTo(
        subjectNode.id,
        targetNode.id,
        targetChildIds.length,
        isPreview,
      )
    },
    [workspace, moveChildTo, dispatch],
  )

  // Shared duplicate primitive. Holds the only variant-vs-instance branch so
  // paste and option-drag stay in lockstep: a variant subject is instantiated,
  // an instance subject is duplicated, both into the same (parentId, index).
  const duplicateNodeInto = useCallback(
    (
      subjectNode: Instance | Variant,
      parentId: VariantId | InstanceId,
      index: number,
      isPreview = false,
    ) => {
      if (workspaceService.isVariant(subjectNode)) {
        return dispatch(
          {
            type: "insert_variant_instance",
            payload: {
              variantId: subjectNode.id as VariantId,
              target: { parentId, index },
            },
          },
          isPreview,
        )
      }

      return dispatch(
        {
          type: "insert_duplicate_instance",
          payload: {
            instanceId: subjectNode.id as InstanceId,
            target: { parentId, index },
          },
        },
        isPreview,
      )
    },
    [dispatch],
  )

  const duplicateVariantOnBoard = useCallback(
    (variantId: VariantId, isPreview = false) => {
      return dispatch(
        {
          type: "duplicate_node",
          payload: { nodeId: variantId },
        },
        isPreview,
      )
    },
    [dispatch],
  )

  const duplicateNodeInside = useCallback(
    ({
      targetNode,
      subjectNode,
      isPreview = false,
    }: {
      targetNode: Instance | Variant
      subjectNode: Instance | Variant
      isPreview?: boolean
    }) => {
      // Append after any existing children, mirroring moveNodeInside.
      const targetChildIds = getNodeChildIds(targetNode, workspace)
      return duplicateNodeInto(
        subjectNode,
        targetNode.id,
        targetChildIds.length,
        isPreview,
      )
    },
    [workspace, duplicateNodeInto],
  )

  const duplicateNodeNextTo = useCallback(
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
      // A variant target lives at the board top level; duplicating next to it
      // produces a new variant on the board, matching the board paste case.
      if (workspaceService.isVariant(targetNode)) {
        return duplicateVariantOnBoard(subjectNode.id as VariantId, isPreview)
      }

      const parent = findParentNode(targetNode.id, workspace)
      invariant(parent, "Parent not found")
      const childIds = getNodeChildIds(parent, workspace)
      const targetIndex = childIds.indexOf(targetNode.id)
      // No same-parent index subtraction: duplicate leaves the subject in place.
      const index = position === "before" ? targetIndex : targetIndex + 1
      return duplicateNodeInto(subjectNode, parent.id, index, isPreview)
    },
    [workspace, duplicateNodeInto, duplicateVariantOnBoard],
  )

  return {
    moveChildTo,
    moveChildUp,
    moveChildDown,
    reorderVariant,
    moveNodeNextTo,
    moveBoardNextTo,
    moveNodeInside,
    duplicateNodeInto,
    duplicateNodeInside,
    duplicateNodeNextTo,
    duplicateVariantOnBoard,
  }
}
