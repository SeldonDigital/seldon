import { getRenderedScale } from "../dom/canvas-elements"

/** How much of the node keeps showing in the place it was picked up from. */
const SOURCE_OPACITY = "0.4"

/** Above the rest of the board, below the overlays painted on top of the canvas. */
const LIFT_Z_INDEX = "1"

/** Attributes the canvas reads to find a node, which only the original may carry. */
const IDENTIFYING_ATTRIBUTES = ["data-canvas-node-id", "data-board-id", "id"]

export interface CanvasNodeLift {
  move: (point: { x: number; y: number }) => void
  release: () => void
}

/**
 * Picks a canvas node up, the way the objects sidebar lifts a row: a copy of it
 * follows the cursor from the exact point it was grabbed, and the node stays where
 * it is, dimmed to show what is being moved.
 *
 * The copy is a clone held by the board root, so it inherits the board's theme,
 * font, and zoom and needs no styling of its own, and no container along the way
 * can clip it as it travels. Taken out of flow it moves nothing around it, and
 * stripped of the attributes the canvas reads it stays invisible to hit tests,
 * tracking, and the drop resolver.
 *
 * The clone is placed against the box that positions it, and the cursor's screen
 * distance is divided by the zoom, so both sit in board pixels.
 *
 * Returns nothing when the node is on no board, which happens only if it left the
 * DOM between the press and the drag.
 */
export function liftCanvasNode(
  element: HTMLElement,
  grabPoint: { x: number; y: number },
): CanvasNodeLift | null {
  const board = element.closest<HTMLElement>("[data-board-id]")

  if (!board) return null

  const rect = element.getBoundingClientRect()
  // Read off the board rather than the node, so the zoom is all this measures and
  // a transform the node carries itself does not enter into it.
  const scale = getRenderedScale(board)
  const sourceOpacity = element.style.opacity
  const clone = element.cloneNode(true) as HTMLElement

  for (const attribute of IDENTIFYING_ATTRIBUTES) {
    clone.removeAttribute(attribute)
    clone.querySelectorAll(`[${attribute}]`).forEach((node) => node.removeAttribute(attribute))
  }

  clone.style.position = "absolute"
  clone.style.boxSizing = "border-box"
  clone.style.width = `${element.offsetWidth}px`
  clone.style.height = `${element.offsetHeight}px`
  clone.style.margin = "0"
  clone.style.pointerEvents = "none"
  clone.style.zIndex = LIFT_Z_INDEX

  board.appendChild(clone)

  // Read after appending, because the box an absolute element is placed against is
  // the nearest positioned ancestor, which the board root itself may not be.
  const frame = (clone.offsetParent as HTMLElement | null) ?? board
  const frameRect = frame.getBoundingClientRect()

  clone.style.left = `${(rect.left - frameRect.left) / scale - frame.clientLeft}px`
  clone.style.top = `${(rect.top - frameRect.top) / scale - frame.clientTop}px`
  element.style.opacity = SOURCE_OPACITY

  return {
    move: (point) => {
      const x = (point.x - grabPoint.x) / scale
      const y = (point.y - grabPoint.y) / scale

      clone.style.transform = `translate(${x}px, ${y}px)`
    },
    release: () => {
      clone.remove()
      element.style.opacity = sourceOpacity
    },
  }
}
