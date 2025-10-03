/**
 * Text alignment values for text positioning.
 */
export enum TextAlignment {
  AUTO = "auto",
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
  JUSTIFY = "justify",
}

/**
 * Readable text alignment options for interface.
 */
export const TEXT_ALIGN_OPTIONS: {
  value: TextAlignment
  name: string
}[] = [
  { value: TextAlignment.AUTO, name: "Auto" },
  { value: TextAlignment.LEFT, name: "Left" },
  {
    value: TextAlignment.CENTER,
    name: "Center",
  },
  { value: TextAlignment.RIGHT, name: "Right" },
  {
    value: TextAlignment.JUSTIFY,
    name: "Justify",
  },
]
