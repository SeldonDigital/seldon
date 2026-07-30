// View-model that renders an AI reply's markdown string through generated Seldon
// components. markdown-it parses the string into tokens and each token maps to a
// catalog primitive that carries its own Seldon typography and spacing, so no
// styles are hand-authored here. A render function rather than a template,
// because the result is a flat list of nodes. Vue port of the React `HariMarkdown`.
import Blockquote from "@seldon/components/primitives/Blockquote.vue"
import Hr from "@seldon/components/primitives/Hr.vue"
import Link from "@seldon/components/primitives/Link.vue"
import ListItem from "@seldon/components/primitives/ListItem.vue"
import Text from "@seldon/components/primitives/Text.vue"
import TextCodeblock from "@seldon/components/primitives/TextCodeblock.vue"
import TextHeading from "@seldon/components/primitives/TextHeading.vue"
import MarkdownIt from "markdown-it"
import { defineComponent, h } from "vue"

import type Token from "markdown-it/lib/token.mjs"
import type { VNodeChild } from "vue"

const markdown = new MarkdownIt({ linkify: true })

/** Heading levels the catalog styles. A deeper level renders as the smallest. */
const HEADING_TAGS = new Set(["h1", "h2", "h3"])

/**
 * Consumes tokens from `index` until the matching close token, returning the
 * rendered children and the index just past that close. markdown-it emits a flat
 * stream, so nesting is recovered by pairing each open token with the close token
 * at the same depth.
 */
function consumeUntil(tokens: Token[], index: number, closeType: string): [VNodeChild[], number] {
  const openType = closeType.replace("_close", "_open")
  const children: VNodeChild[] = []
  let cursor = index
  let depth = 0

  while (cursor < tokens.length) {
    const token = tokens[cursor]!

    if (token.type === closeType) {
      if (depth === 0) return [children, cursor + 1]
      depth -= 1
    }

    if (token.type === openType) depth += 1

    const [node, next] = renderToken(tokens, cursor)

    if (node !== null) children.push(node)
    cursor = next
  }

  return [children, cursor]
}

/** Renders the token at `index`, returning the node and the next index to read. */
function renderToken(tokens: Token[], index: number): [VNodeChild, number] {
  const token = tokens[index]!

  switch (token.type) {
    case "inline":
      return [renderTokens(token.children ?? []), index + 1]

    case "text":
      return [token.content, index + 1]

    case "softbreak":
      return [" ", index + 1]

    case "hardbreak":
      return [h("br"), index + 1]

    case "hr":
      return [h(Hr), index + 1]

    case "code_inline":
      return [h(TextCodeblock, { htmlElement: "code" }, () => token.content), index + 1]

    case "fence":
    case "code_block":
      return [h(TextCodeblock, { htmlElement: "pre" }, () => token.content), index + 1]

    case "paragraph_open": {
      const [children, next] = consumeUntil(tokens, index + 1, "paragraph_close")

      return [h(Text, { htmlElement: "p" }, () => children), next]
    }

    case "heading_open": {
      const tag = HEADING_TAGS.has(token.tag) ? token.tag : "h3"
      const [children, next] = consumeUntil(tokens, index + 1, "heading_close")

      return [h(TextHeading, { htmlElement: tag }, () => children), next]
    }

    case "link_open": {
      const href = token.attrGet("href") ?? undefined
      const [children, next] = consumeUntil(tokens, index + 1, "link_close")

      return [h(Link, { href, target: "_blank", rel: "noreferrer" }, () => children), next]
    }

    case "blockquote_open": {
      const [children, next] = consumeUntil(tokens, index + 1, "blockquote_close")

      return [h(Blockquote, null, () => children), next]
    }

    case "bullet_list_open": {
      const [children, next] = consumeUntil(tokens, index + 1, "bullet_list_close")

      return [h("ul", { class: "sdn-list" }, children), next]
    }

    case "ordered_list_open": {
      const [children, next] = consumeUntil(tokens, index + 1, "ordered_list_close")

      return [h("ol", { class: "sdn-list sdn-list-ordered" }, children), next]
    }

    case "list_item_open": {
      const [children, next] = consumeUntil(tokens, index + 1, "list_item_close")

      return [h(ListItem, { htmlElement: "li" }, () => children), next]
    }

    case "strong_open": {
      const [children, next] = consumeUntil(tokens, index + 1, "strong_close")

      return [h("strong", children), next]
    }

    case "em_open": {
      const [children, next] = consumeUntil(tokens, index + 1, "em_close")

      return [h("em", children), next]
    }

    default: {
      // An unmapped container still yields its contents, so no text is dropped.
      if (token.type.endsWith("_open")) {
        return consumeUntil(tokens, index + 1, token.type.replace("_open", "_close"))
      }

      return [token.content || null, index + 1]
    }
  }
}

/** Renders a whole token stream in order. */
function renderTokens(tokens: Token[]): VNodeChild[] {
  const nodes: VNodeChild[] = []
  let cursor = 0

  while (cursor < tokens.length) {
    const [node, next] = renderToken(tokens, cursor)

    if (node !== null) nodes.push(node)
    cursor = next
  }

  return nodes
}

/** Renders a markdown string as Seldon-styled elements. */
export const HariMarkdown = defineComponent({
  name: "HariMarkdown",
  props: {
    content: { type: String, required: true },
  },
  setup(props) {
    return () => renderTokens(markdown.parse(props.content, {}))
  },
})
