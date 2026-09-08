import { ComponentId } from "@seldon/core/components/constants"
import { HtmlElement } from "@seldon/core/properties"

const TEXT_ELEMENTS: readonly HtmlElement[] = [
  HtmlElement.P,
  HtmlElement.SPAN,
  HtmlElement.B,
  HtmlElement.STRONG,
  HtmlElement.EM,
  HtmlElement.A,
  HtmlElement.LABEL,
  HtmlElement.H1,
  HtmlElement.H2,
  HtmlElement.H3,
  HtmlElement.H4,
  HtmlElement.H5,
  HtmlElement.H6,
  HtmlElement.PRE,
  HtmlElement.CODE,
  HtmlElement.OPTION,
]

const PARAGRAPH_ELEMENTS: readonly HtmlElement[] = [HtmlElement.P]

const HEADING_ELEMENTS: readonly HtmlElement[] = [
  HtmlElement.H1,
  HtmlElement.H2,
  HtmlElement.H3,
  HtmlElement.H4,
  HtmlElement.H5,
  HtmlElement.H6,
]

/**
 * HTML elements each `returns: "htmlElement"` component can render as.
 * Drives the generated switch statement, its native-react imports, and the
 * prop union in the component interface.
 */
export const HTML_ELEMENT_OPTIONS: Partial<Record<ComponentId, readonly HtmlElement[]>> = {
  [ComponentId.TEXT]: TEXT_ELEMENTS,
  [ComponentId.PARAGRAPH]: PARAGRAPH_ELEMENTS,
  [ComponentId.HEADING]: HEADING_ELEMENTS,
  [ComponentId.OPTION_GROUP]: [HtmlElement.OPTGROUP],
  [ComponentId.LIST]: [HtmlElement.UL, HtmlElement.OL],
  [ComponentId.LIST_ITEM]: [HtmlElement.LI, HtmlElement.DT, HtmlElement.DD],
}
