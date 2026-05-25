import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { StringValue } from "../shared/exact/string"
import { EmptyValue } from "../shared/empty/empty"
import { InheritValue } from "../shared/inherit/inherit"

/** HTML tag names the catalog exposes as fixed choices. */
export enum HtmlElement {
  A = "a",
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
  P = "p",
  SPAN = "span",
  LABEL = "label",
  DIV = "div",
  SECTION = "section",
  ARTICLE = "article",
  HEADER = "header",
  FOOTER = "footer",
  MAIN = "main",
  NAV = "nav",
  ASIDE = "aside",
  FIGURE = "figure",
  FIGCAPTION = "figcaption",
  FORM = "form",
  FIELDSET = "fieldset",
  MENU = "menu",
  OPTION = "option",
  OPTGROUP = "optgroup",
  LI = "li",
  OL = "ol",
  UL = "ul",
}

/** Records which HTML tag keyword is selected. */
export interface HtmlElementOptionValue {
  type: ValueType.OPTION
  value: HtmlElement
}

/** Empty, inherit, a catalog tag keyword, or a custom tag string (`exact`). */
export type HtmlElementValue =
  | EmptyValue
  | InheritValue
  | HtmlElementOptionValue
  | StringValue

/** Defines labels, allowed shapes, checks, and preset choices for `htmlElement`. */
export const htmlElementSchema: PropertySchema = {
  name: "htmlElement",
  description: "HTML element type (div, span, button, etc.)",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) =>
      typeof value === "string" && value.length > 0,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(HtmlElement) as string[]).includes(value),
  },
  presetOptions: () => Object.values(HtmlElement),
}
