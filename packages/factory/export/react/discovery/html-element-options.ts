import { ComponentId } from "@seldon/core/components/constants"
import { HtmlElement } from "@seldon/core/properties"

const INLINE_TEXT_ELEMENTS: readonly HtmlElement[] = [
  HtmlElement.P,
  HtmlElement.SPAN,
  HtmlElement.A,
  HtmlElement.LABEL,
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
export const HTML_ELEMENT_OPTIONS: Partial<
  Record<ComponentId, readonly HtmlElement[]>
> = {
  [ComponentId.TEXT]: INLINE_TEXT_ELEMENTS,
  [ComponentId.DESCRIPTION]: INLINE_TEXT_ELEMENTS,
  [ComponentId.CODEBLOCK]: INLINE_TEXT_ELEMENTS,
  [ComponentId.OPTION]: [HtmlElement.OPTION],
  [ComponentId.OPTION_GROUP]: [HtmlElement.OPTGROUP],
}
