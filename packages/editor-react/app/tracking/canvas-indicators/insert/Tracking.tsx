"use client"

import { useMemo } from "react"
import { invariant } from "@seldon/core/index"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useCanvasHoverState } from "@app/canvas/hooks/use-canvas-hover-state"
import { useTool } from "@app/editor/hooks/use-tool"
import { useBelongsToActiveBoard } from "../../hooks/use-belongs-to-active-board"
import { checkInsertionPoint } from "../../helpers/check-insertion-point"
import { CanvasIndicator } from "./CanvasIndicator"
import { InsertGapSiblings } from "./InsertGapSiblings"

/**
 * Canvas tracking component for component insertion mode.
 * Renders insertion indicators based on hover state and insertion context.
 */
export function InsertTracking() {
  const { activeTool } = useTool()
  const { hoverState } = useCanvasHoverState()
  const { workspace } = useWorkspace()
  const { hoverBelongsToActiveBoard } = useBelongsToActiveBoard()

  invariant(activeTool === "component", "Must be used in component mode")
  invariant(hoverState, "This component requires a hover state")

  const { objectId, objectType, placement, lastChildNodeBeforeCursor } =
    hoverState

  const insertionAllowed = useMemo(() => {
    return checkInsertionPoint(
      objectId,
      objectType,
      placement,
      workspace,
      "component",
    )
  }, [objectId, objectType, placement, workspace])

  if (!hoverBelongsToActiveBoard) return null

  if (hoverState.objectType === "board") {
    return (
      <CanvasIndicator
        lastChildNodeBeforeCursor={lastChildNodeBeforeCursor}
        objectId={objectId}
        objectType={objectType}
        placement={placement}
      />
    )
  }

  if (!insertionAllowed) return null

  return (
    <>
      <InsertGapSiblings />
      <CanvasIndicator
        lastChildNodeBeforeCursor={lastChildNodeBeforeCursor}
        objectId={objectId}
        objectType={objectType}
        placement={placement}
      />
    </>
  )
}
