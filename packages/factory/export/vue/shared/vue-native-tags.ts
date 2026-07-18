import type { NativeReactPrimitive } from "@seldon/core/components/types"

import { ComponentToExport } from "../../types"

/**
 * Maps each native primitive to the HTML tag a Vue template renders directly.
 * React needs wrapper components (`HTMLButton`) to thread `forwardRef`; Vue
 * templates render native tags inline, so no per-tag wrapper component is
 * emitted. The `returns` semantics themselves are framework-neutral and shared
 * with the React config through {@link resolveVueReturns}.
 */
export const NATIVE_VUE_TAGS: Record<NativeReactPrimitive, string> = {
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

export type VueReturns = NonNullable<ComponentToExport["config"]["vue"]>

/**
 * Resolves the effective Vue export descriptor. When a schema omits its `vue`
 * block, the descriptor defaults from `react` so every component exports without
 * per-schema Vue authoring.
 */
export function resolveVueReturns(component: ComponentToExport): VueReturns {
  const { config } = component
  if (config.vue) return config.vue
  return {
    returns: config.react.returns,
    custom: config.react.custom,
    expose: config.react.forwardRef,
  }
}

/**
 * Native HTML tag for a component's root element in the Vue target, or `null`
 * when the root is not a plain native primitive (Frame, custom, dynamic
 * element, or icon map handled separately).
 */
export function getVueRootTag(component: ComponentToExport): string | null {
  const returns = resolveVueReturns(component).returns
  if (returns in NATIVE_VUE_TAGS) {
    return NATIVE_VUE_TAGS[returns as NativeReactPrimitive]
  }
  return null
}
