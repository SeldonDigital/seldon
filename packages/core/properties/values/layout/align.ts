import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { AlignExactValue, AlignOptionValue } from "../shared/option/align"

/** Preset anchors for where content sits inside its container. */
export enum Align {
  AUTO = "auto",
  TOP_LEFT = "top-left",
  TOP_CENTER = "top-center",
  TOP_RIGHT = "top-right",
  CENTER_LEFT = "left",
  CENTER = "center",
  CENTER_RIGHT = "right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_CENTER = "bottom-center",
  BOTTOM_RIGHT = "bottom-right",
}

/** Unset, a freeform exact value, or one named anchor from Align. */
export type AlignValue = EmptyValue | AlignExactValue | AlignOptionValue

export const alignSchema: PropertySchema = {
  name: "align",
  description: "Anchors content inside the container using named positions.",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string" && value.length > 0,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(Align) as string[]).includes(value),
  },
  presetOptions: () => Object.values(Align),
}
