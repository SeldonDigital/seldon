// BESPOKE-VIEW: renders the Hari chat transcript. Each structured turn from
// useHari maps to the generated Message* blocks: the prompt, the model's
// reasoning, the tools it called, the applied changes, the markdown reply, and
// any rejection or error. Assistant replies render through HariMarkdown.
import type { HariTurn } from "@lib/hooks/use-ai-chat"
import { useDebugStore } from "@lib/hooks/use-debug-mode"
import { type CSSProperties, Fragment, type ReactNode, useMemo } from "react"
import { MessageAssistant } from "@seldon/components/elements/MessageAssistant"
import { MessageError } from "@seldon/components/elements/MessageError"
import { MessageOutcome } from "@seldon/components/elements/MessageOutcome"
import { MessageStatus } from "@seldon/components/elements/MessageStatus"
import { MessageTools } from "@seldon/components/elements/MessageTools"
import { MessageUser } from "@seldon/components/elements/MessageUser"
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
    if (turn.thinking) blocks.push(thinkingBlock(turn))
    if (showTools && turn.toolCalls && turn.toolCalls.length > 0) {
      blocks.push(toolsBlock(turn))
    }
    if (showOutcome && turn.changes && turn.changes.length > 0) {
      blocks.push(outcomeBlock(turn))
    }
    if (turn.reply) blocks.push(assistantBlock(turn))
    if (turn.status === "pending") blocks.push(statusBlock(turn))
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

function thinkingBlock(turn: HariTurn): ReactNode {
  return (
    <HariThinking
      key={`${turn.id}-thinking`}
      text={turn.thinking ?? ""}
      durationMs={turn.thinkingMs}
    />
  )
}

function toolsBlock(turn: HariTurn): ReactNode {
  const rows = (turn.toolCalls ?? []).map((call, index) => {
    const icon = {
      icon: call.ok ? "material-checkCircle" : "material-error",
    } as const
    const textDescription = { children: call.name }
    return (
      <MessageTools
        key={index}
        icon={icon}
        textDescription={textDescription}
        frame2={null}
      />
    )
  })
  return <Fragment key={`${turn.id}-tools`}>{rows}</Fragment>
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
