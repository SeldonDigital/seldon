import {
  type NodeRect,
  getSelectionMode,
  getWireframeMode,
} from "@seldon/editor/lib/canvas/overlay/geometry"
import { getSelectionOutlineStyle } from "@seldon/editor/lib/canvas/overlay/outline-style"
import type { CSSProperties } from "vue"

/** Absolute-positioned outline style for a selection or hover box. */
export function outlineBoxStyle(
  rect: NodeRect,
  variant: "selection" | "hover",
  wireframe: boolean,
  borderColor?: string,
): CSSProperties {
  const box = wireframe ? getWireframeMode(rect) : getSelectionMode(rect)
  const outline = getSelectionOutlineStyle(variant, borderColor)
  return {
    position: "absolute",
    pointerEvents: "none",
    top: `${box.top}px`,
    left: `${box.left}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    borderStyle: outline.borderStyle,
    borderColor: outline.borderColor,
    borderWidth: `${box.borderWidth}px`,
    boxSizing: outline.boxSizing,
    zIndex: 1,
  }
}
