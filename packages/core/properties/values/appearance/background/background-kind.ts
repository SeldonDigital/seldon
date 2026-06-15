import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { InheritValue } from "../../shared/inherit/inherit"

/** What a single background layer paints. */
export enum BackgroundKind {
  NONE = "none",
  COLOR = "color",
  IMAGE = "image",
}

export const BACKGROUND_KIND_VALUES = Object.values(
  BackgroundKind,
) as BackgroundKind[]

/** Stores one kind choice from the enum. */
export interface BackgroundKindOptionValue {
  type: ValueType.OPTION
  value: BackgroundKind
}

/** Empty, inherited, or one named kind choice. */
export type BackgroundKindValue =
  | EmptyValue
  | InheritValue
  | BackgroundKindOptionValue

/** Validates the kind discriminator on one background paint layer. */
export const backgroundKindSchema: PropertySchema = {
  name: "backgroundKind",
  description:
    "Selects what this background layer paints: nothing, a solid color, or an image.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (BACKGROUND_KIND_VALUES as string[]).includes(value),
  },
  presetOptions: () => BACKGROUND_KIND_VALUES,
}
