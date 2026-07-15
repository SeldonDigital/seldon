import type { Document, Element } from "happy-dom"

import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { HtmlElement } from "@seldon/core/properties"

import type { FunctionalNode } from "./types"

/**
 * Maps an HTML tag to the catalog component that plays the same role. This is
 * the inverse of the export-side element map: it seeds each DOM node with a
 * candidate catalog id so matching starts from the real vocabulary rather than
 * a guessed name. Keyed by {@link HtmlElement} so it tracks the core enum.
 */
const TAG_TO_COMPONENT: Partial<Record<HtmlElement, ComponentId>> = {
  [HtmlElement.A]: ComponentId.LINK,
  [HtmlElement.H1]: ComponentId.TEXT,
  [HtmlElement.H2]: ComponentId.TEXT,
  [HtmlElement.H3]: ComponentId.TEXT,
  [HtmlElement.H4]: ComponentId.TEXT,
  [HtmlElement.H5]: ComponentId.TEXT,
  [HtmlElement.H6]: ComponentId.TEXT,
  [HtmlElement.P]: ComponentId.TEXT,
  [HtmlElement.PRE]: ComponentId.TEXT,
  [HtmlElement.CODE]: ComponentId.TEXT,
  [HtmlElement.SPAN]: ComponentId.TEXT,
  [HtmlElement.LABEL]: ComponentId.TEXT,
  [HtmlElement.NAV]: ComponentId.NAV,
  [HtmlElement.HEADER]: ComponentId.HEADER,
  [HtmlElement.FOOTER]: ComponentId.FOOTER,
  [HtmlElement.SECTION]: ComponentId.SECTION,
  [HtmlElement.FIELDSET]: ComponentId.FIELDSET,
  [HtmlElement.FORM]: ComponentId.FIELDSET,
  [HtmlElement.MENU]: ComponentId.MENU,
  [HtmlElement.OPTION]: ComponentId.LISTBOX_OPTION,
  [HtmlElement.LI]: ComponentId.LIST_ITEM,
  [HtmlElement.UL]: ComponentId.LIST,
  [HtmlElement.OL]: ComponentId.LIST,
  [HtmlElement.DL]: ComponentId.DESCRIPTION_LIST,
}

/**
 * Tags that carry no visual structure worth modelling. They are skipped along
 * with their subtrees so the functional tree stays about layout and content.
 */
const IGNORED_TAGS = new Set<string>([
  "script",
  "style",
  "noscript",
  "template",
  "head",
  "meta",
  "link",
  "title",
  "base",
  "br",
  "svg",
  "path",
])

const ELEMENT_NODE = 1
const TEXT_NODE = 3

const LEVEL_RANK: Record<string, number> = {
  [ComponentLevel.PRIMITIVE]: 0,
  [ComponentLevel.ELEMENT]: 1,
  [ComponentLevel.PART]: 2,
  [ComponentLevel.MODULE]: 3,
  [ComponentLevel.SCREEN]: 4,
}

const RANK_LEVEL: ComponentLevel[] = [
  ComponentLevel.PRIMITIVE,
  ComponentLevel.ELEMENT,
  ComponentLevel.PART,
  ComponentLevel.MODULE,
  ComponentLevel.SCREEN,
]

/** True when the element holds its own non-whitespace text, not just children. */
function hasOwnText(element: Element): boolean {
  for (const node of Array.from(element.childNodes)) {
    if (node.nodeType !== TEXT_NODE) continue
    if ((node.textContent ?? "").trim() !== "") return true
  }
  return false
}

/** The ARIA role, explicit when set, otherwise inferred from a few key tags. */
function resolveRole(tag: string, element: Element): string | null {
  const explicit = element.getAttribute("role")
  if (explicit && explicit.trim() !== "") return explicit.trim()
  if (tag === "nav") return "navigation"
  if (tag === "header") return "banner"
  if (tag === "footer") return "contentinfo"
  if (tag === "main") return "main"
  if (tag === "a") return "link"
  if (tag === "button") return "button"
  if (tag === "ul" || tag === "ol") return "list"
  if (tag === "li") return "listitem"
  return null
}

/**
 * Picks the hierarchy level for a node. A leaf takes a fixed low level from its
 * tag. A container sits one rank above its deepest child so a box of primitives
 * reads as an element, a box of elements as a part, and so on. `body` and
 * `html` are pinned to screen.
 */
function resolveLevel(
  tag: string,
  seed: ComponentId | null,
  childLevels: ComponentLevel[],
): ComponentLevel {
  if (tag === "body" || tag === "html") return ComponentLevel.SCREEN
  if (childLevels.length === 0) {
    if (seed === ComponentId.BUTTON) return ComponentLevel.ELEMENT
    return ComponentLevel.PRIMITIVE
  }
  const childMax = Math.max(...childLevels.map((level) => LEVEL_RANK[level] ?? 0))
  // A wrapper around a single child is the same tier as that child, not a step
  // up, so a plain container such as <main> around one region does not inflate
  // toward screen. Multiple children make a genuine composite one tier higher.
  const rank =
    childLevels.length === 1
      ? childMax
      : Math.min(childMax + 1, RANK_LEVEL.length - 1)
  return RANK_LEVEL[rank]
}

/**
 * The catalog component a tag seeds from. `button` and `img` are handled
 * directly because they are not part of the {@link HtmlElement} enum used for
 * the rest of the map.
 */
function resolveSeed(tag: string): ComponentId | null {
  if (tag === "button") return ComponentId.BUTTON
  if (tag === "img") return ComponentId.IMAGE
  return TAG_TO_COMPONENT[tag as HtmlElement] ?? null
}

/** Converts one element and its visual subtree into a functional node. */
function toFunctionalNode(element: Element): FunctionalNode | null {
  const tag = element.tagName.toLowerCase()
  if (IGNORED_TAGS.has(tag)) return null

  const children: FunctionalNode[] = []
  for (const child of Array.from(element.children)) {
    const node = toFunctionalNode(child as Element)
    if (node) children.push(node)
  }

  const seed = resolveSeed(tag)

  return {
    tag,
    role: resolveRole(tag, element),
    level: resolveLevel(tag, seed, children.map((child) => child.level)),
    seededComponent: seed,
    hasText: hasOwnText(element),
    children,
  }
}

/** Counts every node in a functional tree, including the root. */
export function countNodes(node: FunctionalNode): number {
  return node.children.reduce((total, child) => total + countNodes(child), 1)
}

/**
 * Deconstructs a parsed document into a functional node tree rooted at `body`.
 * Non-visual tags and their subtrees are dropped, so the result describes the
 * page's layout and content structure rather than its raw markup.
 */
export function deconstruct(document: Document): FunctionalNode | null {
  const body = document.body
  if (!body) return null
  return toFunctionalNode(body as unknown as Element)
}
