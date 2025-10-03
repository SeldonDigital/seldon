/**
 * Text direction values for element layout.
 */
export enum Direction {
  LTR = "ltr",
  RTL = "rtl",
}

/**
 * Readable direction options for interface.
 */
export const DIRECTION_OPTIONS: {
  name: string
  value: Direction | "none"
}[] = [
  { name: "LTR", value: Direction.LTR },
  { name: "RTL", value: Direction.RTL },
]
