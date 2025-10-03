/**
 * Orientation values for layout direction.
 */
export enum Orientation {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

/**
 * Readable orientation options for interface.
 */
export const ORIENTATION_OPTIONS: { name: string; value: Orientation }[] = [
  { name: "Vertical", value: Orientation.VERTICAL },
  { name: "Horizontal", value: Orientation.HORIZONTAL },
]
