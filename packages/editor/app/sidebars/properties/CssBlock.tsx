import { CSSProperties } from "react"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css"
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { Box } from "@seldon/components/custom-components"

SyntaxHighlighter.registerLanguage("css", css)

interface CssBlockProps {
  cssProperties: string[]
}

/**
 * Displays CSS properties as syntax-highlighted code.
 * Text is selectable for easy copy-paste.
 */
export function CssBlock({ cssProperties }: CssBlockProps) {
  if (cssProperties.length === 0) {
    return null
  }

  return (
    <Box style={styles.container}>
      <SyntaxHighlighter
        language="css"
        style={atomOneDarkReasonable}
        customStyle={styles.codeBlock}
      >
        {cssProperties.join("\n")}
      </SyntaxHighlighter>
    </Box>
  )
}

const styles: Record<string, CSSProperties> = {
  container: {
    padding:
      "var(--sdn-padding-tight) var(--sdn-padding-compact) var(--sdn-padding-tight) var(--sdn-padding-comfortable)",
    width: "100%",
    overflow: "hidden" as const,
  },
  codeBlock: {
    fontSize: "var(--sdn-seldon-font-size-xsmall)",
    background: "none",
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0,
    whiteSpace: "nowrap" as const,
    textOverflow: "ellipsis" as const,
    overflow: "hidden" as const,
  },
}
