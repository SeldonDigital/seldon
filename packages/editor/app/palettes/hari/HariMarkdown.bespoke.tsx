// BESPOKE-VIEW: markdown renderer for AI chat assistant messages. Parsing is
// handled by react-markdown; each node maps to a native semantic element that
// carries Seldon text classNames so it inherits catalog typography. The Seldon
// `Text` primitive is intentionally not used here because it types children as
// a plain string and cannot hold markdown's inline node children.
import type { CSSProperties } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

interface HariMarkdownProps {
  content: string
}

const REMARK_PLUGINS = [remarkGfm]

/**
 * Renders a markdown string as Seldon-styled elements. Node overrides map every
 * markdown element to a native tag with a Seldon text className, so links open
 * safely in a new tab and code blocks scroll instead of overflowing the panel.
 */
export function HariMarkdown({ content }: HariMarkdownProps) {
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
  p: ({ children }) => (
    <p className="sdn-text" style={styles.paragraph}>
      {children}
    </p>
  ),
  h1: ({ children }) => (
    <h1 className="sdn-text" style={styles.heading}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="sdn-text" style={styles.heading}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="sdn-text" style={styles.heading}>
      {children}
    </h3>
  ),
  ul: ({ children }) => (
    <ul className="sdn-text" style={styles.list}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="sdn-text" style={styles.list}>
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="sdn-text" style={styles.listItem}>
      {children}
    </li>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" style={styles.link}>
      {children}
    </a>
  ),
  code: ({ className, children }) => {
    const isBlock = /language-/.test(className ?? "")
    if (isBlock) {
      return (
        <code className="sdn-text-codeblock" style={styles.codeBlock}>
          {children}
        </code>
      )
    }
    return (
      <code className="sdn-text-codeblock" style={styles.codeInline}>
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="sdn-text-codeblock" style={styles.pre}>
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="sdn-text" style={styles.blockquote}>
      {children}
    </blockquote>
  ),
  hr: () => <hr style={styles.rule} />,
}

const styles: Record<string, CSSProperties> = {
  paragraph: {
    margin: "0 0 8px",
    fontSize: "var(--sdn-font-size-xsmall)",
    lineHeight: 1.5,
    color: "var(--sdn-swatch-offBlack)",
  },
  heading: {
    margin: "12px 0 6px",
    fontSize: "var(--sdn-font-size-small)",
    fontWeight: 600,
    color: "var(--sdn-swatch-offBlack)",
  },
  list: {
    margin: "0 0 8px",
    paddingLeft: 20,
    fontSize: "var(--sdn-font-size-xsmall)",
    lineHeight: 1.5,
    color: "var(--sdn-swatch-offBlack)",
  },
  listItem: {
    margin: "2px 0",
  },
  link: {
    color: "var(--sdn-swatch-primary)",
    textDecoration: "underline",
  },
  codeInline: {
    fontFamily: "monospace",
    fontSize: "var(--sdn-font-size-xsmall)",
    background: "var(--sdn-swatch-lightGray, rgba(0,0,0,0.06))",
    borderRadius: 3,
    padding: "1px 4px",
  },
  codeBlock: {
    fontFamily: "monospace",
    fontSize: "var(--sdn-font-size-xsmall)",
    background: "none",
    padding: 0,
  },
  pre: {
    margin: "0 0 8px",
    padding: 10,
    background: "var(--sdn-swatch-lightGray, rgba(0,0,0,0.06))",
    borderRadius: 6,
    overflowX: "auto",
    fontFamily: "monospace",
    fontSize: "var(--sdn-font-size-xsmall)",
    lineHeight: 1.45,
  },
  blockquote: {
    margin: "0 0 8px",
    paddingLeft: 10,
    borderLeft: "3px solid var(--sdn-swatch-gray)",
    fontSize: "var(--sdn-font-size-xsmall)",
    lineHeight: 1.5,
    color: "var(--sdn-swatch-gray)",
  },
  rule: {
    border: "none",
    borderTop: "1px solid var(--sdn-swatch-gray)",
    margin: "12px 0",
  },
}
