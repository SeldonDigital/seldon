import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { AlignOptionValue } from "../shared/option/align"

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

/** Unset or one named anchor from Align. */
export type AlignValue = EmptyValue | AlignOptionValue

export const alignSchema: PropertySchema = {
  name: "align",
  description: "Anchors content inside the container using named positions.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(Align) as string[]).includes(value),
  },
  presetOptions: () => Object.values(Align),
}
