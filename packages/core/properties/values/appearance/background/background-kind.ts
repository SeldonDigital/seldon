import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { InheritValue } from "../../shared/inherit/inherit"

/** What a single background layer paints. */
export enum BackgroundKind {
  NONE = "none",
  COLOR = "color",
  IMAGE = "image",
  LINEAR_GRADIENT = "linearGradient",
  RADIAL_GRADIENT = "radialGradient",
  CONIC_GRADIENT = "conicGradient",
}

/** The background kinds that paint a gradient. */
export const GRADIENT_BACKGROUND_KINDS = [
  BackgroundKind.LINEAR_GRADIENT,
  BackgroundKind.RADIAL_GRADIENT,
  BackgroundKind.CONIC_GRADIENT,
] as const

/** True when a kind paints any gradient. */
export function isGradientBackgroundKind(
  kind: unknown,
): kind is (typeof GRADIENT_BACKGROUND_KINDS)[number] {
  return (GRADIENT_BACKGROUND_KINDS as readonly unknown[]).includes(kind)
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
    "Selects what this background layer paints: nothing, a solid color, an image, or a gradient.",
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
