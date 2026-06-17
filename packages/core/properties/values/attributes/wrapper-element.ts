import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { StringValue } from "../shared/exact/string"
import { InheritValue } from "../shared/inherit/inherit"

/**
 * Block and table-structure host tags for catalog Frame nodes.
 * `HEADER` is the page/section landmark `<header>`, not table `<thead>`.
 */
export enum WrapperElement {
  DIV = "div",
  SECTION = "section",
  ARTICLE = "article",
  ASIDE = "aside",
  MAIN = "main",
  NAV = "nav",
  HEADER = "header",
  FOOTER = "footer",
  UL = "ul",
  OL = "ol",
  LI = "li",
  FORM = "form",
  FIELDSET = "fieldset",
  FIGURE = "figure",
  MENU = "menu",
  BLOCKQUOTE = "blockquote",
  TABLE = "table",
  THEAD = "thead",
  TBODY = "tbody",
  TFOOT = "tfoot",
  TR = "tr",
}

/** Records which wrapper tag keyword is selected. */
export interface WrapperElementOptionValue {
  type: ValueType.OPTION
  value: WrapperElement
}

/** Empty, inherit, a catalog tag keyword, or a custom tag string (`exact`). */
export type WrapperElementValue =
  | EmptyValue
  | InheritValue
  | WrapperElementOptionValue
  | StringValue

/** Defines labels, allowed shapes, checks, and preset choices for `wrapperElement`. */
export const wrapperElementSchema: PropertySchema = {
  name: "wrapperElement",
  description:
    "HTML wrapper element for Frame hosts (div, section, thead, tr, etc.)",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string" && value.length > 0,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(WrapperElement) as string[]).includes(value),
  },
  presetOptions: () => Object.values(WrapperElement),
}
