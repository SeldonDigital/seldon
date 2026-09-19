"use client"

import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { Frame } from "@seldon/components/frames/Frame"
import { captureBoardStore } from "@seldon/editor/lib/canvas/capture/capture-board"
import { getComponent } from "@seldon/editor/lib/workspace/workspace-accessors"

import { renderBoard } from "../Workspace"
import { useSharedStore } from "../hooks/use-shared-store"

import type { CaptureBoardState } from "@seldon/editor/lib/canvas/capture/capture-board"
import type { CSSProperties } from "react"

/**
 * How far off the viewport the surface sits. Canvas geometry, not a style value,
 * so it stays a plain number. Far enough that no board of any size reaches back
 * into view.
 */
const OFFSET_PX = -100_000

// Fixed rather than absolute so no ancestor's scroll or layout moves it, and the
// board inside lays out and measures normally at its own size. It sits outside
// the canvas transform, so canvas pan and zoom never reach it.
const surfaceStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: OFFSET_PX,
  pointerEvents: "none",
}

function selectBoardKey(state: CaptureBoardState): string | null {
  return state.boardKey
}

/**
 * The surface a capture rasterizes a board from when the canvas is showing a
 * different one. It holds nothing until `startCaptureBoard` names a board, and
 * empties again once the capture has its JPEG, so the user's selection, active
 * board, pan, and zoom stay exactly as they were. Mount it once in the editor
 * shell, outside the canvas.
 */
export function CaptureBoard() {
  const boardKey = useSharedStore(captureBoardStore, selectBoardKey)
  const { workspace } = useWorkspace()

  const board = boardKey ? getComponent(workspace, boardKey) : undefined
  const content = board ? renderBoard(board, { useOwnKey: true }) : null

  return (
    <Frame style={surfaceStyle} data-capture-board="true" aria-hidden="true">
      {content}
    </Frame>
  )
}
