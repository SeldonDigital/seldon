/**
 * Gradient type values for background styling.
 */
export enum GradientType {
  LINEAR = "linear",
  RADIAL = "radial",
}

/**
 * Readable gradient type options for interface.
 */
export const GRADIENT_TYPE_OPTIONS: { name: string; value: GradientType }[] = [
  { name: "Linear", value: GradientType.LINEAR },
  { name: "Radial", value: GradientType.RADIAL },
]
