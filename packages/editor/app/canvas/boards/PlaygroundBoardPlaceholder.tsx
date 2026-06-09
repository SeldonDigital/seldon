"use client"

import { Board } from "@seldon/core"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { Label } from "@seldon/components/chrome/primitives/Label"
import { PlaceholderBox } from "@seldon/components/custom-components"

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
  const boardKey = getComponentKey(board)
  return (
    <PlaceholderBox boardId={boardKey} className={`board-${boardKey}`}>
      <Label className="seldon-instance child-label-9J3xaw">No Content</Label>
    </PlaceholderBox>
  )
}
