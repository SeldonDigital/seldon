import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"

/** Whether the shadow paints outside the box or inset within it. */
export enum ShadowType {
  OUTER = "outer",
  INNER = "inner",
}

/** Stores one shadow placement choice from the enum. */
export interface ShadowTypeOptionValue {
  type: ValueType.OPTION
  value: ShadowType
}

/** Empty or one named shadow placement choice. */
export type ShadowTypeValue = EmptyValue | ShadowTypeOptionValue

/** Validates stored shadow type values. */
export const shadowTypeSchema: PropertySchema = {
  name: "shadowType",
  description:
    "Sets whether the shadow renders outside the element or inset within it.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(ShadowType) as string[]).includes(value),
  },
  presetOptions: () => Object.values(ShadowType),
}
