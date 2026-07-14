// BESPOKE-VIEW: collapsible reasoning block for the Hari transcript. The header
// toggle collapses the reasoning to a single row or expands it to its full
// height. Each block owns its own expand state, so toggling one leaves the
// others untouched; it defaults open. The header reads "Thinking..." while the
// model reasons, then "Thought for Ns" once the phase completes. Expanded text
// keeps the model's own line breaks via pre-wrap; the generated MessageThinking
// supplies the frame, label, and toggle button.
import { type CSSProperties, useState } from "react"
import { MessageThinking } from "@seldon/components/elements/MessageThinking"
import type { IconProps } from "@seldon/components/primitives/Icon"

interface HariThinkingProps {
  text: string
  /** Set once thinking completes; drives the header label and the elapsed time. */
  durationMs?: number
  /** True when reasoning was clamped off for this turn; shows a "Clamped" tag. */
  clamped?: boolean
}

/** Renders the reasoning block with a header toggle that shows or hides it. */
export function HariThinking({ text, durationMs, clamped }: HariThinkingProps) {
  const [open, setOpen] = useState(true)

  const label =
    durationMs !== undefined
      ? `Thought for ${Math.max(1, Math.round(durationMs / 1000))}s`
      : clamped
        ? "Reasoning off"
        : "Thinking..."
  const headerSlot = { children: label }
  const clampedSlot = clamped ? { children: "Clamped" } : null
  const iconSlot: IconProps = {
    icon: open ? "material-chevronDown" : "material-chevronRight",
  }
  const buttonIconic = {
    onClick: () => setOpen(!open),
    "aria-expanded": open,
    "aria-label": open ? "Hide reasoning" : "Show reasoning",
  }
  const bodySlot = text
    ? { children: text, style: open ? expandedStyle : collapsedStyle }
    : null

  return (
    <MessageThinking
      textDescription={headerSlot}
      textDescription2={clampedSlot}
      buttonIconic={buttonIconic}
      icon={iconSlot}
      textDescription3={bodySlot}
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
