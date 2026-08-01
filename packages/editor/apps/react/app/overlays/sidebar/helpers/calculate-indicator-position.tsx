import type { Placement } from "@seldon/editor/lib/types"

interface Position {
  left: number
  right: number
  height: number
  top?: number
  bottom?: number
}

/**
 * Calculates the position for a drop indicator line. The line spans the full
 * width of its row. Each nesting level already indents the row through the
 * `IndentationLevel` padding, so an indentation offset here would apply it twice
 * and leave the line too narrow to see under the drag preview.
 *
 * @param placement - "before", "after", or "inside" placement
 * @returns Position object with top/bottom, left, right, and height
 */
export function calculateIndicatorPosition(placement: Placement): Position {
  const position: Position = {
    left: 0,
    right: 0,
    height: 1,
  }

  if (placement === "before") {
    position.top = -0.5
  } else if (placement === "after") {
    position.bottom = -0.5
  } else if (placement === "inside") {
    // Always show indicator below parent row (like "after")
    // This is consistent because insertion always happens at index 0 (first child)
    position.bottom = -0.5
  }

  return position
}
