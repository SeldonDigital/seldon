/**
 * Corner style values for element borders.
 */
export enum Corner {
  ROUNDED = "rounded",
  SQUARED = "squared",
}

/**
 * Readable corner options for interface.
 */
export const CORNER_OPTIONS: {
  value: Corner
  name: string
}[] = [
  { value: Corner.ROUNDED, name: "Rounded" },
  { value: Corner.SQUARED, name: "Squared" },
]
