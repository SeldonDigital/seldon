import {
  ComponentId,
  NATIVE_REACT_PRIMITIVES,
  NativeReactPrimitive,
  Properties,
  WrapperElement,
  getComponentExportConfig,
  invariant,
} from "@lib/core"

/**
 * Native HTML tag for each React primitive key. The canvas renders design nodes
 * to plain DOM tags, so both editors paint identical markup from one config.
 */
const NATIVE_HTML_TAGS: Record<NativeReactPrimitive, string> = {
  HTMLAnchor: "a",
  HTMLArticle: "article",
  HTMLAside: "aside",
  HTMLBlockquote: "blockquote",
  HTMLButton: "button",
  HTMLCite: "cite",
  HTMLCode: "code",
  HTMLDd: "dd",
  HTMLDiv: "div",
  HTMLDl: "dl",
  HTMLDt: "dt",
  HTMLFieldset: "fieldset",
  HTMLFigure: "figure",
  HTMLFooter: "footer",
  HTMLForm: "form",
  HTMLHeader: "header",
  HTMLHeading1: "h1",
  HTMLHeading2: "h2",
  HTMLHeading3: "h3",
  HTMLHeading4: "h4",
  HTMLHeading5: "h5",
  HTMLHeading6: "h6",
  HTMLHr: "hr",
  HTMLImg: "img",
  HTMLInput: "input",
  HTMLLabel: "label",
  HTMLLegend: "legend",
  HTMLLi: "li",
  HTMLMain: "main",
  HTMLMenu: "menu",
  HTMLNav: "nav",
  HTMLOl: "ol",
  HTMLOptgroup: "optgroup",
  HTMLOption: "option",
  HTMLParagraph: "p",
  HTMLPre: "pre",
  HTMLSection: "section",
  HTMLSelect: "select",
  HTMLSource: "source",
  HTMLSpan: "span",
  HTMLSvg: "svg",
  HTMLTable: "table",
  HTMLTbody: "tbody",
  HTMLTd: "td",
  HTMLTextarea: "textarea",
  HTMLTfoot: "tfoot",
  HTMLTh: "th",
  HTMLThead: "thead",
  HTMLTr: "tr",
  HTMLTrack: "track",
  HTMLUl: "ul",
  HTMLVideo: "video",
}

export const VOID_TAGS = new Set<string>([
  "hr",
  "img",
  "input",
  "source",
  "textarea",
  "track",
])

export type CanvasTag =
  | { kind: "icon" }
  | { kind: "tag"; tag: string; void: boolean }

/**
 * Resolves the DOM tag for a canvas node, mirroring the React
 * `ComponentRenderer` component selection. Icons render through the shared Icon
 * layer, so they return a dedicated marker.
 */
export function resolveCanvasTag(
  componentId: ComponentId,
  properties: Properties,
  renderAsDiv = false,
): CanvasTag {
  if (renderAsDiv) {
    return { kind: "tag", tag: "div", void: false }
  }

  if (componentId === ComponentId.ICON) {
    return { kind: "icon" }
  }

  const config = getComponentExportConfig(componentId)
  const returns = config.react.returns

  if (returns === "iconMap") {
    return { kind: "icon" }
  }

  if (returns === "Frame") {
    return { kind: "tag", tag: "div", void: false }
  }

  if (returns === "custom") {
    // Custom templates build their own internal DOM. The Vue canvas renders a
    // neutral container until a bespoke canvas template is provided.
    return { kind: "tag", tag: "div", void: false }
  }

  if (returns === "wrapperElement") {
    const raw = properties.wrapperElement?.value
    const tag =
      typeof raw === "string" && raw.length > 0 ? raw : WrapperElement.DIV
    const item = Object.entries(NATIVE_REACT_PRIMITIVES).find(
      ([, entry]) =>
        entry.wrapperElementOption === tag || entry.htmlElementOption === tag,
    )
    invariant(
      item,
      `Could not find a native primitive for ${componentId} wrapper element ${tag}`,
    )
    const key = item[0] as NativeReactPrimitive
    const domTag = NATIVE_HTML_TAGS[key]
    return { kind: "tag", tag: domTag, void: VOID_TAGS.has(domTag) }
  }

  if (returns === "htmlElement") {
    const item = Object.entries(NATIVE_REACT_PRIMITIVES).find(
      ([, entry]) => entry.htmlElementOption === properties.htmlElement?.value,
    )
    invariant(
      item,
      `Could not find a native primitive for ${componentId} html element ${properties.htmlElement?.value}`,
    )
    const key = item[0] as NativeReactPrimitive
    const domTag = NATIVE_HTML_TAGS[key]
    return { kind: "tag", tag: domTag, void: VOID_TAGS.has(domTag) }
  }

  const domTag = NATIVE_HTML_TAGS[returns]
  invariant(domTag, `Could not find a native primitive for ${componentId}`)
  return { kind: "tag", tag: domTag, void: VOID_TAGS.has(domTag) }
}
