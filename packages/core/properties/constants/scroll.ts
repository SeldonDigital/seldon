/**
 * Scroll behavior values for element overflow.
 */
export enum Scroll {
  NONE = "none",
  BOTH = "both",
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

/**
 * Readable scroll options for interface.
 */
export const SCROLL_OPTIONS: {
  name: string
  value: Scroll
}[] = [
  { name: "None", value: Scroll.NONE },
  { name: "Both", value: Scroll.BOTH },
  { name: "Vertical", value: Scroll.VERTICAL },
  { name: "Horizontal", value: Scroll.HORIZONTAL },
]
