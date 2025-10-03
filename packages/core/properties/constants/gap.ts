/**
 * Gap spacing values for element layout.
 */
export enum Gap {
  EVENLY_SPACED = "evenly-spaced",
}

/**
 * Readable gap options for interface.
 */
export const GAP_OPTIONS: {
  value: Gap
  name: string
}[] = [{ value: Gap.EVENLY_SPACED, name: "Evenly Spaced" }]
