import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** How scrollbars look and how much space they take. */
export enum ScrollbarStyle {
  DEFAULT = "default",
  HIDDEN = "hidden",
  OVERLAY = "overlay",
  THIN = "thin",
}

/** Stores one scrollbar style choice from the enum. */
export interface ScrollbarStyleOptionValue {
  type: ValueType.OPTION
  value: ScrollbarStyle
}

/** Empty or one named scrollbar style choice. */
export type ScrollbarStyleValue = EmptyValue | ScrollbarStyleOptionValue

/** Validates stored scrollbar style values. */
export const scrollbarStyleSchema: PropertySchema = {
  name: "scrollbarStyle",
  description:
    "Sets how scrollbars look for this element using the catalog choices.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(ScrollbarStyle) as string[]).includes(value),
  },
  presetOptions: () => Object.values(ScrollbarStyle),
}
