/**
 * Text decoration values for text styling.
 */
export enum TextDecoration {
  NONE = "none",
  UNDERLINE = "underline",
  OVERLINE = "overline",
  LINE_THROUGH = "line-through",
}

/**
 * Readable text decoration options for interface.
 */
export const TEXT_DECORATION_OPTIONS: {
  name: string
  value: TextDecoration
}[] = [
  { name: "None", value: TextDecoration.NONE },
  { name: "Underline", value: TextDecoration.UNDERLINE },
  { name: "Line-through", value: TextDecoration.LINE_THROUGH },
  { name: "Overline", value: TextDecoration.OVERLINE },
]
