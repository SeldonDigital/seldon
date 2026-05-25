import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"

/** How the picture tiles inside this layer along each axis. */
export enum BackgroundRepeat {
  NO_REPEAT = "no-repeat",
  REPEAT = "repeat",
  REPEAT_X = "repeat-x",
  REPEAT_Y = "repeat-y",
}

/** Stores one repeat choice from the enum. */
export interface BackgroundRepeatOptionValue {
  type: ValueType.OPTION
  value: BackgroundRepeat
}

/** Empty or one named repeat choice. */
export type BackgroundRepeatValue = EmptyValue | BackgroundRepeatOptionValue

/** Validates repeat choice on one background paint layer. */
export const backgroundRepeatSchema: PropertySchema = {
  name: "backgroundRepeat",
  description: "Sets whether the picture tiles and on which axes.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(BackgroundRepeat) as string[]).includes(value),
  },
  presetOptions: () => Object.values(BackgroundRepeat),
}
