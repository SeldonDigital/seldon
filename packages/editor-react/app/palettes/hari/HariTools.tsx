// View-model for the tool-activity block in the Hari transcript. The generated
// MessageTools body exposes only a single icon+text row, so this adapter takes
// over its children to render the real header plus one icon+text row per tool
// entry. It owns the runtime pieces a static schema cannot: the expand/collapse
// state (for the block and for each row's prompt/output detail) and the
// per-row list built from the turn's tool activity.
//
// The class names below mirror the generated MessageTools defaults so the
// rebuilt header and rows keep the design's styling. They track re-exports of
// MessageTools.tsx: if that file's slot classes change, update them here.
import { ButtonIconic } from "@seldon/components/elements/ButtonIconic"
import { MessageTools } from "@seldon/components/elements/MessageTools"
import { Frame } from "@seldon/components/frames/Frame"
import { Icon, type IconProps } from "@seldon/components/primitives/Icon"
import { TextDescription } from "@seldon/components/primitives/TextDescription"
import { type CSSProperties, type ReactNode, useState } from "react"

/** One tool-activity line: a status icon, its label, and optional call detail. */
export interface ToolRow {
  key: string
  icon: IconProps["icon"]
  text: string
  /** The prompt the step sent to the model, when the step made a model call. */
  prompt?: string
  /** What the step produced: the model's answer, or a deterministic result. */
  output?: string
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

/** Indents a row's detail under its label and wraps long prompts readably. */
const DETAIL_FRAME_STYLE: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  paddingLeft: "28px",
}
const DETAIL_BODY_STYLE: CSSProperties = {
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
  fontFamily: "monospace",
  fontSize: "0.85em",
  opacity: 0.8,
}

/** One prompt/output section of a row's expanded detail. */
function detailSection(key: string, label: string, body: string): ReactNode {
  return (
    <Frame key={key} className={ROW_FRAME_CLASS} style={DETAIL_FRAME_STYLE}>
      <TextDescription className={ROW_TEXT_CLASS}>{label}</TextDescription>
      <TextDescription className={ROW_TEXT_CLASS} style={DETAIL_BODY_STYLE}>
        {body}
      </TextDescription>
    </Frame>
  )
}

/** Renders the turn's tool activity as one collapsible "Tools Applied" block. */
export function HariTools({ rows, defaultOpen }: HariToolsProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({})

  const toggle = () => setOpen(!open)
  const toggleRow = (key: string) =>
    setOpenRows((state) => ({ ...state, [key]: !state[key] }))
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
    ? rows.flatMap((row) => {
        const hasDetail = row.prompt !== undefined || row.output !== undefined
        const rowOpen = hasDetail && (openRows[row.key] ?? false)
        const rowChevron: IconProps = {
          icon: rowOpen ? "material-chevronDown" : "material-chevronRight",
          className: ROW_ICON_CLASS,
        }
        const framesForRow: ReactNode[] = [
          <Frame key={row.key} className={ROW_FRAME_CLASS}>
            {hasDetail ? (
              <ButtonIconic
                className={HEADER_BUTTON_CLASS}
                icon={rowChevron}
                onClick={() => toggleRow(row.key)}
                aria-expanded={rowOpen}
                aria-label={rowOpen ? `Hide ${row.text}` : `Show ${row.text}`}
              />
            ) : null}
            <Icon className={ROW_ICON_CLASS} icon={row.icon} />
            <TextDescription className={ROW_TEXT_CLASS}>
              {row.text}
            </TextDescription>
          </Frame>,
        ]
        const { prompt, output } = row
        const showPrompt = rowOpen && prompt !== undefined
        if (showPrompt) {
          framesForRow.push(
            detailSection(`${row.key}-prompt`, "Prompt", prompt),
          )
        }
        const showOutput = rowOpen && output !== undefined
        if (showOutput) {
          framesForRow.push(
            detailSection(`${row.key}-output`, "Output", output),
          )
        }
        return framesForRow
      })
    : null

  return (
    <MessageTools>
      {header}
      {rowFrames}
    </MessageTools>
  )
}
