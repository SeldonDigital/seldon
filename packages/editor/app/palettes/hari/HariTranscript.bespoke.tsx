// BESPOKE-VIEW: renders the Hari chat transcript. Each structured turn from
// useHari maps to the generated Message* blocks: the prompt, the model's
// reasoning, the tools it called, the applied changes, the markdown reply, and
// any rejection or error. Assistant replies render through HariMarkdown.
import type { HariTurn } from "@lib/hooks/use-ai-chat"
import { useDebugStore } from "@lib/hooks/use-debug-mode"
import { type CSSProperties, type ReactNode, useMemo } from "react"
import { MessageAssistant } from "@seldon/components/elements/MessageAssistant"
import { MessageError } from "@seldon/components/elements/MessageError"
import { MessageOutcome } from "@seldon/components/elements/MessageOutcome"
import { MessageStatus } from "@seldon/components/elements/MessageStatus"
import { MessageTools } from "@seldon/components/elements/MessageTools"
import { MessageUser } from "@seldon/components/elements/MessageUser"
import { Frame } from "@seldon/components/frames/Frame"
import { Icon, type IconProps } from "@seldon/components/primitives/Icon"
import { TextDescription } from "@seldon/components/primitives/TextDescription"
import { HariMarkdown } from "./HariMarkdown.bespoke"
import { HariThinking } from "./HariThinking.bespoke"

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
    if (showTools && hasToolActivity(turn)) {
      blocks.push(toolsBlock(turn))
    }
    if (showOutcome && turn.changes && turn.changes.length > 0) {
      blocks.push(outcomeBlock(turn))
    }
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
  return (
    <HariThinking
      key={`${turn.id}-thinking`}
      text={turn.thinking ?? ""}
      durationMs={turn.thinkingMs}
      clamped={turn.clamped}
    />
  )
}

/** True when the turn has any tool activity worth showing in the tools block. */
function hasToolActivity(turn: HariTurn): boolean {
  return (
    (turn.toolCalls?.length ?? 0) > 0 ||
    (turn.repairs?.length ?? 0) > 0 ||
    (turn.warnings?.length ?? 0) > 0 ||
    (turn.rejected?.length ?? 0) > 0
  )
}

/**
 * One row in the tools block: an icon and a line of text. It renders the same
 * row frame the generated MessageTools uses internally, so stacking rows inside
 * one MessageTools reads as a single block rather than nesting a message per row.
 */
function toolRow(
  key: string,
  iconName: IconProps["icon"],
  text: string,
): ReactNode {
  const icon = { icon: iconName, className: ROW_ICON_CLASS }
  const textDescription = {
    children: text,
    className: ROW_TEXT_CLASS,
    style: preWrapStyle,
  }
  return (
    <Frame key={key} className={ROW_FRAME_CLASS}>
      <Icon {...icon} />
      <TextDescription {...textDescription} />
    </Frame>
  )
}

/**
 * The tools block: each tool the model called, then the deterministic shape
 * repairs, the vocabulary warnings, and the rejections for the turn. Repairs and
 * warnings are the signal for a malformed edit that still validated or was
 * silently dropped, so they read here rather than only in the console. Every row
 * renders inside one parent block so the turn reads as a single tool section
 * rather than a stack of separate messages.
 */
function toolsBlock(turn: HariTurn): ReactNode {
  const rows: ReactNode[] = []
  ;(turn.toolCalls ?? []).forEach((call, index) => {
    rows.push(
      toolRow(
        `call-${index}`,
        call.ok ? "material-checkCircle" : "material-error",
        call.name,
      ),
    )
  })
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
  return <MessageTools key={`${turn.id}-tools`}>{rows}</MessageTools>
}

function outcomeBlock(turn: HariTurn): ReactNode {
  const icon = { icon: "material-checkCircle" } as const
  const textLabel = { children: "Applied" }
  const textDescription = {
    children: (turn.changes ?? []).join("\n"),
    style: preWrapStyle,
  }
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

// The row frame, icon, and text classes the generated MessageTools bakes onto
// its internal rows, reused so a hand-stacked row matches the view component.
const ROW_FRAME_CLASS = "sdn-frame sdn-frame--sv6r"
const ROW_ICON_CLASS = "sdn-icon sdn-icon--9ouj"
const ROW_TEXT_CLASS = "sdn-text sdn-text-description--hqun"

function assistantBlock(turn: HariTurn): ReactNode {
  return (
    <MessageAssistant key={`${turn.id}-assistant`}>
      <HariMarkdown content={turn.reply ?? ""} />
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
  return (
    <MessageError
      key={`${turn.id}-error`}
      textDescription={textDescription}
      buttonSimple={buttonSimple}
    />
  )
}
