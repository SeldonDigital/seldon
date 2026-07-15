import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
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

/** Unset, inherited, or a named device band. */
export type ScreenSizeValue = EmptyValue | InheritValue | ScreenSizeOptionValue

export const screenSizeSchema: PropertySchema = {
  name: "screenSize",
  description: "Selects a named device size band for layout and preview.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(ScreenSize) as string[]).includes(value),
  },
  presetOptions: () => Object.values(ScreenSize),
}
