import { COLORS } from "@lib/utils/colors"
import type { CSSProperties } from "react"
import type { NodeRect } from "../hooks/use-node-rects-store"

/** Canvas overlay stroke width (px). */
export const CANVAS_OVERLAY_BORDER_PX = 1

/**
 * Shared dashed-border styling for canvas selection and hover outlines.
 *
 * Used by both the tracked node-selection indicator and the board preview
 * outlines (theme variants, font specimens) so every highlight matches.
 */
export function getSelectionOutlineStyle(
  variant: "selection" | "hover" = "selection",
): Pick<
  CSSProperties,
  "borderStyle" | "borderColor" | "borderWidth" | "boxSizing"
> {
  return {
    borderStyle: "dashed",
    borderColor:
      variant === "hover" ? COLORS.charcoal[400] : COLORS.charcoal[700],
    borderWidth: CANVAS_OVERLAY_BORDER_PX,
    boxSizing: "border-box",
  }
}

export type OverlayBox = {
  top: number
  left: number
  width: number
  height: number
  boxSizing: "border-box"
  borderWidth: number
}

/** Outside box for selection and hover highlights. */
export function getSelectionMode(
  rect: NodeRect,
  borderPx: number = CANVAS_OVERLAY_BORDER_PX,
): OverlayBox {
  return {
    top: rect.top - borderPx - 2,
    left: rect.left - borderPx - 2,
    width: rect.width + borderPx * 6,
    height: rect.height + borderPx * 6,
    boxSizing: "border-box",
    borderWidth: borderPx,
  }
}

/** Outside box for wireframe mode outlines. */
export function getWireframeMode(
  rect: NodeRect,
  borderPx: number = CANVAS_OVERLAY_BORDER_PX,
): OverlayBox {
  return {
    top: rect.top - borderPx,
    left: rect.left - borderPx,
    width: rect.width + borderPx,
    height: rect.height + borderPx,
    boxSizing: "border-box",
    borderWidth: borderPx,
  }
}
