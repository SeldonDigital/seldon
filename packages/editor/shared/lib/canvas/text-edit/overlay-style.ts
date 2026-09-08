import type { TextEditFieldStyle } from "./field-style"

export const TEXT_EDIT_OVERLAY_Z = 20
export const TEXT_EDIT_OVERLAY_MIN = 24

export interface TextEditOverlayBox {
  top: number
  left: number
  width: number
  height: number
}

export function buildTextEditOverlayStyle(
  rect: TextEditOverlayBox,
  fieldStyle: TextEditFieldStyle,
): Record<string, string | number> {
  return {
    position: "absolute",
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${Math.max(rect.width, TEXT_EDIT_OVERLAY_MIN)}px`,
    height: `${Math.max(rect.height, TEXT_EDIT_OVERLAY_MIN)}px`,
    margin: "0",
    border: "none",
    outline: "none",
    overflow: "hidden",
    pointerEvents: "auto",
    zIndex: TEXT_EDIT_OVERLAY_Z,
    ...fieldStyle,
  }
}
