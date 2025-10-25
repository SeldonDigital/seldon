"use client"

import { cn } from "@lib/utils/cn"
import { useEffect } from "react"
import { isHotkeyPressed } from "react-hotkeys-hook"
import {
  TransformComponent,
  useControls,
  useTransformContext,
} from "react-zoom-pan-pinch"
import { useThrottledCallback } from "use-debounce"
import { invariant } from "@seldon/core"
import { useCanvasHoverState } from "@lib/hooks/use-canvas-hover-state"
import { useDialog } from "@lib/hooks/use-dialog"
import { useActiveBoard } from "@lib/workspace/use-active-board"
import { useSelection } from "@lib/workspace/use-selection"
import {
  TRANSFORM_WRAPPER_INITIAL_POSITION_X,
  TRANSFORM_WRAPPER_INITIAL_POSITION_Y,
  TransformWrapper,
} from "./TransformWrapper"
import { CanvasWorkspace } from "./Workspace"
import { TrackingOverlay } from "./tracking/TrackingOverlay"

export const Canvas = () => {
  const { selectBoard, selectNode } = useSelection()
  const { activeBoard } = useActiveBoard()
  const { setHoverState } = useCanvasHoverState()
  const { activeDialog } = useDialog()

  // We want to check if the mouse is outside the root tree and if so,
  // set the hover state to null
  const onMouseMove = useThrottledCallback((event) => {
    const rootTree = document.querySelector("#root-tree")
    invariant(rootTree, "root-tree not found")

    if (!rootTree.contains(event.target as Node)) {
      setHoverState(null)
    }
  }, 1000 / 60)

  return (
    <div
      id="canvas"
      onClick={() => {
        if (activeBoard) selectBoard(activeBoard.id)
        else selectNode(null)
      }}
      className="absolute inset-0 h-full w-full subpixel-antialiased"
      onMouseMove={activeDialog ? undefined : onMouseMove}
    >
      <TrackingOverlay />
      <TransformWrapper>
        <CanvasContainer />
      </TransformWrapper>
    </div>
  )
}

const CanvasContainer = () => {
  const isSpacebarPressed = isHotkeyPressed("space")
  const { setTransform } = useControls()
  const { isPanning } = useTransformContext()
  const { activeBoard } = useActiveBoard()

  // Reset the transform when the tree is reset to another project (which has a different id)
  // This a bit hacky. Ideally we would solve this with some sort of event bus.
  useEffect(() => {
    setTransform(
      TRANSFORM_WRAPPER_INITIAL_POSITION_X,
      TRANSFORM_WRAPPER_INITIAL_POSITION_Y,
      1,
      0,
    )
    // This is intentional beacuse setTransform is not stable
    // so adding it to the deps would the canvas to reset the transform on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBoard])

  return (
    <TransformComponent
      wrapperClass={cn(
        "!w-full !h-full bg-canvas flex items-start justify-center",
        isPanning ? "cursor-grabbing" : isSpacebarPressed && "cursor-grab",
      )}
    >
      <CanvasWorkspace />
    </TransformComponent>
  )
}
