// View-model for the Hari chat transcript. Each structured turn from useHari
// maps to the generated Message* blocks: the prompt, the model's reasoning, the
// tools it called, the applied changes, the markdown reply, and any rejection or
// error. Tool activity renders as one collapsible HariTools block per turn, so
// the turn reads as a single "Tools Applied" section. Assistant replies render
// through HariMarkdown.
import { type CSSProperties, type ReactNode, useMemo } from "react"
import type { HariTurn } from "@app/ai/use-ai-chat"
import { useDebugStore } from "@app/editor/hooks/use-debug-mode"
import { MessageAssistant } from "@seldon/components/elements/MessageAssistant"
import { MessageError } from "@seldon/components/elements/MessageError"
import { MessageOutcome } from "@seldon/components/elements/MessageOutcome"
import { MessageStatus } from "@seldon/components/elements/MessageStatus"
import { MessageUser } from "@seldon/components/elements/MessageUser"
import type { IconProps } from "@seldon/components/primitives/Icon"
import { HariMarkdown } from "./HariMarkdown"
import { HariThinking } from "./HariThinking"
import { HariTools, type ToolRow } from "./HariTools"

interface HariTranscriptProps {
  turns: HariTurn[]
  /** Re-runs a turn's prompt from the error block's retry button. */
  onRetry?: (prompt: string) => void
}

/** Renders the transcript as a flat list of Message blocks for the turns frame. */
export function HariTranscript({ turns, onRetry }: HariTranscriptProps) {
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
  onRetry: HariTranscriptProps["onRetry"],
  showTools: boolean,
  showOutcome: boolean,
): ReactNode {
  if (turns.length === 0) return null

  const blocks: ReactNode[] = []
  for (const turn of turns) {
    blocks.push(userBlock(turn))
    if (turn.thinking || turn.clamped) blocks.push(thinkingBlock(turn))
    const toolsNode = showTools ? toolsBlock(turn) : null
    if (toolsNode) blocks.push(toolsNode)
    const outcomeNode = showOutcome ? outcomeBlock(turn) : null
    if (outcomeNode) blocks.push(outcomeNode)
    if (turn.reply) blocks.push(assistantBlock(turn))
    if (turn.status === "pending") blocks.push(statusBlock(turn))
    if (turn.status === "stopped") blocks.push(stoppedBlock(turn))
    if (turn.error || turn.status === "error") {
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
  return (
    <MessageStatus
      key={`${turn.id}-status`}
      className="hari-status-working"
      textLabel={textLabel}
    />
  )
}

function stoppedBlock(turn: HariTurn): ReactNode {
  const textLabel = { children: "Stopped." }
  return <MessageStatus key={`${turn.id}-stopped`} textLabel={textLabel} />
}

function thinkingBlock(turn: HariTurn): ReactNode {
  const text = turn.thinking ?? ""
  return (
    <HariThinking
      key={`${turn.id}-thinking`}
      text={text}
      durationMs={turn.thinkingMs}
      clamped={turn.clamped}
    />
  )
}

/**
 * Every tool-activity row for the turn, in reading order: the tools the model
 * called, then the deterministic shape repairs, the vocabulary warnings, and the
 * rejections. Each row carries its own status icon and label. A failed call is
 * marked in its text, since a failed edit attempt is the signal that a change was
 * tried and missed and must not read as a silent success.
 */
function collectToolRows(turn: HariTurn): ToolRow[] {
  const rows: ToolRow[] = []
  ;(turn.toolCalls ?? []).forEach((call, index) => {
    rows.push({
      key: `call-${index}`,
      icon: call.ok ? "material-checkCircle" : "material-error",
      text: call.ok ? call.name : `${call.name} (failed)`,
    })
  })
  ;(turn.repairs ?? []).forEach((repair, index) => {
    rows.push({
      key: `repair-${index}`,
      icon: "material-warning",
      text: `repair: ${repair.actionType}.${repair.propertyKey} — ${repair.reason}`,
    })
  })
  ;(turn.warnings ?? []).forEach((warning, index) => {
    rows.push({
      key: `warning-${index}`,
      icon: "material-warning",
      text: warning,
    })
  })
  ;(turn.rejected ?? []).forEach((item, index) => {
    rows.push({
      key: `rejected-${index}`,
      icon: "material-error",
      text: `rejected: ${item.type} — ${item.reason}`,
    })
  })
  return rows
}

/**
 * The tools block: one collapsible HariTools per turn. Show Tools gates whether
 * the block renders at all; when shown it starts expanded, and the per-turn
 * chevron collapses or expands it. Returns null when the turn has no tool
 * activity.
 */
function toolsBlock(turn: HariTurn): ReactNode {
  const rows = collectToolRows(turn)
  if (rows.length === 0) return null
  return <HariTools key={`${turn.id}-tools`} rows={rows} defaultOpen />
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
 * The outcome badge: a reducer-truth summary for a done turn. Show Output gates
 * whether it renders. When shown, an applied turn lists its full per-target
 * changes; every other outcome shows its one-line description.
 */
function outcomeBlock(turn: HariTurn): ReactNode {
  if (turn.status !== "done" || !turn.outcome) return null
  const meta = OUTCOME_META[turn.outcome]
  const detail =
    turn.outcome === "applied" && (turn.changes?.length ?? 0) > 0
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

function assistantBlock(turn: HariTurn): ReactNode {
  const reply = turn.reply ?? ""
  const streaming = turn.status === "pending"
  const className = streaming ? "hari-assistant-streaming" : undefined
  return (
    <MessageAssistant key={`${turn.id}-assistant`} className={className}>
      <HariMarkdown content={reply} />
    </MessageAssistant>
  )
}

function errorBlock(
  turn: HariTurn,
  onRetry: HariTranscriptProps["onRetry"],
): ReactNode {
  const text =
    turn.error ??
    (turn.rejected ?? [])
      .map((item) => `${item.type}: ${item.reason}`)
      .join("; ")
  const textDescription = { children: text }
  const buttonSimple = onRetry ? { onClick: () => onRetry(turn.prompt) } : null
  const textLabel = onRetry ? { children: "Retry" } : null
  return (
    <MessageError
      key={`${turn.id}-error`}
      textDescription={textDescription}
      buttonSimple={buttonSimple}
      textLabel={textLabel}
    />
  )
}
