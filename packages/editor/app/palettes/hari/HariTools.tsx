// View-model for the tool-activity block in the Hari transcript. The generated
// MessageTools body exposes only a single icon+text row, so this adapter takes
// over its children to render the real header plus one icon+text row per tool
// entry. It owns the runtime pieces a static schema cannot: the expand/collapse
// state and the per-row list built from the turn's tool activity.
//
// The class names below mirror the generated MessageTools defaults so the
// rebuilt header and rows keep the design's styling. They track re-exports of
// MessageTools.tsx: if that file's slot classes change, update them here.
import { useState } from "react"
import { ButtonIconic } from "@seldon/components/elements/ButtonIconic"
import { MessageTools } from "@seldon/components/elements/MessageTools"
import { Frame } from "@seldon/components/frames/Frame"
import { Icon, type IconProps } from "@seldon/components/primitives/Icon"
import { TextDescription } from "@seldon/components/primitives/TextDescription"

/** One tool-activity line: a status icon and its label. */
export interface ToolRow {
  key: string
  icon: IconProps["icon"]
  text: string
}

interface HariToolsProps {
  rows: ToolRow[]
  /** Initial expanded state, seeded from the Show Tools flag. */
  defaultOpen: boolean
}

const HEADER_FRAME_CLASS = "sdn-frame sdn-frame--ieew"
const HEADER_BUTTON_CLASS = "sdn-button-iconic sdn-button-iconic--iklu"
const HEADER_ICON_CLASS = "sdn-icon sdn-icon--bmas"
const HEADER_TEXT_CLASS = "sdn-text-description sdn-text-description--71gg"
const ROW_FRAME_CLASS = "sdn-frame sdn-frame--rstc"
const ROW_ICON_CLASS = "sdn-icon sdn-icon--9ouj"
const ROW_TEXT_CLASS = "sdn-text-description sdn-text-description--hqun"

/** Renders the turn's tool activity as one collapsible "Tools Applied" block. */
export function HariTools({ rows, defaultOpen }: HariToolsProps) {
  const [open, setOpen] = useState(defaultOpen)

  const toggle = () => setOpen(!open)
  const toggleLabel = open ? "Hide tools" : "Show tools"
  const chevronIcon: IconProps = {
    icon: open ? "material-chevronDown" : "material-chevronRight",
    className: HEADER_ICON_CLASS,
  }
  const header = (
    <Frame className={HEADER_FRAME_CLASS}>
      <ButtonIconic
        className={HEADER_BUTTON_CLASS}
        icon={chevronIcon}
        onClick={toggle}
        aria-expanded={open}
        aria-label={toggleLabel}
      />
      <TextDescription className={HEADER_TEXT_CLASS}>
        Tools Applied
      </TextDescription>
    </Frame>
  )
  const rowFrames = open
    ? rows.map((row) => (
        <Frame key={row.key} className={ROW_FRAME_CLASS}>
          <Icon className={ROW_ICON_CLASS} icon={row.icon} />
          <TextDescription className={ROW_TEXT_CLASS}>
            {row.text}
          </TextDescription>
        </Frame>
      ))
    : null

  return (
    <MessageTools>
      {header}
      {rowFrames}
    </MessageTools>
  )
}
