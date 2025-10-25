import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css"
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { Instance, Variant } from "@seldon/core"
import { useSelection } from "@lib/workspace/use-selection"
import { getHtmlElementByNodeId } from "@components/canvas/helpers/get-html-element-by-node-id"
import { useClassStyles } from "./use-class-styles"

SyntaxHighlighter.registerLanguage("css", css)

export function ComputedPane() {
  const { selectedNode } = useSelection()

  if (!selectedNode)
    return (
      <div className="border-t border-t-neutral-950 p-4">
        <span className="w-5/12 truncate text-sm text-neutral-100/60">
          No node selected
        </span>
      </div>
    )

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <StyleCodeBlock selectedNode={selectedNode} />
    </div>
  )
}

function StyleCodeBlock({
  selectedNode,
}: {
  selectedNode: Variant | Instance
}) {
  const selectedElement = getHtmlElementByNodeId(selectedNode.id)
  const styleProperties = useClassStyles(selectedElement)

  if (!selectedElement) return null

  return (
    <div className="border-t border-t-neutral-950 p-2">
      <SyntaxHighlighter
        language="css"
        style={atomOneDarkReasonable}
        customStyle={{
          fontSize: 11,
          background: "none",
          width: "100%",
          height: "100%",
        }}
      >
        {styleProperties.join("\n")}
      </SyntaxHighlighter>
    </div>
  )
}
