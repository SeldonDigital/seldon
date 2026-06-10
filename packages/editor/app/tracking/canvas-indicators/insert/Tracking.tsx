"use client"

import { useMemo } from "react"
import { invariant } from "@seldon/core/index"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useCanvasHoverState } from "@lib/hooks/use-canvas-hover-state"
import { useTool } from "@lib/hooks/use-tool"
import { useBelongsToActiveBoard } from "../../hooks/use-belongs-to-active-board"
import { checkInsertionPoint } from "../../helpers/check-insertion-point"
import { IndicatorInsert } from "./IndicatorInsert"

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
      <IndicatorInsert
        lastChildNodeBeforeCursor={lastChildNodeBeforeCursor}
        objectId={objectId}
        objectType={objectType}
        placement={placement}
        label="Add variant"
      />
    )
  }

  if (!insertionAllowed) return null

  return (
    <IndicatorInsert
      lastChildNodeBeforeCursor={lastChildNodeBeforeCursor}
      objectId={objectId}
      objectType={objectType}
      placement={placement}
      label="Insert component"
    />
  )
}
