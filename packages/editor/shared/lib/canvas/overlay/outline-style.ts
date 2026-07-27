/** Default hover border color for canvas selection outlines. */
export const DEFAULT_HOVER_OUTLINE_COLOR =
  "color-mix(in srgb, var(--sdn-swatch-offBlack) 55%, var(--sdn-swatch-offWhite))"

/** Default selection border color for canvas selection outlines. */
export const DEFAULT_SELECTION_OUTLINE_COLOR = "var(--sdn-swatch-offBlack)"

export interface OutlineStyle {
  borderStyle: "dashed"
  borderColor: string
  borderWidth: number
  boxSizing: "border-box"
}

/**
 * Shared dashed-border styling for canvas selection and hover outlines. Returns
 * a plain style record so both the React and Vue shells can spread it onto their
 * own element style. Used by the selection and hover overlays plus the board
 * preview outlines so every highlight matches.
 */
export function getSelectionOutlineStyle(
  variant: "selection" | "hover" = "selection",
  borderColor?: string,
  borderWidth = 1,
): OutlineStyle {
  const defaultColor =
    variant === "hover" ? DEFAULT_HOVER_OUTLINE_COLOR : DEFAULT_SELECTION_OUTLINE_COLOR

  return {
    borderStyle: "dashed",
    borderColor: borderColor ?? defaultColor,
    borderWidth,
    boxSizing: "border-box",
  }
}
