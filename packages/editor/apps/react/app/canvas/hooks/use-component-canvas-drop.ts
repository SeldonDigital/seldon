import { useAutoSelectNode } from "@app/workspace/hooks/use-auto-select-node"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { resolveCanvasPlacement } from "@seldon/editor/lib/canvas/drag/canvas-placement"
import { getSlotIndex } from "@seldon/editor/lib/canvas/drag/drop-slot"
import { resolveComponentDrop } from "@seldon/editor/lib/workspace/component-drag"
import { confirmMissingSchemaVariants } from "@seldon/editor/lib/workspace/confirm-missing-schema-variants"
import { useEffect, useRef } from "react"

import {
  getHoverDropSlot,
  getHoverStateSnapshot,
  getSlotHoverState,
  useSetHoverState,
} from "./use-canvas-hover-state"

import type {
  ComponentDragPayload,
  ComponentDropTarget,
} from "@seldon/editor/lib/workspace/component-drag"

export function useComponentCanvasDrop() {
  const ref = useRef<HTMLElement | null>(null)
  const { workspace } = useWorkspace({ usePreview: false })
  const { dispatchWithAutoSelect } = useAutoSelectNode()
  const setHoverState = useSetHoverState()

  useEffect(() => {
    const element = ref.current

    if (!element) return

    return dropTargetForElements({
      element,
      canDrop: ({ source }) => source.data.action === "component-palette-insert",
      onDrag: ({ location }) => {
        const input = location.current.input
        const resolution = resolveCanvasPlacement(
          { x: input.clientX, y: input.clientY },
          null,
          workspace,
        )

        if (resolution.kind === "slot") {
          setHoverState(getSlotHoverState(resolution.slot))
        }
      },
      onDrop: ({ source }) => {
        const target = getDropTarget(workspace)
        const payload = source.data.payload as ComponentDragPayload
        const resolution = target ? resolveComponentDrop(payload, target, workspace) : null

        if (!target || !resolution?.isValid) return

        void insertComponent(payload, target, dispatchWithAutoSelect)
      },
    })
  }, [dispatchWithAutoSelect, setHoverState, workspace])

  return ref
}

function getDropTarget(workspace: Parameters<typeof getSlotIndex>[1]): ComponentDropTarget | null {
  const hoverState = getHoverStateSnapshot()

  if (!hoverState) return null

  const slot = getHoverDropSlot(hoverState)

  if (slot.containerType !== "node") return null

  return {
    nodeId: slot.containerId,
    index: getSlotIndex(slot, workspace),
  }
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
