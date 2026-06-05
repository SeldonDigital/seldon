import { Placement } from "@lib/types"

interface Position {
  top?: number
  left: number
  right: number
  height: number
  bottom?: number
}

/**
 * Calculates the position for a drop indicator line.
 * @param placement - "before", "after", or "inside" placement
 * @param indentation - Indentation level (0-based)
 * @returns Position object with top/bottom, left, right, and height
 */
export function calculateIndicatorPosition(
  placement: Placement,
  indentation: number,
): Position {
  // Calculate left position: 0.5rem padding + 1rem per level + 0.25rem indicator width
  const left = (0.5 + 1 * indentation + 0.25) * 16

  const position: Position = {
    left,
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
