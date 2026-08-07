"use client"

import { useDebugMode } from "@app/editor/hooks/use-debug-mode"
import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { Frame } from "@seldon/components/frames/Frame"
import React, { Profiler } from "react"

import { isResourceType } from "@seldon/core/workspace/helpers/components/is-resource-type"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"

import { ComponentBoard } from "./boards/ComponentBoard"
import { FontSpecimenCanvas } from "./boards/FontSpecimenCanvas.bespoke"
import { IconSetBoard } from "./boards/IconSetBoard.bespoke"
import { IsolationBoards } from "./boards/IsolationBoards"
import { SandboxCanvas } from "./boards/SandboxCanvas"
import { ThemeBoard } from "./boards/ThemeBoard"
import { useCanvas } from "./hooks/use-canvas"

import type { Board } from "@seldon/core"

export function CanvasWorkspace() {
  const {
    onCanvasMouseMove,
    onCanvasMouseLeave,
    onCanvasMouseDown,
    onCanvasClick,
    onCanvasDoubleClick,
  } = useCanvas()
  const { isolatedView, isolatedBoardKey } = useEditorConfig()
  const { workspace } = useWorkspace()

  // Isolation renders a multi-board gallery of the anchored board and its used
  // dependencies; otherwise the canvas shows the single active board.
  const showIsolationGallery =
    isolatedView && Boolean(isolatedBoardKey && workspace.boards[isolatedBoardKey])
  const content = showIsolationGallery ? <IsolationBoards /> : <MemoizedActiveBoard />

  return (
    <Frame
      id="root-tree"
      onClick={onCanvasClick}
      onDoubleClick={onCanvasDoubleClick}
      onMouseDown={onCanvasMouseDown}
      onMouseLeave={onCanvasMouseLeave}
      onMouseMove={onCanvasMouseMove}
    >
      {content}
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
      return <FontSpecimenCanvas board={board} />
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
          console.info("[performance] Canvas rendering took: " + Math.round(actualDuration) + "ms")
        }
      >
        {board}
      </Profiler>
    )
  }

  return board
}

const MemoizedActiveBoard = React.memo(ActiveBoard)
