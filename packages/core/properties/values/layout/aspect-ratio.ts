import type { ValueType } from "../../constants"
import type { PropertySchema } from "../../types/schema"
import type { EmptyValue } from "../shared/empty/empty"
import type { NumberValue } from "../shared/exact/number"
import type { InheritValue } from "../shared/inherit/inherit"

/** Width-to-height ratios the catalog exposes as fixed choices. */
export enum AspectRatio {
  SQUARE = "1 / 1",
  STANDARD = "4 / 3",
  CLASSIC = "3 / 2",
  WIDE = "16 / 9",
  ULTRAWIDE = "21 / 9",
  PORTRAIT = "3 / 4",
  TALL = "2 / 3",
  STORY = "9 / 16",
}

/** Records which ratio keyword is selected. */
export interface AspectRatioOptionValue {
  type: ValueType.OPTION
  value: AspectRatio
}

/** Empty, inherit, a catalog ratio keyword, or a custom ratio stored as a number. */
export type AspectRatioValue = EmptyValue | InheritValue | AspectRatioOptionValue | NumberValue

/** Defines labels, allowed shapes, checks, and preset choices for `aspectRatio`. */
export const aspectRatioSchema: PropertySchema = {
  name: "aspectRatio",
  description: "Width-to-height ratio the box keeps as it resizes",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => {
      const raw =
        typeof value === "number"
          ? value
          : typeof value === "object" &&
              value !== null &&
              "value" in value &&
              typeof (value as { value: unknown }).value === "number"
            ? (value as { value: number }).value
            : NaN

      return Number.isFinite(raw) && raw > 0
    },
    option: (value: unknown) =>
      typeof value === "string" && (Object.values(AspectRatio) as string[]).includes(value),
  },
  presetOptions: () => Object.values(AspectRatio),
}
