/**
 * Resize behavior values for element sizing.
 */
export enum Resize {
  FIT = "fit",
  FILL = "fill",
}

/**
 * Readable resize options for interface.
 */
export const RESIZE_OPTIONS: { name: string; value: Resize }[] = [
  { name: "Fill", value: Resize.FILL },
  { name: "Fit", value: Resize.FIT },
]
