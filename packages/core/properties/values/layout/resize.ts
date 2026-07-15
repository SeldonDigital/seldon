import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
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

/** Unset, inherited, or a fit/fill option. */
export type ResizeValue = EmptyValue | InheritValue | ResizeOptionValue

export const resizeSchema: PropertySchema = {
  name: "resize",
  description:
    "Controls whether content fits inside its frame or expands to fill it.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(Resize) as string[]).includes(value),
  },
  presetOptions: () => Object.values(Resize),
}
