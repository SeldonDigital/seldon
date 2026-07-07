import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"

/** How far a radial gradient reaches relative to the layer box. */
export enum GradientSize {
  CLOSEST_SIDE = "closest-side",
  CLOSEST_CORNER = "closest-corner",
  FARTHEST_SIDE = "farthest-side",
  FARTHEST_CORNER = "farthest-corner",
}

/** Stores one radial gradient size keyword from the enum. */
export interface GradientSizeOptionValue {
  type: ValueType.OPTION
  value: GradientSize
}

/** Empty or one named radial gradient size keyword. */
export type GradientSizeValue = EmptyValue | GradientSizeOptionValue

/** Validates stored radial gradient size values. */
export const gradientSizeSchema: PropertySchema = {
  name: "gradientSize",
  description: "Sets how far a radial gradient reaches from its center.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(GradientSize) as string[]).includes(value),
  },
  presetOptions: () => Object.values(GradientSize),
}
