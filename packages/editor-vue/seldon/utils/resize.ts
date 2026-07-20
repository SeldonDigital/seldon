/*****
 *
 * This code was generated using Seldon (https://github.com/SeldonDigital/seldon)
 *
 * License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it, in whole or in part,
 * for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly)
 * any machine learning or artificial intelligence system without written permission.
 *
 *****/
import type { CSSProperties } from "vue"

/** The eight edges and corners a resizable surface can expose. */
export type ResizeSide =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"

/** All resize sides, edges first then corners. */
export const RESIZE_SIDES: readonly ResizeSide[] = [
  "top",
  "right",
  "bottom",
  "left",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
]

/** Position and size of a surface, in pixels. */
export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/** Minimal pointer shape shared by DOM and framework pointer events. */
interface PointerLike {
  clientX: number
  clientY: number
  preventDefault(): void
}

const HANDLE_THICKNESS = "0.5rem"

/**
 * Returns the absolute-position style for a single resize handle. Edge handles
 * are inset by the handle thickness so the corners stay free for the corner
 * handles. The host element must be positioned (relative, absolute, or fixed)
 * for these handles to anchor to it.
 */
export function getResizeHandleStyle(
  side: ResizeSide,
  thickness: string = HANDLE_THICKNESS,
): CSSProperties {
  const style: CSSProperties = { position: "absolute", touchAction: "none" }

  if (side.includes("bottom")) {
    style.bottom = 0
    style.height = thickness
  }
  if (side.includes("top")) {
    style.top = 0
    style.height = thickness
  }
  if (side.includes("left")) {
    style.left = 0
    style.width = thickness
  }
  if (side.includes("right")) {
    style.right = 0
    style.width = thickness
  }

  switch (side) {
    case "top":
    case "bottom":
      style.left = thickness
      style.right = thickness
      style.cursor = "ns-resize"
      break
    case "left":
    case "right":
      style.top = thickness
      style.bottom = thickness
      style.cursor = "ew-resize"
      break
    case "top-left":
    case "bottom-right":
      style.cursor = "nwse-resize"
      break
    case "top-right":
    case "bottom-left":
      style.cursor = "nesw-resize"
      break
  }

  return style
}

/**
 * Computes the next rect for a resize drag. Width and height are clamped to the
 * given minimums; when a left or top edge is dragged the opposite edge stays
 * fixed, so clamping shifts x or y instead of overshooting the minimum.
 */
export function computeResizedRect(args: {
  side: ResizeSide
  startRect: Rect
  offsetX: number
  offsetY: number
  minWidth?: number
  minHeight?: number
}): Rect {
  const { side, startRect, offsetX, offsetY } = args
  const minWidth = args.minWidth ?? 0
  const minHeight = args.minHeight ?? 0

  let { x, y, width, height } = startRect

  if (side.includes("right")) {
    width = Math.max(minWidth, startRect.width + offsetX)
  }
  if (side.includes("left")) {
    width = Math.max(minWidth, startRect.width - offsetX)
    x = startRect.x + startRect.width - width
  }
  if (side.includes("bottom")) {
    height = Math.max(minHeight, startRect.height + offsetY)
  }
  if (side.includes("top")) {
    height = Math.max(minHeight, startRect.height - offsetY)
    y = startRect.y + startRect.height - height
  }

  return { x, y, width, height }
}

/**
 * Wires a resize handle with native pointer events, so no animation library is
 * required. Attach the returned onPointerDown to a handle element styled by
 * {@link getResizeHandleStyle}. On each pointer move the handle reads the start
 * rect from getRect, computes the next rect, and hands it to onResize; the host
 * stores the size however it likes.
 */
export function createResizeHandle(args: {
  side: ResizeSide
  getRect: () => Rect
  onResize: (rect: Rect) => void
  minWidth?: number
  minHeight?: number
  onStart?: () => void
  onEnd?: () => void
}): { onPointerDown: (event: PointerLike) => void } {
  function onPointerDown(event: PointerLike) {
    event.preventDefault()
    const startRect = args.getRect()
    const originX = event.clientX
    const originY = event.clientY
    args.onStart?.()

    function handleMove(moveEvent: PointerEvent) {
      const next = computeResizedRect({
        side: args.side,
        startRect,
        offsetX: moveEvent.clientX - originX,
        offsetY: moveEvent.clientY - originY,
        minWidth: args.minWidth,
        minHeight: args.minHeight,
      })
      args.onResize(next)
    }

    function handleUp() {
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerup", handleUp)
      args.onEnd?.()
    }

    window.addEventListener("pointermove", handleMove)
    window.addEventListener("pointerup", handleUp)
  }

  return { onPointerDown }
}
