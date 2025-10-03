/**
 * Background repeat values for image tiling.
 */
export enum BackgroundRepeat {
  REPEAT = "repeat",
  NO_REPEAT = "no-repeat",
}

/**
 * Readable background repeat options for interface.
 */
export const BACKGROUND_REPEAT_OPTIONS: {
  name: string
  value: BackgroundRepeat
}[] = [
  { value: BackgroundRepeat.REPEAT, name: "Repeat" },
  { value: BackgroundRepeat.NO_REPEAT, name: "No repeat" },
]
