import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"

/** Whether the shadow paints outside the box or inset within it. */
export enum ShadowStyle {
  OUTER = "outer",
  INNER = "inner",
}

/** Stores one shadow placement choice from the enum. */
export interface ShadowStyleOptionValue {
  type: ValueType.OPTION
  value: ShadowStyle
}

/** Empty or one named shadow placement choice. */
export type ShadowStyleValue = EmptyValue | ShadowStyleOptionValue

/** Validates stored shadow style values. */
export const shadowStyleSchema: PropertySchema = {
  name: "shadowStyle",
  description:
    "Sets whether the shadow renders outside the element or inset within it.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(ShadowStyle) as string[]).includes(value),
  },
  presetOptions: () => Object.values(ShadowStyle),
}
