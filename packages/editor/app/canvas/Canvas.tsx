"use client"

import { DEFAULT_CHROME_THEME } from "@lib/theme/chrome-themes"
import React, { CSSProperties, useEffect, useRef } from "react"
import { isHotkeyPressed } from "react-hotkeys-hook"
import {
  TransformComponent,
  useControls,
  useTransformContext,
} from "react-zoom-pan-pinch"
import { useThrottledCallback } from "use-debounce"
import { useActiveBoard } from "@lib/workspace/hooks/use-active-board"
import {
  useSelection,
  useStore as useSelectionStore,
} from "@lib/workspace/hooks/use-selection"
import { useSetHoverState } from "@lib/hooks/use-canvas-hover-state"
import { useDialog } from "@lib/hooks/use-dialog"
import { useTool } from "@lib/hooks/use-tool"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { CanvasTracking } from "../tracking/CanvasTracking"
import {
  TRANSFORM_WRAPPER_INITIAL_POSITION_X,
  TRANSFORM_WRAPPER_INITIAL_POSITION_Y,
  TransformWrapper,
} from "./TransformWrapper"
import { CanvasWorkspace } from "./Workspace"

const canvasStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  height: "100%",
  width: "100%",
  WebkitFontSmoothing: "auto",
}

function getPanCursor(
  isPanning: boolean,
  isSpacebarPressed: boolean,
): CSSProperties["cursor"] {
  if (isPanning) return "grabbing"
  if (isSpacebarPressed) return "grab"
  return undefined
}

export const Canvas = () => {
  const { selectBoard, selectNode } = useSelection()
  const { activeBoard } = useActiveBoard()
  const { activeTool, setActiveTool } = useTool()
  const setHoverState = useSetHoverState()
  const { activeDialog } = useDialog()

  const prevToolRef = useRef(activeTool)
  const savedNodeSelectionRef = useRef<{
    id: NonNullable<
      ReturnType<typeof useSelectionStore.getState>["selectedNodeId"]
    >
    rootId: string | null
  } | null>(null)

  // Entering insert component mode selects the active board so it reads as the
  // accent insertion context, after saving the current node selection. Leaving
  // the mode restores that node so escaping or canceling returns to where the
  // user was, instead of leaving the board selected.
  useEffect(() => {
    const prevTool = prevToolRef.current
    prevToolRef.current = activeTool

    const enteringComponent =
      activeTool === "component" && prevTool !== "component"
    const leavingComponent =
      activeTool !== "component" && prevTool === "component"

    if (enteringComponent) {
      const { selectedNodeId, selectedNodeRootId } =
        useSelectionStore.getState()
      savedNodeSelectionRef.current = selectedNodeId
        ? { id: selectedNodeId, rootId: selectedNodeRootId }
        : null
      if (activeBoard) {
        selectBoard(getComponentKey(activeBoard))
      }
      return
    }

    if (activeTool === "component" && activeBoard) {
      selectBoard(getComponentKey(activeBoard))
      return
    }

    if (leavingComponent) {
      const saved = savedNodeSelectionRef.current
      savedNodeSelectionRef.current = null
      if (saved) {
        selectNode(saved.id, saved.rootId)
      }
    }
  }, [activeTool, activeBoard, selectBoard, selectNode])

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

  const handleCanvasClick = (event: React.MouseEvent) => {
    const rootTree = document.getElementById("root-tree")
    if (rootTree?.contains(event.target as Node)) {
      return
    }

    // Insert component tool: clicking the empty canvas outside the board cancels
    // the tool and returns to select.
    if (activeTool === "component") {
      setActiveTool("select")
    }

    // Select tool: clicking the empty canvas keeps the current selection. Board
    // selection happens when clicking the board frame itself, handled inside the
    // root tree by useCanvas.
  }

  return (
    <div
      id="canvas"
      onClick={handleCanvasClick}
      style={canvasStyle}
      onMouseMove={activeDialog ? undefined : onMouseMove}
      data-theme={DEFAULT_CHROME_THEME}
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

  // Key the reset on the board's stable key, not the object reference. The
  // board entry is recreated on structural edits (delete, paste), and resetting
  // on reference changes would snap the zoom back to actual size mid-edit.
  const activeBoardKey = activeBoard ? getComponentKey(activeBoard) : null

  // Reset the transform when the active board changes (e.g. switching boards
  // or loading another project).
  useEffect(() => {
    setTransform(
      TRANSFORM_WRAPPER_INITIAL_POSITION_X,
      TRANSFORM_WRAPPER_INITIAL_POSITION_Y,
      1,
      0,
    )
    // This is intentional beacuse setTransform is not stable
    // so adding it to the deps would the canvas to reset the transform on every render
  }, [activeBoardKey])

  const wrapperStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    backgroundColor: "#141414",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    cursor: getPanCursor(isPanning, isSpacebarPressed),
  }

  return (
    <TransformComponent wrapperStyle={wrapperStyle}>
      <CanvasWorkspace />
    </TransformComponent>
  )
}
