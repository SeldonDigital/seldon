import { HtmlElement } from "@seldon/core/properties"

const HTML_ELEMENT_TO_FILE_STEM: Partial<Record<HtmlElement, string>> = {
  [HtmlElement.DIV]: "HTML.Div",
  [HtmlElement.SECTION]: "HTML.Section",
  [HtmlElement.ARTICLE]: "HTML.Article",
  [HtmlElement.HEADER]: "HTML.Header",
  [HtmlElement.FOOTER]: "HTML.Footer",
  [HtmlElement.MAIN]: "HTML.Main",
  [HtmlElement.NAV]: "HTML.Nav",
  [HtmlElement.ASIDE]: "HTML.Aside",
  [HtmlElement.FORM]: "HTML.Form",
  [HtmlElement.FIELDSET]: "HTML.Fieldset",
  [HtmlElement.LABEL]: "HTML.Label",
  [HtmlElement.SPAN]: "HTML.Span",
  [HtmlElement.P]: "HTML.Paragraph",
  [HtmlElement.UL]: "HTML.Ul",
  [HtmlElement.OL]: "HTML.Ol",
  [HtmlElement.LI]: "HTML.Li",
  [HtmlElement.A]: "HTML.Anchor",
  [HtmlElement.H1]: "HTML.Heading1",
  [HtmlElement.H2]: "HTML.Heading2",
  [HtmlElement.H3]: "HTML.Heading3",
  [HtmlElement.H4]: "HTML.Heading4",
  [HtmlElement.H5]: "HTML.Heading5",
  [HtmlElement.H6]: "HTML.Heading6",
  [HtmlElement.FIGURE]: "HTML.Figure",
  [HtmlElement.FIGCAPTION]: "HTML.Figcaption",
  [HtmlElement.OPTION]: "HTML.Option",
  [HtmlElement.OPTGROUP]: "HTML.Optgroup",
}

export function getNativeFileStemsForUsedElements(
  usedElements: Set<HtmlElement>,
): Set<string> {
  const stems = new Set<string>()
  for (const element of usedElements) {
    const stem = HTML_ELEMENT_TO_FILE_STEM[element]
    if (stem) {
      stems.add(stem)
    }
  }
  return stems
}
