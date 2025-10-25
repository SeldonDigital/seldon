"use client"

import React, { Profiler } from "react"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { usePreview } from "@lib/hooks/use-preview"
import { useCanvas } from "./hooks/use-canvas"
import { useActiveBoard } from "@lib/workspace/use-active-board"
import { CanvasBoard } from "./Board"

export function CanvasWorkspace() {
  const { onCanvasMouseMove, onCanvasMouseLeave, onCanvasClick } = useCanvas()

  const { isInPreviewMode } = usePreview()

  return (
    <div
      id="root-tree"
      onClick={isInPreviewMode ? undefined : onCanvasClick}
      onMouseLeave={isInPreviewMode ? undefined : onCanvasMouseLeave}
      onMouseMove={isInPreviewMode ? undefined : onCanvasMouseMove}
    >
      <MemoizedBoard />
    </div>
  )
}

function Board() {
  const { debugModeEnabled } = useDebugMode()
  const { activeBoard } = useActiveBoard()

  const board = activeBoard ? <CanvasBoard board={activeBoard} /> : null

  if (debugModeEnabled) {
    return (
      <Profiler
        id="canvas"
        onRender={(_id, _phase, actualDuration) =>
          console.info(
            "[performance] Canvas rendering took: " +
              Math.round(actualDuration) +
              "ms",
          )
        }
      >
        {board}
      </Profiler>
    )
  }

  return board
}

const MemoizedBoard = React.memo(Board)
