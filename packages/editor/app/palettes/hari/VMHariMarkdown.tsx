// View-model that renders an AI reply's markdown string through generated Seldon
// components. react-markdown parses the string and each node maps to a catalog
// primitive that carries its own Seldon typography and spacing via classNames,
// so no styles are hand-authored here.
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { HTMLOl } from "@seldon/components/native-react/HTML.Ol"
import { HTMLUl } from "@seldon/components/native-react/HTML.Ul"
import { Blockquote } from "@seldon/components/primitives/Blockquote"
import { Hr } from "@seldon/components/primitives/Hr"
import { Link } from "@seldon/components/primitives/Link"
import { ListItem } from "@seldon/components/primitives/ListItem"
import { Text } from "@seldon/components/primitives/Text"
import { TextCodeblock } from "@seldon/components/primitives/TextCodeblock"
import { TextHeading } from "@seldon/components/primitives/TextHeading"

interface VMHariMarkdownProps {
  content: string
}

const REMARK_PLUGINS = [remarkGfm]

/**
 * Renders a markdown string as Seldon-styled elements. Every markdown node maps
 * to a generated primitive, so links open in a new tab and code renders with the
 * catalog codeblock treatment.
 */
export function VMHariMarkdown({ content }: VMHariMarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={REMARK_PLUGINS}
      components={MARKDOWN_COMPONENTS}
    >
      {content}
    </ReactMarkdown>
  )
}

const MARKDOWN_COMPONENTS: Components = {
  p: ({ children }) => <Text htmlElement="p">{children}</Text>,
  h1: ({ children }) => <TextHeading htmlElement="h1">{children}</TextHeading>,
  h2: ({ children }) => <TextHeading htmlElement="h2">{children}</TextHeading>,
  h3: ({ children }) => <TextHeading htmlElement="h3">{children}</TextHeading>,
  a: ({ href, children }) => (
    <Link href={href} target="_blank" rel="noreferrer">
      {children}
    </Link>
  ),
  code: ({ children }) => (
    <TextCodeblock htmlElement="code">{children}</TextCodeblock>
  ),
  pre: ({ children }) => (
    <TextCodeblock htmlElement="pre">{children}</TextCodeblock>
  ),
  blockquote: ({ children }) => <Blockquote>{children}</Blockquote>,
  ul: ({ children }) => <HTMLUl className="sdn-list">{children}</HTMLUl>,
  ol: ({ children }) => (
    <HTMLOl className="sdn-list sdn-list-ordered">{children}</HTMLOl>
  ),
  li: ({ children }) => <ListItem htmlElement="li">{children}</ListItem>,
  hr: () => <Hr />,
}
