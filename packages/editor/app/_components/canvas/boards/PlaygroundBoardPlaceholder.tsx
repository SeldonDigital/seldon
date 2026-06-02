"use client"

import { Board } from "@seldon/core"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { Label } from "@components/seldon/primitives/Label"

export type PlaygroundBoardPlaceholderProps = {
  board: Board
}

/**
 * Playground board placeholder that displays a "No Content" message.
 * This is a stub until playground rendering is implemented.
 */
export function PlaygroundBoardPlaceholder({
  board,
}: PlaygroundBoardPlaceholderProps) {
  return (
    <div
      data-board-id={getComponentKey(board)}
      className={`board-${getComponentKey(board)}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
        width: "100%",
      }}
    >
      <Label className="seldon-instance child-label-9J3xaw">No Content</Label>
    </div>
  )
}
