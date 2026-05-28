import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { StringValue } from "../shared/exact/string"
import { InheritValue } from "../shared/inherit/inherit"

/** Named device size bands for breakpoint-style layout. */
export enum ScreenSize {
  DESKTOP = "desktop",
  LAPTOP = "laptop",
  TABLET = "tablet",
  MOBILE = "mobile",
  WATCH = "watch",
  TELEVISION = "television",
}

/** Picks one device size band from {@link ScreenSize}. */
export interface ScreenSizeOptionValue {
  type: ValueType.OPTION
  value: ScreenSize
}

/** Unset, inherited, a free-form exact string, or a named device band. */
export type ScreenSizeValue =
  | EmptyValue
  | InheritValue
  | StringValue
  | ScreenSizeOptionValue

export const screenSizeSchema: PropertySchema = {
  name: "screenSize",
  description: "Selects a named device size band for layout and preview.",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    option: (value: any) => Object.values(ScreenSize).includes(value),
  },
  presetOptions: () => Object.values(ScreenSize),
}
