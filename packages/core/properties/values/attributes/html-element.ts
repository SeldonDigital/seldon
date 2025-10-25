import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

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

export interface HtmlElementPresetValue {
  type: ValueType.PRESET
  value: HtmlElement
}

export type HtmlElementValue = EmptyValue | HtmlElementPresetValue

export const htmlElementSchema: PropertySchema = {
  name: "htmlElement",
  description: "HTML element type for semantic markup",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(HtmlElement).includes(value),
  },
  presetOptions: () => Object.values(HtmlElement),
}
