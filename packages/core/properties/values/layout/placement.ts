import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { InheritValue } from "../shared/inherit/inherit"

/** How the element sits in flow or layers relative to siblings and the viewport. */
export enum Placement {
  STATIC = "static",
  RELATIVE = "relative",
  ABSOLUTE = "absolute",
  FIXED = "fixed",
  STICKY = "sticky",
}

/** Picks one placement mode from the Placement enum. */
export interface PlacementOptionValue {
  type: ValueType.OPTION
  value: Placement
}

/** Unset, inherited from the parent, or one named placement mode. */
export type PlacementValue = EmptyValue | InheritValue | PlacementOptionValue

export const placementSchema: PropertySchema = {
  name: "placement",
  description:
    "Sets static, relative, absolute, fixed, or sticky positioning for the element.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) => Object.values(Placement).includes(value as Placement),
  },
  presetOptions: () => Object.values(Placement),
}
