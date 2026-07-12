// BESPOKE-VIEW: collapsible reasoning block for the Hari transcript. The header
// toggle collapses the reasoning to a single row or expands it to its full
// height. Expanded text keeps the model's own line breaks via pre-wrap; the
// generated MessageThinking supplies the frame, label, and toggle button.
import { type CSSProperties, useState } from "react"
import { MessageThinking } from "@seldon/components/elements/MessageThinking"
import type { IconProps } from "@seldon/components/primitives/Icon"

interface HariThinkingProps {
  text: string
}

/** Renders the reasoning block with a header toggle that shows or hides it. */
export function HariThinking({ text }: HariThinkingProps) {
  const [open, setOpen] = useState(false)

  const headerSlot = { children: "Thinking" }
  const iconSlot: IconProps = {
    icon: open ? "material-chevronDown" : "material-chevronRight",
  }
  const buttonIconic = {
    onClick: () => setOpen((value) => !value),
    "aria-expanded": open,
    "aria-label": open ? "Hide reasoning" : "Show reasoning",
  }
  const bodySlot = {
    children: text,
    style: open ? expandedStyle : collapsedStyle,
  }

  return (
    <MessageThinking
      textDescription={headerSlot}
      buttonIconic={buttonIconic}
      icon={iconSlot}
      textDescription2={bodySlot}
    />
  )
}

const collapsedStyle: CSSProperties = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}

const expandedStyle: CSSProperties = {
  whiteSpace: "pre-wrap",
}
