"use client"

import React, { Profiler } from "react"
import { Board } from "@seldon/core"
import { isResourceType } from "@seldon/core/workspace/helpers/components/is-resource-type"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import { useDebugMode } from "@app/hooks/use-debug-mode"
import { usePreview } from "@app/hooks/use-preview"
import { useCanvas } from "./hooks/use-canvas"
import { Frame } from "@seldon/components/frames/Frame"
import { ComponentBoard } from "./boards/ComponentBoard"
import { FontCollectionBoard } from "./boards/FontCollectionBoard"
import { IconSetBoard } from "./boards/IconSetBoard"
import { SandboxCanvas } from "./boards/SandboxCanvas"
import { ThemeBoard } from "./boards/ThemeBoard"

export function CanvasWorkspace() {
  const { onCanvasMouseMove, onCanvasMouseLeave, onCanvasClick } = useCanvas()

  const { isInPreviewMode } = usePreview()

  const handleClick = isInPreviewMode ? undefined : onCanvasClick
  const handleMouseLeave = isInPreviewMode ? undefined : onCanvasMouseLeave
  const handleMouseMove = isInPreviewMode ? undefined : onCanvasMouseMove

  return (
    <Frame
      id="root-tree"
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <MemoizedActiveBoard />
    </Frame>
  )
}

function renderBoard(board: Board) {
  // Check if this is a resource board type.
  if (isResourceType(board)) {
    if (isIconSetBoard(board)) {
      return <IconSetBoard board={board} />
    }
    if (isThemeBoard(board)) {
      return <ThemeBoard board={board} />
    }
    if (isFontCollectionBoard(board)) {
      return <FontCollectionBoard board={board} />
    }
  }

  if (isPlaygroundBoard(board)) {
    return <SandboxCanvas board={board} />
  }

  // Default to regular board rendering
  return <ComponentBoard board={board} />
}

function ActiveBoard() {
  const { canvasProfiling } = useDebugMode()
  const { activeBoard } = useActiveBoard()

  const board = activeBoard ? renderBoard(activeBoard) : null

  if (canvasProfiling) {
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

const MemoizedActiveBoard = React.memo(ActiveBoard)
