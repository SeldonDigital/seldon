import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { StringValue } from "../shared/exact/string"
import { InheritValue } from "../shared/inherit/inherit"

/** Whether a sized element letterboxes inside its box or stretches to fill it. */
export enum Resize {
  FIT = "fit",
  FILL = "fill",
}

/** Picks fit or fill from the Resize enum. */
export interface ResizeOptionValue {
  type: ValueType.OPTION
  value: Resize
}

/** Unset, inherited, a free-form exact string, or a fit/fill option. */
export type ResizeValue =
  | EmptyValue
  | InheritValue
  | StringValue
  | ResizeOptionValue

export const resizeSchema: PropertySchema = {
  name: "resize",
  description: "Controls whether content fits inside its frame or expands to fill it.",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    option: (value: any) => Object.values(Resize).includes(value),
  },
  presetOptions: () => Object.values(Resize),
}
