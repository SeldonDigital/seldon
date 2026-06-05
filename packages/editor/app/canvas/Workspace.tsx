"use client"

import React, { Profiler } from "react"
import { Board } from "@seldon/core"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { isResourceType } from "@seldon/core/workspace/helpers/components/is-resource-type"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { usePreview } from "@lib/hooks/use-preview"
import { useCanvas } from "./hooks/use-canvas"
import { useActiveBoard } from "@lib/workspace/use-active-board"
import { ComponentBoard } from "./boards/ComponentBoard"
import { FontCollectionBoard } from "./boards/FontCollectionBoard"
import { IconSetBoardPlaceholder } from "./boards/IconSetBoardPlaceholder"
import { PlaygroundBoardPlaceholder } from "./boards/PlaygroundBoardPlaceholder"
import { ThemeBoard } from "./boards/ThemeBoard"

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
      <MemoizedActiveBoard />
    </div>
  )
}

function renderBoard(board: Board) {
  // Check if this is a resource board type.
  if (isResourceType(board)) {
    if (isIconSetBoard(board)) {
      return <IconSetBoardPlaceholder board={board} />
    }
    if (isThemeBoard(board)) {
      return <ThemeBoard board={board} />
    }
    if (isFontCollectionBoard(board)) {
      return <FontCollectionBoard board={board} />
    }
  }

  if (isPlaygroundBoard(board)) {
    return <PlaygroundBoardPlaceholder board={board} />
  }

  // Default to regular board rendering
  return <ComponentBoard board={board} />
}

function ActiveBoard() {
  const { debugModeEnabled } = useDebugMode()
  const { activeBoard } = useActiveBoard()

  const board = activeBoard ? renderBoard(activeBoard) : null

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

const MemoizedActiveBoard = React.memo(ActiveBoard)
