import { CSSProperties, useCallback } from "react"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css"
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { HTMLButton } from "@seldon/components/native-react/HTML.Button"
import { Icon } from "@seldon/components/primitives/Icon"
import { Box } from "@seldon/components/custom-components"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"

SyntaxHighlighter.registerLanguage("css", css)

interface CssBlockProps {
  cssProperties: string[]
}

const TOGGLE_BUTTON_CLASS = "sdn-button-iconic sdn-button-iconic--0urv"

/**
 * Displays CSS properties as syntax-highlighted code.
 * Text is selectable for easy copy-paste.
 */
export function CssBlock({ cssProperties }: CssBlockProps) {
  const addToast = useAddToast()

  const handleCopyClick = useCallback(async () => {
    const cssText = cssProperties.join("\n")
    try {
      await navigator.clipboard.writeText(cssText)
      addToast("CSS copied to clipboard")
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }, [cssProperties, addToast])

  if (cssProperties.length === 0) {
    return null
  }

  return (
    <Box style={styles.container}>
      <HTMLButton
        className={`variant-button-C11YhJ ${TOGGLE_BUTTON_CLASS}`}
        onClick={handleCopyClick}
        aria-label="Copy CSS to clipboard"
        style={styles.copyButton}
      >
        <Icon
          icon="icon-custom-duplicate"
          className="seldon-instance child-icon-mN_VHh"
          style={styles.icon}
        />
      </HTMLButton>
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
    position: "relative" as const,
    padding:
      "var(--sdn-padding-tight) var(--sdn-padding-compact) var(--sdn-padding-tight) 2.25rem",
    width: "100%",
    overflow: "hidden" as const,
  },
  copyButton: {
    position: "absolute" as const,
    left: "var(--sdn-padding-tight)",
    top: "var(--sdn-padding-tight)",
    zIndex: 10,
    border: "none",
    padding: "var(--sdn-padding-tight)",
    background: "transparent",
  },
  icon: {
    transition: "transform 0.2s ease",
    opacity: 1,
    color: "var(--sdn-seldon-swatch-pearl)",
    fontSize: "var(--sdn-seldon-font-size-xsmall)",
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
