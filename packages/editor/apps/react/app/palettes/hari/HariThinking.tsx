// View-model for the reasoning block in the Hari transcript. The generated
// MessageThinking supplies the frame, label, and toggle button; this adapter
// owns the runtime pieces a static schema cannot: the expand/collapse state,
// the dynamic header label, and the collapsed/expanded body text treatment.
import { MessageThinking } from "@seldon/components/elements/MessageThinking"
import { useState } from "react"

import type { IconProps } from "@seldon/components/primitives/Icon"
import type { CSSProperties } from "react"

interface HariThinkingProps {
  text: string
  /** Set once thinking completes; drives the header label and the elapsed time. */
  durationMs?: number
  /** True when reasoning was clamped off for this turn; shows a "Clamped" tag. */
  clamped?: boolean
}

/**
 * Renders the reasoning block with a header toggle that shows or hides it. The
 * clamped tag and the body only exist for some turns, and a ref override cannot
 * turn a slot on, so their presence stays a positional decision while their
 * values come through refs.
 */
export function HariThinking({ text, durationMs, clamped }: HariThinkingProps) {
  const [open, setOpen] = useState(true)

  const label =
    durationMs !== undefined
      ? `Thought for ${Math.max(1, Math.round(durationMs / 1000))}s`
      : clamped
        ? "Reasoning off"
        : "Thinking..."
  const chevron: IconProps["icon"] = open ? "material-keyboardArrowDown" : "material-chevronRight"
  const seldonRefs = {
    hariReasoningToggle: {
      onClick: () => setOpen(!open),
      "aria-expanded": open,
      "aria-label": open ? "Hide reasoning" : "Show reasoning",
    },
    hariReasoningChevron: { icon: chevron },
    hariReasoningLabel: { children: label },
    hariReasoningBody: { children: text, style: open ? expandedStyle : collapsedStyle },
  }
  const clampedSlot = clamped ? {} : null
  const bodySlot = text ? {} : null

  return (
    <MessageThinking
      buttonIconic={{}}
      textDescription={{}}
      textDescription2={clampedSlot}
      textDescription3={bodySlot}
      seldonRefs={seldonRefs}
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
