/**
 * Color values for element styling.
 */
export enum Color {
  TRANSPARENT = "transparent",
}

/**
 * Readable color options for interface.
 */
export const COLOR_OPTIONS: {
  value: string
  name: string
}[] = [
  { value: "none", name: "None" },
  { value: Color.TRANSPARENT, name: "Transparent" },
]
