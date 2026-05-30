import { Placement } from "@lib/types"
import { useCallback } from "react"
import {
  Instance,
  InstanceId,
  Variant,
  VariantId,
  invariant,
} from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { getComponentOrder } from "@seldon/core/workspace/helpers/components/component-sort-order"
import { getComponentVariantRootIds } from "@seldon/core/workspace/helpers/components/get-component-variant-root-ids"
import { findParentNode } from "@seldon/core/workspace/helpers/nodes/find-parent-node"
import { getVariantById } from "@seldon/core/workspace/helpers/general/get-variant-by-id"
import { getVariantIndex } from "@seldon/core/workspace/helpers/general/get-variant-index"
import { isDefaultVariant } from "@seldon/core/workspace/helpers/general/is-default-variant"
import { nodeAllowsReordering } from "@seldon/core/workspace/helpers/nodes/node-allows-reordering"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import type { ComponentEntry } from "@seldon/core/workspace/types"
import {
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "@lib/workspace/node-tree"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
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

      if (!nodeAllowsReordering(parent.id, workspace)) {
        const catalogId = getNodeCatalogComponentId(parent, workspace)
        invariant(catalogId, "Parent catalog id not found")
        const schema = getComponentSchema(catalogId)
        addToast(
          `${schema.name} component does not allow reordering of child components`,
        )
        return
      }

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
      targetBoard: ComponentEntry
      subjectBoard: ComponentEntry
      position: Placement
      isPreview?: boolean
    }) => {
      const targetOrder = getComponentOrder(targetBoard)

      dispatch(
        {
          type: "reorder_board",
          payload: {
            componentKey: getComponentKey(subjectBoard),
            newIndex:
              position === "before" ? targetOrder : targetOrder + 1,
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
            componentKey: getComponentKey(board),
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

      const targetChildIds = getNodeChildIds(targetNode, workspace)
      if (isChild && targetChildIds.length > 0) {
        return moveChildTo(
          subjectNode.id,
          targetNode.id,
          targetChildIds.length,
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
