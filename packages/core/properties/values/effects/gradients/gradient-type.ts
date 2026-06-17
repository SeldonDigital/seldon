import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"

/** How color blends between stops along a line or from a center. */
export enum GradientType {
  LINEAR = "linear",
  RADIAL = "radial",
}

/** Stores one gradient type choice from the enum. */
export interface GradientTypeOptionValue {
  type: ValueType.OPTION
  value: GradientType
}

/** Empty or one named gradient spread shape. */
export type GradientTypeValue = EmptyValue | GradientTypeOptionValue

/** Validates stored gradient type values. */
export const gradientTypeSchema: PropertySchema = {
  name: "gradientType",
  description:
    "Sets whether the fill runs along a line or spreads out from a center.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(GradientType) as string[]).includes(value),
  },
  presetOptions: () => Object.values(GradientType),
}
