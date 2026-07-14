import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"

/** The outline a radial gradient spreads along. */
export enum GradientShape {
  CIRCLE = "circle",
  ELLIPSE = "ellipse",
}

/** Stores one radial gradient shape choice from the enum. */
export interface GradientShapeOptionValue {
  type: ValueType.OPTION
  value: GradientShape
}

/** Empty or one named radial gradient shape. */
export type GradientShapeValue = EmptyValue | GradientShapeOptionValue

/** Validates stored radial gradient shape values. */
export const gradientShapeSchema: PropertySchema = {
  name: "gradientShape",
  description: "Sets whether a radial gradient spreads as a circle or ellipse.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(GradientShape) as string[]).includes(value),
  },
  presetOptions: () => Object.values(GradientShape),
}
