import { CSSProperties, memo } from "react"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css"
import {
  atomOneDarkReasonable,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs"
import { useResolvedInterfaceMode } from "@app/editor/hooks/use-system-color-scheme"
import { Frame } from "@seldon/components/frames/Frame"

const CSS_BLOCK_PADDING =
  "var(--sdn-paddings-tight) var(--sdn-paddings-compact) var(--sdn-paddings-tight) var(--sdn-paddings-comfortable)"
const CSS_BLOCK_FONT_SIZE = "var(--sdn-font-size-xsmall)"

SyntaxHighlighter.registerLanguage("css", css)

interface CssBlockProps {
  cssProperties: string[]
}

/**
 * Displays CSS properties as syntax-highlighted code.
 * Text is selectable for easy copy-paste.
 *
 * The highlighter theme follows the editor interface mode, so the code stays
 * legible against the sidebar background in both light and dark chrome.
 */
function CssBlockInner({ cssProperties }: CssBlockProps) {
  const mode = useResolvedInterfaceMode()
  const highlighterStyle =
    mode === "dark" ? atomOneDarkReasonable : atomOneLight

  if (cssProperties.length === 0) {
    return null
  }

  return (
    <Frame style={styles.container}>
      <SyntaxHighlighter
        language="css"
        style={highlighterStyle}
        customStyle={styles.codeBlock}
      >
        {cssProperties.join("\n")}
      </SyntaxHighlighter>
    </Frame>
  )
}

/**
 * `cssProperties` gets a new array reference on every sidebar render, but the
 * highlighter only needs to re-run when the rendered text changes. Comparing the
 * joined content skips `react-syntax-highlighter`'s expensive re-highlight on
 * edits and selections that leave the selected node's CSS unchanged.
 */
export const CssBlock = memo(CssBlockInner, (prev, next) => {
  if (prev.cssProperties.length !== next.cssProperties.length) return false
  return prev.cssProperties.every(
    (line, index) => line === next.cssProperties[index],
  )
})

const styles: Record<string, CSSProperties> = {
  container: {
    padding: CSS_BLOCK_PADDING,
    width: "100%",
    overflow: "hidden" as const,
  },
  codeBlock: {
    fontSize: CSS_BLOCK_FONT_SIZE,
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
