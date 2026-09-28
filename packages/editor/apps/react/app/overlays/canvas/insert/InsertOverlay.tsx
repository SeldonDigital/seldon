"use client"

import { getHoverDropSlot, useCanvasHoverState } from "@app/canvas/hooks/use-canvas-hover-state"
import { useComponentDragSession } from "@app/canvas/hooks/use-component-drag-session"
import { useTool } from "@app/editor/hooks/use-tool"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { getSlotIndex } from "@seldon/editor/lib/canvas/drag/drop-slot"
import { canNodeAcceptChildren } from "@seldon/editor/lib/workspace/can-node-accept-children"
import { resolveComponentDrop } from "@seldon/editor/lib/workspace/component-drag"
import { useMemo } from "react"

import { invariant } from "@seldon/core/index"

import { checkInsertionPoint } from "../../helpers/check-insertion-point"
import { useBelongsToActiveBoard } from "../../hooks/use-belongs-to-active-board"
import { CanvasDropFeedback } from "../drop/CanvasDropFeedback"

import type { Instance, Variant } from "@seldon/core"

/**
 * Where the insert tool would place a component, drawn by the shared drop
 * feedback so an insertion and a reorder drag mark a slot the same way.
 */
export function InsertOverlay() {
  const { activeTool } = useTool()
  const { hoverState } = useCanvasHoverState()
  const { payload } = useComponentDragSession()
  const { workspace } = useWorkspace()
  const { hoverBelongsToActiveBoard } = useBelongsToActiveBoard()

  invariant(activeTool === "component", "Must be used in component mode")
  invariant(hoverState, "This component requires a hover state")

  const slot = useMemo(() => getHoverDropSlot(hoverState), [hoverState])

  const insertionAllowed = useMemo(() => {
    if (!payload || slot.containerType === "board") return false

    const container = workspace.nodes[slot.containerId] as Variant | Instance | undefined

    if (!container || !canNodeAcceptChildren(container, workspace)) return false

    if (!checkInsertionPoint(slot.containerId, "node", "inside", workspace, "component"))
      return false

    return resolveComponentDrop(
      payload,
      {
        nodeId: container.id,
        index: getSlotIndex(slot, workspace),
      },
      workspace,
    ).isValid
  }, [payload, slot, workspace])

  if (!hoverBelongsToActiveBoard || !insertionAllowed) return null

  return <CanvasDropFeedback slot={slot} />
}
