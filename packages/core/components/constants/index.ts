/**
 * Keep this file aligned with the component schemas and
 * `packages/core/components/catalog`.
 *
 * To sync it after schema changes, invoke `@components-catalog`.
 *
 * `ComponentId` lives in `./component-id` and is re-exported here for callers that
 * import component constants and the id from one place.
 */
import { IconId } from "@seldon/core/icon-sets"
import { HtmlElement, WrapperElement } from "@seldon/core/properties"

import { NativeReactPrimitive } from "../types"
import { ComponentId, isComponentId } from "../types/component-id"

export { ComponentId, isComponentId }

export const LABEL_DEFAULT = "Label"
export const DEFAULT_ICON: IconId = "__default__"

export enum ComponentLevel {
  PRIMITIVE = "primitive",
  ELEMENT = "element",
  PART = "part",
  MODULE = "module",
  FRAME = "frame",
  SCREEN = "screen",
  BOARD = "board",
}

export enum ComponentIcon {
  STUB = "seldon-stub",
  COMPONENT = "seldon-component",
  SCREEN = "seldon-screen",
  ICON = "seldon-icon",
  IMAGE = "seldon-image",
  INPUT = "seldon-input",
  TEXT = "seldon-text",
  FRAME = "seldon-frame",
  FRAME_BACKGROUND = "seldon-frameBackground",
  FRAME_COLUMNS = "seldon-frameColumns",
  FRAME_ROWS = "seldon-frameRows",
  SOCIAL_FACEBOOK = "social-facebook",
  SOCIAL_YOUTUBE = "social-youtube",
  SOCIAL_WHATSAPP = "social-whatsapp",
  SOCIAL_INSTAGRAM = "social-instagram",
  SOCIAL_TIKTOK = "social-tiktok",
  SOCIAL_TWITTER = "social-twitter",
  SOCIAL_LINKEDIN = "social-linkedin",
  SOCIAL_SNAPCHAT = "social-snapchat",
  SOCIAL_PINTEREST = "social-pinterest",
  SOCIAL_REDDIT = "social-reddit",
  SOCIAL_TELEGRAM = "social-telegram",
  SOCIAL_DISCORD = "social-discord",
  SOCIAL_TWITCH = "social-twitch",
  SOCIAL_GITHUB = "social-github",
  SOCIAL_SPOTIFY = "social-spotify",
  SOCIAL_TUMBLR = "social-tumblr",
  SOCIAL_VIMEO = "social-vimeo",
  SOCIAL_FLICKR = "social-flickr",
  SOCIAL_MEDIUM = "social-medium",
  SOCIAL_QUORA = "social-quora",
}

/**
 * The order of the levels of components.
 * This is used to determine if a component can be a parent of another component.
 * The higher the index, the higher the level.
 *
 * Do not reorder this array unless you know what you are doing.
 */
export const ORDERED_COMPONENT_LEVELS: ComponentLevel[] = [
  // Screen is the highest level of components. It may contain anything.
  ComponentLevel.SCREEN,
  // Modules are the next level of components. They may only contain modules, parts, elements, frames and primitives.
  ComponentLevel.MODULE,
  // Parts are the next level of components. They may only contain parts, elements, frames and primitives.
  ComponentLevel.PART,
  // Elements are the next level of components. They may only contain elements, frames and primitives.
  ComponentLevel.ELEMENT,
  // Primitives are the lowest level of components. They may cannot have children.
  ComponentLevel.PRIMITIVE,
  // Frames are an exception to components. They can contain anything.
  ComponentLevel.FRAME,
]

// All available native react primitives
export const NATIVE_REACT_PRIMITIVES: Record<
  NativeReactPrimitive,
  {
    types: {
      generic: string
      parameter: string
    }
    htmlElementOption?: HtmlElement
    wrapperElementOption?: WrapperElement
  }
> = {
  HTMLAnchor: {
    types: {
      generic: "AnchorHTMLAttributes",
      parameter: "HTMLAnchorElement",
    },
    htmlElementOption: HtmlElement.A,
  },
  HTMLArticle: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLElement",
    },
    htmlElementOption: HtmlElement.ARTICLE,
    wrapperElementOption: WrapperElement.ARTICLE,
  },
  HTMLAside: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLElement",
    },
    htmlElementOption: HtmlElement.ASIDE,
    wrapperElementOption: WrapperElement.ASIDE,
  },
  HTMLBlockquote: {
    types: {
      generic: "BlockquoteHTMLAttributes",
      parameter: "HTMLBlockquoteElement",
    },
    wrapperElementOption: WrapperElement.BLOCKQUOTE,
  },
  HTMLButton: {
    types: {
      generic: "ButtonHTMLAttributes",
      parameter: "HTMLButtonElement",
    },
  },
  HTMLCite: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLElement",
    },
  },
  HTMLCode: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLElement",
    },
    htmlElementOption: HtmlElement.CODE,
  },
  HTMLDd: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLElement",
    },
    htmlElementOption: HtmlElement.DD,
  },
  HTMLDiv: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLElement",
    },
    htmlElementOption: HtmlElement.DIV,
    wrapperElementOption: WrapperElement.DIV,
  },
  HTMLDl: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLDListElement",
    },
    htmlElementOption: HtmlElement.DL,
  },
  HTMLDt: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLElement",
    },
    htmlElementOption: HtmlElement.DT,
  },
  HTMLFieldset: {
    types: {
      generic: "FieldsetHTMLAttributes",
      parameter: "HTMLFieldsetElement",
    },
    htmlElementOption: HtmlElement.FIELDSET,
    wrapperElementOption: WrapperElement.FIELDSET,
  },
  HTMLFigure: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLElement",
    },
    htmlElementOption: HtmlElement.FIGURE,
    wrapperElementOption: WrapperElement.FIGURE,
  },
  HTMLFooter: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLElement",
    },
    htmlElementOption: HtmlElement.FOOTER,
    wrapperElementOption: WrapperElement.FOOTER,
  },
  HTMLForm: {
    types: {
      generic: "FormHTMLAttributes",
      parameter: "HTMLFormElement",
    },
    htmlElementOption: HtmlElement.FORM,
    wrapperElementOption: WrapperElement.FORM,
  },
  HTMLHeader: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLElement",
    },
    htmlElementOption: HtmlElement.HEADER,
    wrapperElementOption: WrapperElement.HEADER,
  },
  HTMLHeading1: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLHeadingElement",
    },
    htmlElementOption: HtmlElement.H1,
  },
  HTMLHeading2: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLHeadingElement",
    },
    htmlElementOption: HtmlElement.H2,
  },
  HTMLHeading3: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLHeadingElement",
    },
    htmlElementOption: HtmlElement.H3,
  },
  HTMLHeading4: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLHeadingElement",
    },
    htmlElementOption: HtmlElement.H4,
  },
  HTMLHeading5: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLHeadingElement",
    },
    htmlElementOption: HtmlElement.H5,
  },
  HTMLHeading6: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLHeadingElement",
    },
    htmlElementOption: HtmlElement.H6,
  },
  HTMLHr: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLHRElement",
    },
  },
  HTMLImg: {
    types: {
      generic: "ImgHTMLAttributes",
      parameter: "HTMLImageElement",
    },
  },
  HTMLInput: {
    types: {
      generic: "InputHTMLAttributes",
      parameter: "HTMLInputElement",
    },
  },
  HTMLLabel: {
    types: {
      generic: "LabelHTMLAttributes",
      parameter: "HTMLLabelElement",
    },
    htmlElementOption: HtmlElement.LABEL,
  },
  HTMLLegend: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLLegendElement",
    },
  },
  HTMLLi: {
    types: {
      generic: "LiHTMLAttributes",
      parameter: "HTMLLIElement",
    },
    htmlElementOption: HtmlElement.LI,
    wrapperElementOption: WrapperElement.LI,
  },
  HTMLMain: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLElement",
    },
    htmlElementOption: HtmlElement.MAIN,
    wrapperElementOption: WrapperElement.MAIN,
  },
  HTMLMenu: {
    types: {
      generic: "MenuHTMLAttributes",
      parameter: "HTMLMenuElement",
    },
    htmlElementOption: HtmlElement.MENU,
    wrapperElementOption: WrapperElement.MENU,
  },
  HTMLNav: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLElement",
    },
    htmlElementOption: HtmlElement.NAV,
    wrapperElementOption: WrapperElement.NAV,
  },
  HTMLOl: {
    types: {
      generic: "OlHTMLAttributes",
      parameter: "HTMLOListElement",
    },
    htmlElementOption: HtmlElement.OL,
    wrapperElementOption: WrapperElement.OL,
  },
  HTMLOptgroup: {
    types: {
      generic: "OptgroupHTMLAttributes",
      parameter: "HTMLOptGroupElement",
    },
    htmlElementOption: HtmlElement.OPTGROUP,
  },
  HTMLOption: {
    types: {
      generic: "OptionHTMLAttributes",
      parameter: "HTMLOptionElement",
    },
    htmlElementOption: HtmlElement.OPTION,
  },
  HTMLParagraph: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLParagraphElement",
    },
    htmlElementOption: HtmlElement.P,
  },
  HTMLPre: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLPreElement",
    },
    htmlElementOption: HtmlElement.PRE,
  },
  HTMLSection: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLElement",
    },
    htmlElementOption: HtmlElement.SECTION,
    wrapperElementOption: WrapperElement.SECTION,
  },
  HTMLSelect: {
    types: {
      generic: "SelectHTMLAttributes",
      parameter: "HTMLSelectElement",
    },
  },
  HTMLSource: {
    types: {
      generic: "SourceHTMLAttributes",
      parameter: "HTMLSourceElement",
    },
  },
  HTMLSpan: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLElement",
    },
    htmlElementOption: HtmlElement.SPAN,
  },
  HTMLSvg: {
    types: {
      generic: "SVGAttributes",
      parameter: "SVGElement",
    },
  },
  HTMLTable: {
    types: {
      generic: "TableHTMLAttributes",
      parameter: "HTMLTableElement",
    },
  },
  HTMLTbody: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLTableSectionElement",
    },
    wrapperElementOption: WrapperElement.TBODY,
  },
  HTMLTd: {
    types: {
      generic: "TdHTMLAttributes",
      parameter: "HTMLTableCellElement",
    },
  },
  HTMLTextarea: {
    types: {
      generic: "TextareaHTMLAttributes",
      parameter: "HTMLTextAreaElement",
    },
  },
  HTMLTfoot: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLTableSectionElement",
    },
    wrapperElementOption: WrapperElement.TFOOT,
  },
  HTMLTh: {
    types: {
      generic: "ThHTMLAttributes",
      parameter: "HTMLTableCellElement",
    },
  },
  HTMLThead: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLTableSectionElement",
    },
    wrapperElementOption: WrapperElement.THEAD,
  },
  HTMLTr: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLTableRowElement",
    },
    wrapperElementOption: WrapperElement.TR,
  },
  HTMLTrack: {
    types: {
      generic: "TrackHTMLAttributes",
      parameter: "HTMLTrackElement",
    },
  },
  HTMLUl: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLUListElement",
    },
    htmlElementOption: HtmlElement.UL,
    wrapperElementOption: WrapperElement.UL,
  },
  HTMLVideo: {
    types: {
      generic: "HTMLAttributes",
      parameter: "HTMLVideoElement",
    },
  },
}
