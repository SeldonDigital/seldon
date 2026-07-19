import { COLORS } from "@seldon/editor/lib/helpers/colors"
import type { CSSProperties } from "react"
import type { NodeRect } from "../hooks/use-node-rects-store"

/** Canvas overlay stroke width (px). */
export const CANVAS_OVERLAY_BORDER_PX = 1

/** Default hover border color for canvas selection outlines. */
export const DEFAULT_HOVER_OUTLINE_COLOR = COLORS.charcoal[400]

/** Default selection border color for canvas selection outlines. */
export const DEFAULT_SELECTION_OUTLINE_COLOR = COLORS.charcoal[700]

/**
 * Shared dashed-border styling for canvas selection and hover outlines.
 *
 * Used by both the tracked node-selection indicator and the board preview
 * outlines (theme variants, font specimens) so every highlight matches.
 */
export function getSelectionOutlineStyle(
  variant: "selection" | "hover" = "selection",
  borderColor?: string,
): Pick<
  CSSProperties,
  "borderStyle" | "borderColor" | "borderWidth" | "boxSizing"
> {
  const defaultColor =
    variant === "hover"
      ? DEFAULT_HOVER_OUTLINE_COLOR
      : DEFAULT_SELECTION_OUTLINE_COLOR
  return {
    borderStyle: "dashed",
    borderColor: borderColor ?? defaultColor,
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
