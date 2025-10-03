/**
 * Scrollbar style values for scrollbar appearance.
 */
export enum ScrollbarStyle {
  DEFAULT = "default",
  HIDDEN = "hidden",
  OVERLAY = "overlay",
  THIN = "thin",
}

/**
 * Readable scrollbar style options for interface.
 */
export const SCROLLBAR_STYLE_OPTIONS: {
  name: string
  value: ScrollbarStyle
}[] = [
  { name: "Default", value: ScrollbarStyle.DEFAULT },
  { name: "Hidden", value: ScrollbarStyle.HIDDEN },
  { name: "Overlay", value: ScrollbarStyle.OVERLAY },
  { name: "Thin", value: ScrollbarStyle.THIN },
]
