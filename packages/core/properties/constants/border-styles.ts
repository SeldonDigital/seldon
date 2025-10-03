/**
 * Border style values for element borders.
 */
export enum BorderStyle {
  NONE = "none",
  SOLID = "solid",
  DASHED = "dashed",
  DOTTED = "dotted",
  DOUBLE = "double",
  GROOVE = "groove",
  RIDGE = "ridge",
  INSET = "inset",
  OUTSET = "outset",
  HIDDEN = "hidden",
}

/**
 * Readable border style options for interface.
 */
export const BORDER_STYLE_OPTIONS: {
  value: BorderStyle
  name: string
}[] = [
  { value: BorderStyle.NONE, name: "None" },
  { value: BorderStyle.SOLID, name: "Solid" },
  { value: BorderStyle.DOTTED, name: "Dotted" },
  { value: BorderStyle.DASHED, name: "Dashed" },
  { value: BorderStyle.DOUBLE, name: "Double" },
  { value: BorderStyle.GROOVE, name: "Groove" },
  { value: BorderStyle.RIDGE, name: "Ridge" },
  { value: BorderStyle.INSET, name: "Inset" },
  { value: BorderStyle.OUTSET, name: "Outset" },
  { value: BorderStyle.HIDDEN, name: "Hidden" },
]
