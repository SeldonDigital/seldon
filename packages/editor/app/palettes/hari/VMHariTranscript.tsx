// View-model for the Hari chat transcript. Each structured turn from useHari
// maps to the generated Message* blocks: the prompt, the model's reasoning, the
// tools it called, the applied changes, the markdown reply, and any rejection or
// error. Tool activity renders one MessageTools row per entry, grouped in a
// single frame so the turn reads as one tools section. Assistant replies render
// through VMHariMarkdown.
import { type CSSProperties, type ReactNode, useMemo } from "react"
import type { HariTurn } from "@lib/hooks/use-ai-chat"
import { useDebugStore } from "@lib/hooks/use-debug-mode"
import { MessageAssistant } from "@seldon/components/elements/MessageAssistant"
import { MessageError } from "@seldon/components/elements/MessageError"
import { MessageOutcome } from "@seldon/components/elements/MessageOutcome"
import { MessageStatus } from "@seldon/components/elements/MessageStatus"
import { MessageTools } from "@seldon/components/elements/MessageTools"
import { MessageUser } from "@seldon/components/elements/MessageUser"
import { Frame } from "@seldon/components/frames/Frame"
import type { IconProps } from "@seldon/components/primitives/Icon"
import { VMHariMarkdown } from "./VMHariMarkdown"
import { VMHariThinking } from "./VMHariThinking"

interface VMHariTranscriptProps {
  turns: HariTurn[]
  /** Re-runs a turn's prompt from the error block's retry button. */
  onRetry?: (prompt: string) => void
}

/** Renders the transcript as a flat list of Message blocks for the turns frame. */
export function VMHariTranscript({ turns, onRetry }: VMHariTranscriptProps) {
  const showTools = useDebugStore((state) => state.showTools)
  const showOutcome = useDebugStore((state) => state.showOutcome)
  const content = useMemo(
    () => buildTranscript(turns, onRetry, showTools, showOutcome),
    [turns, onRetry, showTools, showOutcome],
  )
  return content
}

/** Builds every turn's blocks in reading order, or nothing before the first turn. */
function buildTranscript(
  turns: HariTurn[],
  onRetry: VMHariTranscriptProps["onRetry"],
  showTools: boolean,
  showOutcome: boolean,
): ReactNode {
  if (turns.length === 0) return null

  const blocks: ReactNode[] = []
  for (const turn of turns) {
    blocks.push(userBlock(turn))
    if (turn.thinking || turn.clamped) blocks.push(thinkingBlock(turn))
    const toolsNode = toolsBlock(turn, showTools)
    if (toolsNode) blocks.push(toolsNode)
    const outcomeNode = outcomeBlock(turn, showOutcome)
    if (outcomeNode) blocks.push(outcomeNode)
    if (turn.reply) blocks.push(assistantBlock(turn))
    if (turn.status === "pending") blocks.push(statusBlock(turn))
    if (turn.status === "stopped") blocks.push(stoppedBlock(turn))
    if (turn.error || (turn.rejected && turn.rejected.length > 0)) {
      blocks.push(errorBlock(turn, onRetry))
    }
  }
  return <>{blocks}</>
}

function userBlock(turn: HariTurn): ReactNode {
  const textDescription = { children: turn.prompt }
  return (
    <MessageUser key={`${turn.id}-user`} textDescription={textDescription} />
  )
}

function statusBlock(turn: HariTurn): ReactNode {
  const textLabel = { children: "Working..." }
  return <MessageStatus key={`${turn.id}-status`} textLabel={textLabel} />
}

function stoppedBlock(turn: HariTurn): ReactNode {
  const textLabel = { children: "Stopped." }
  return <MessageStatus key={`${turn.id}-stopped`} textLabel={textLabel} />
}

function thinkingBlock(turn: HariTurn): ReactNode {
  const text = turn.thinking ?? ""
  return (
    <VMHariThinking
      key={`${turn.id}-thinking`}
      text={text}
      durationMs={turn.thinkingMs}
      clamped={turn.clamped}
    />
  )
}

/** One tool-activity row: the generated MessageTools element, a status icon and text. */
function toolRow(
  key: string,
  iconName: IconProps["icon"],
  text: string,
): ReactNode {
  const icon = { icon: iconName }
  const textDescription = { children: text, style: preWrapStyle }
  return (
    <MessageTools key={key} icon={icon} textDescription={textDescription} />
  )
}

/**
 * The tools block: the tools the model called, then the deterministic shape
 * repairs, the vocabulary warnings, and the rejections for the turn. When Show
 * Tools is off the block still surfaces any failed tool call, since a failed edit
 * attempt is the signal that a change was tried and missed and must not read as a
 * silent success. Repairs, warnings, rejections, and successful calls stay behind
 * Show Tools. Returns null when there is nothing to show. Every row renders inside
 * one grouping frame so the turn reads as a single tool section.
 */
function toolsBlock(turn: HariTurn, showTools: boolean): ReactNode {
  const calls = turn.toolCalls ?? []
  const shownCalls = showTools ? calls : calls.filter((call) => !call.ok)
  const rows: ReactNode[] = []
  shownCalls.forEach((call, index) => {
    rows.push(
      toolRow(
        `call-${index}`,
        call.ok ? "material-checkCircle" : "material-error",
        call.name,
      ),
    )
  })
  if (showTools) {
    ;(turn.repairs ?? []).forEach((repair, index) => {
      rows.push(
        toolRow(
          `repair-${index}`,
          "material-warning",
          `repair: ${repair.actionType}.${repair.propertyKey} — ${repair.reason}`,
        ),
      )
    })
    ;(turn.warnings ?? []).forEach((warning, index) => {
      rows.push(toolRow(`warning-${index}`, "material-warning", warning))
    })
    ;(turn.rejected ?? []).forEach((item, index) => {
      rows.push(
        toolRow(
          `rejected-${index}`,
          "material-error",
          `rejected: ${item.type} — ${item.reason}`,
        ),
      )
    })
  }
  if (rows.length === 0) return null
  return (
    <Frame key={`${turn.id}-tools`} style={toolsGroupStyle}>
      {rows}
    </Frame>
  )
}

/** Icon, label, and fallback line for each reducer-truth outcome badge. */
const OUTCOME_META: Record<
  NonNullable<HariTurn["outcome"]>,
  { icon: IconProps["icon"]; label: string; description: string }
> = {
  applied: {
    icon: "material-checkCircle",
    label: "Applied",
    description: "Changes applied to the workspace.",
  },
  ineffective: {
    icon: "material-warning",
    label: "No effective change",
    description: "The edit matched nothing, so the workspace is unchanged.",
  },
  none: {
    icon: "material-removeCircle",
    label: "No changes applied",
    description: "The turn produced no accepted edit.",
  },
}

/**
 * The outcome badge: a reducer-truth summary shown for every done turn, so a
 * reply can never read as a success the workspace never took. It shows the full
 * per-target change list when Show Outcome is on, otherwise a one-line summary.
 */
function outcomeBlock(turn: HariTurn, showOutcome: boolean): ReactNode {
  if (turn.status !== "done" || !turn.outcome) return null
  const meta = OUTCOME_META[turn.outcome]
  const detail =
    showOutcome && turn.outcome === "applied" && (turn.changes?.length ?? 0) > 0
      ? (turn.changes ?? []).join("\n")
      : meta.description
  const icon = { icon: meta.icon }
  const textLabel = { children: meta.label }
  const textDescription = { children: detail, style: preWrapStyle }
  return (
    <MessageOutcome
      key={`${turn.id}-outcome`}
      icon={icon}
      textLabel={textLabel}
      textDescription={textDescription}
    />
  )
}

const preWrapStyle: CSSProperties = { whiteSpace: "pre-wrap" }

// Stacks the tool rows into one section so a turn's tool activity reads as a
// single block rather than a run of separate messages.
const toolsGroupStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--sdn-gaps-compact)",
}

function assistantBlock(turn: HariTurn): ReactNode {
  const reply = turn.reply ?? ""
  return (
    <MessageAssistant key={`${turn.id}-assistant`}>
      <VMHariMarkdown content={reply} />
    </MessageAssistant>
  )
}

function errorBlock(
  turn: HariTurn,
  onRetry: VMHariTranscriptProps["onRetry"],
): ReactNode {
  const text =
    turn.error ??
    (turn.rejected ?? [])
      .map((item) => `${item.type}: ${item.reason}`)
      .join("; ")
  const textDescription = { children: text }
  const buttonSimple = onRetry ? { onClick: () => onRetry(turn.prompt) } : null
  return (
    <MessageError
      key={`${turn.id}-error`}
      textDescription={textDescription}
      buttonSimple={buttonSimple}
    />
  )
}
