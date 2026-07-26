import {
  type NodeRect,
  getSelectionMode,
  getWireframeMode,
} from "@seldon/editor/lib/canvas/overlay/geometry"
import { getSelectionOutlineStyle } from "@seldon/editor/lib/canvas/overlay/outline-style"
import type { CSSProperties } from "react"

/** Absolute-positioned outline style for a selection or hover box. */
export function outlineBoxStyle(
  rect: NodeRect,
  variant: "selection" | "hover",
  wireframe: boolean,
  borderColor?: string,
): CSSProperties {
  // In wireframe mode the outline hugs the node border to align with the
  // surrounding wireframe boxes; otherwise it sits padded off the node.
  const box = wireframe ? getWireframeMode(rect) : getSelectionMode(rect)
  return {
    position: "absolute",
    pointerEvents: "none",
    top: `${box.top}px`,
    left: `${box.left}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    ...getSelectionOutlineStyle(variant, borderColor),
    borderWidth: box.borderWidth,
    zIndex: 1,
  }
}
