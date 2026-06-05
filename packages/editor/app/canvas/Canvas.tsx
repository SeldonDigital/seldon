"use client"

import { useEffect } from "react"
import { isHotkeyPressed } from "react-hotkeys-hook"
import {
  TransformComponent,
  useControls,
  useTransformContext,
} from "react-zoom-pan-pinch"
import { useThrottledCallback } from "use-debounce"
import { useSetHoverState } from "@lib/hooks/use-canvas-hover-state"
import { useDialog } from "@lib/hooks/use-dialog"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useActiveBoard } from "@lib/workspace/use-active-board"
import { useSelection } from "@lib/workspace/use-selection"
import { CanvasTracking } from "../tracking/CanvasTracking"
import {
  TRANSFORM_WRAPPER_INITIAL_POSITION_X,
  TRANSFORM_WRAPPER_INITIAL_POSITION_Y,
  TransformWrapper,
} from "./TransformWrapper"
import { CanvasWorkspace } from "./Workspace"

export const Canvas = () => {
  const { selectBoard, selectNode } = useSelection()
  const { activeBoard } = useActiveBoard()
  const setHoverState = useSetHoverState()
  const { activeDialog } = useDialog()

  // We want to check if the mouse is outside the root tree and if so,
  // set the hover state to null
  const onMouseMove = useThrottledCallback((event) => {
    const rootTree = document.querySelector("#root-tree")
    // The tree can be transiently absent (no active board, unmount, Fast Refresh),
    // so a missing #root-tree is expected rather than an invariant violation.
    if (!rootTree) return

    if (!rootTree.contains(event.target as Node)) {
      setHoverState(null)
    }
  }, 1000 / 60)

  return (
    <div
      id="canvas"
      onClick={() => {
        if (activeBoard) selectBoard(getComponentKey(activeBoard))
        else selectNode(null)
      }}
      style={{
        position: "absolute",
        inset: 0,
        height: "100%",
        width: "100%",
        WebkitFontSmoothing: "auto",
      }}
      onMouseMove={activeDialog ? undefined : onMouseMove}
    >
      <CanvasTracking />
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
      wrapperStyle={{
        width: "100%",
        height: "100%",
        backgroundColor: "#141414",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        cursor: isPanning
          ? "grabbing"
          : isSpacebarPressed
            ? "grab"
            : undefined,
      }}
    >
      <CanvasWorkspace />
    </TransformComponent>
  )
}
