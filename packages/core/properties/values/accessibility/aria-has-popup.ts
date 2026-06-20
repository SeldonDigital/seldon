import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** Keyword describing the kind of popup a control triggers. */
export enum AriaHasPopup {
  FALSE = "false",
  TRUE = "true",
  MENU = "menu",
  LISTBOX = "listbox",
  TREE = "tree",
  GRID = "grid",
  DIALOG = "dialog",
}

/** Records which `aria-haspopup` keyword is selected. */
export interface AriaHasPopupOptionValue {
  type: ValueType.OPTION
  value: AriaHasPopup
}

/** Empty, or an `aria-haspopup` keyword. */
export type AriaHasPopupValue = EmptyValue | AriaHasPopupOptionValue

/** Defines labels, allowed shapes, checks, and preset choices for `ariaHasPopup`. */
export const ariaHasPopupSchema: PropertySchema = {
  name: "ariaHasPopup",
  description: "Kind of popup a control triggers",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string" && value.length > 0,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(AriaHasPopup) as string[]).includes(value),
  },
  presetOptions: () => Object.values(AriaHasPopup),
}
