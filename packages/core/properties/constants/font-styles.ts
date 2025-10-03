/**
 * Font style values for text styling.
 */
export enum FontStyle {
  NORMAL = "normal",
  ITALIC = "italic",
}

/**
 * Readable font style options for interface.
 */
export const FONT_STYLE_OPTIONS: { value: FontStyle; name: string }[] = [
  { value: FontStyle.NORMAL, name: "Normal" },
  { value: FontStyle.ITALIC, name: "Italic" },
]
