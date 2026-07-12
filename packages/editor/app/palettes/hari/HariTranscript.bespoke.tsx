// BESPOKE-VIEW: renders the Hari chat transcript. Each structured turn from
// useHari maps to the generated Message* blocks: the prompt, the model's
// reasoning, the tools it called, the applied changes, the markdown reply, and
// any rejection or error. Assistant replies render through HariMarkdown.
import type { HariStatus, HariTurn } from "@lib/hooks/use-ai-chat"
import { type ReactNode, useMemo } from "react"
import { MessageAssistant } from "@seldon/components/elements/MessageAssistant"
import { MessageError } from "@seldon/components/elements/MessageError"
import { MessageOutcome } from "@seldon/components/elements/MessageOutcome"
import { MessageStatus } from "@seldon/components/elements/MessageStatus"
import { MessageThinking } from "@seldon/components/elements/MessageThinking"
import { MessageTools } from "@seldon/components/elements/MessageTools"
import { MessageUser } from "@seldon/components/elements/MessageUser"
import { Frame } from "@seldon/components/frames/Frame"
import { Icon } from "@seldon/components/primitives/Icon"
import { TextDescription } from "@seldon/components/primitives/TextDescription"
import { TextLabel } from "@seldon/components/primitives/TextLabel"
import { HariMarkdown } from "./HariMarkdown.bespoke"

interface HariTranscriptProps {
  turns: HariTurn[]
  status: HariStatus
  /** Re-runs a turn's prompt from the error block's retry button. */
  onRetry?: (prompt: string) => void
}

/** Renders the transcript as a flat list of Message blocks for the turns frame. */
export function HariTranscript({ turns, status, onRetry }: HariTranscriptProps) {
  const content = useMemo(
    () => buildTranscript(turns, onRetry),
    [turns, onRetry],
  )
  return content
}

/** Builds every turn's blocks in reading order, or the empty-state hint. */
function buildTranscript(
  turns: HariTurn[],
  onRetry: HariTranscriptProps["onRetry"],
): ReactNode {
  if (turns.length === 0) return emptyBlock()

  const blocks: ReactNode[] = []
  for (const turn of turns) {
    blocks.push(userBlock(turn))
    if (turn.status === "pending") {
      blocks.push(statusBlock(turn))
      continue
    }
    if (turn.thinking) blocks.push(thinkingBlock(turn))
    if (turn.toolCalls && turn.toolCalls.length > 0) {
      blocks.push(toolsBlock(turn))
    }
    if (turn.changes && turn.changes.length > 0) {
      blocks.push(outcomeBlock(turn))
    }
    if (turn.reply) blocks.push(assistantBlock(turn))
    if (turn.error || (turn.rejected && turn.rejected.length > 0)) {
      blocks.push(errorBlock(turn, onRetry))
    }
  }
  return <>{blocks}</>
}

function emptyBlock(): ReactNode {
  return (
    <TextDescription className="sdn-text" style={emptyStyle}>
      Ask Hari to make a change.
    </TextDescription>
  )
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

function thinkingBlock(turn: HariTurn): ReactNode {
  const textLabel = { children: "Thinking" }
  const textDescription = { children: turn.thinking }
  return (
    <MessageThinking
      key={`${turn.id}-thinking`}
      textLabel={textLabel}
      textDescription={textDescription}
    />
  )
}

function toolsBlock(turn: HariTurn): ReactNode {
  const rows = (turn.toolCalls ?? []).map((call, index) => (
    <Frame key={index} className="sdn-frame sdn-frame--fvwe">
      <Icon
        icon={call.ok ? "material-checkCircle" : "material-error"}
        className="sdn-icon sdn-icon--nlt7"
      />
      <TextDescription className="sdn-text sdn-text-description--ri62">
        {call.name}
      </TextDescription>
    </Frame>
  ))
  return <MessageTools key={`${turn.id}-tools`}>{rows}</MessageTools>
}

function outcomeBlock(turn: HariTurn): ReactNode {
  const header = (
    <Frame key="header" className="sdn-frame sdn-frame--fvwe">
      <Icon icon="material-checkCircle" className="sdn-icon sdn-icon--vsau" />
      <TextLabel className="sdn-text-label sdn-text-label--lbxv">
        Applied
      </TextLabel>
    </Frame>
  )
  const rows = (turn.changes ?? []).map((change, index) => (
    <TextDescription
      key={index}
      className="sdn-text sdn-text-description--ccqe"
    >
      {change}
    </TextDescription>
  ))
  const children = [header, ...rows]
  return <MessageOutcome key={`${turn.id}-outcome`}>{children}</MessageOutcome>
}

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

const emptyStyle = {
  color: "var(--sdn-swatch-gray)",
  fontSize: 13,
}
