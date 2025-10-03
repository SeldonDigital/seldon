/**
 * HTML element types for semantic markup.
 */
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
}

/**
 * Readable HTML element options for interface.
 */
export const HTML_ELEMENT_OPTIONS: { name: string; value: HtmlElement }[] = [
  { name: "A", value: HtmlElement.A },
  { name: "H1", value: HtmlElement.H1 },
  { name: "H2", value: HtmlElement.H2 },
  { name: "H3", value: HtmlElement.H3 },
  { name: "H4", value: HtmlElement.H4 },
  { name: "H5", value: HtmlElement.H5 },
  { name: "H6", value: HtmlElement.H6 },
  { name: "P", value: HtmlElement.P },
  { name: "SPAN", value: HtmlElement.SPAN },
  { name: "LABEL", value: HtmlElement.LABEL },
  { name: "DIV", value: HtmlElement.DIV },
  { name: "SECTION", value: HtmlElement.SECTION },
  { name: "ARTICLE", value: HtmlElement.ARTICLE },
  { name: "HEADER", value: HtmlElement.HEADER },
  { name: "FOOTER", value: HtmlElement.FOOTER },
  { name: "MAIN", value: HtmlElement.MAIN },
  { name: "NAV", value: HtmlElement.NAV },
  { name: "ASIDE", value: HtmlElement.ASIDE },
  { name: "FIGURE", value: HtmlElement.FIGURE },
  { name: "FIGCAPTION", value: HtmlElement.FIGCAPTION },
  { name: "FORM", value: HtmlElement.FORM },
  { name: "FIELDSET", value: HtmlElement.FIELDSET },
  { name: "MENU", value: HtmlElement.MENU },
]
