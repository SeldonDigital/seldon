/**
 * Border width values for element borders.
 */
export enum BorderWidth {
  HAIRLINE = "hairline",
}

/**
 * Readable border width options for interface.
 */
export const BORDER_WIDTH_OPTIONS: {
  value: BorderWidth
  name: string
}[] = [{ value: BorderWidth.HAIRLINE, name: "Hairline" }]
