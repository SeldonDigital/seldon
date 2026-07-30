// View-model for the tool-activity block in the Hari transcript. The design
// splits the block in two: MessageToolsHeader renders the collapsible header once
// and MessageToolsUsed renders one line per entry, so every part comes from a
// generated component. This adapter owns the runtime pieces a static schema
// cannot: the expand/collapse state and the list built from the turn's activity.
import { MessageToolsHeader } from "@seldon/components/elements/MessageToolsHeader"
import { MessageToolsUsed } from "@seldon/components/elements/MessageToolsUsed"
import { useState } from "react"

import type { IconProps } from "@seldon/components/primitives/Icon"

/** One tool-activity line: a status icon and its label. */
export interface ToolUsed {
  key: string
  icon: IconProps["icon"]
  text: string
}

interface HariToolsProps {
  tools: ToolUsed[]
  /** Initial expanded state, seeded from the Show Tools flag. */
  defaultOpen: boolean
}

/** Renders the turn's tool activity as one collapsible "Tools Applied" block. */
export function HariTools({ tools, defaultOpen }: HariToolsProps) {
  const [open, setOpen] = useState(defaultOpen)

  const chevron: IconProps["icon"] = open ? "material-chevronDown" : "material-chevronRight"
  const headerRefs = {
    hariToolsToggle: {
      onClick: () => setOpen(!open),
      "aria-expanded": open,
      "aria-label": open ? "Hide tools" : "Show tools",
    },
    hariToolsChevron: { icon: chevron },
  }

  const lines = open
    ? tools.map((tool) => {
        const toolRefs = {
          hariToolIcon: { icon: tool.icon },
          hariToolText: { children: tool.text },
        }

        return (
          <MessageToolsUsed key={tool.key} icon={{}} textDescription={{}} seldonRefs={toolRefs} />
        )
      })
    : null

  return (
    <>
      <MessageToolsHeader buttonIconic={{}} textDescription={{}} seldonRefs={headerRefs} />
      {lines}
    </>
  )
}
