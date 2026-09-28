import { useAutoSelectNode } from "@app/workspace/hooks/use-auto-select-node"
import { useMovePreviewSession } from "@app/workspace/hooks/use-move-preview-session"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { resolveComponentDrop } from "@seldon/editor/lib/workspace/component-drag"
import { confirmMissingSchemaVariants } from "@seldon/editor/lib/workspace/confirm-missing-schema-variants"
import { useEffect } from "react"

import { invariant } from "@seldon/core"

import { MOVE_NODE_ACTION } from "./use-draggable"

import type { MoveRequest } from "@app/workspace/hooks/use-apply-move"
import type { ElementDragPayload } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import type { DropTargetRecord } from "@atlaskit/pragmatic-drag-and-drop/types"
import type { Instance, Variant } from "@seldon/core"
import type { Placement } from "@seldon/editor/lib/types"
import type {
  ComponentDragPayload,
  ComponentDropTarget,
} from "@seldon/editor/lib/workspace/component-drag"

/**
 * Global monitor for drag-and-drop operations in the objects sidebar. Reads the
 * hovered row band and hands it to the shared preview session, which owns the
 * settle delay, the rollback, and the commit. The row's own drop indicator
 * follows the cursor immediately; the canvas preview lags behind it.
 */
export function useDraggableMonitor() {
  const { begin, target, finish } = useMovePreviewSession()
  const { dispatchWithAutoSelect } = useAutoSelectNode()
  const { workspace } = useWorkspace({ usePreview: false })

  useEffect(() => {
    const cleanupMonitor = monitorForElements({
      canMonitor: ({ source }) => source.data.action === MOVE_NODE_ACTION,

      onDragStart() {
        begin()
      },

      onDropTargetChange({ source, location }) {
        target(buildMoveRequest(location.current.dropTargets[0], source))
      },

      onDrop({ source, location }) {
        finish(buildMoveRequest(location.current.dropTargets[0], source))
      },
    })

    return cleanupMonitor
  }, [begin, target, finish])

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => source.data.action === "component-palette-insert",
      onDrop: ({ source, location }) => {
        const destination = location.current.dropTargets[0]
        const dropTarget = destination?.data.componentTarget as ComponentDropTarget | undefined
        const payload = source.data.payload as ComponentDragPayload

        if (!dropTarget || !resolveComponentDrop(payload, dropTarget, workspace).isValid) return

        void insertComponent(payload, dropTarget, dispatchWithAutoSelect)
      },
    })
  }, [dispatchWithAutoSelect, workspace])
}

async function insertComponent(
  payload: ComponentDragPayload,
  target: ComponentDropTarget,
  dispatchWithAutoSelect: ReturnType<typeof useAutoSelectNode>["dispatchWithAutoSelect"],
): Promise<void> {
  if (payload.kind === "authored") {
    dispatchWithAutoSelect({
      type: "insert_variant_instance",
      payload: {
        variantId: payload.variantId,
        target: { parentId: target.nodeId, index: target.index },
      },
    })

    return
  }

  const variantFallbacks = await confirmMissingSchemaVariants(payload.componentId)

  if (variantFallbacks === null) return

  dispatchWithAutoSelect({
    type: "add_component_and_insert_default_instance",
    payload: {
      boardKey: payload.componentId,
      variantFallbacks: variantFallbacks.length ? variantFallbacks : undefined,
      target: { parentId: target.nodeId, index: target.index },
    },
  })
}

function buildMoveRequest(
  destination: DropTargetRecord | undefined,
  source: ElementDragPayload,
): MoveRequest | null {
  if (!destination) return null

  invariant(source.data.action === MOVE_NODE_ACTION, `Invalid action: ${source.data.action}`)
  const targetNode = destination.data.targetNode as Variant | Instance
  const placement = destination.data.placement as Placement
  const subjectNode = source.data.subjectNode as Variant | Instance

  invariant(targetNode, "targetNode was not set")
  invariant(placement, "placement was not set")
  invariant(subjectNode, "subjectNode was not set")

  return {
    targetNode,
    subjectNode,
    placement,
    duplicate: destination.data.duplicate === true,
  }
}
