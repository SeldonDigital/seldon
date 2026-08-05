import type { AgentToolCall } from "../types"
import type { ResolvedContext } from "./editor-context"
import type { OllamaCallMetrics } from "./ollama-client"
import type { TargetHint } from "./resolvers/extract-target"
import type { TurnState } from "./turn-state"

/**
 * What a step did, attached to its transcript row: whether it succeeded, the
 * prompt it sent to the model (absent on deterministic steps) and the answer
 * or result it produced. This is what makes the per-tool dropdown in the
 * transcript useful. `ok` travels with the detail rather than as a positional
 * argument so a call site reads as `{ ok: false }` instead of a bare `false`.
 */
export interface StepDetail {
  ok: boolean
  prompt?: string
  output?: string
}

/**
 * Everything a family handler needs for one turn: the working-copy state, the
 * resolved editor context, the raw user message, model routing, and the
 * per-call bookkeeping the orchestrator sums into `AgentMetrics` and streams
 * as step events. Handlers push one step per resolver call so the transcript
 * shows the pipeline's real shape.
 */
export interface TurnContext {
  state: TurnState
  resolved: ResolvedContext
  message: string
  model?: string
  host?: string
  /** Metrics from every model call this turn, in call order. */
  calls: OllamaCallMetrics[]
  /** Resolver steps taken this turn, for the transcript's tool-step list. */
  steps: AgentToolCall[]
  /**
   * The target hint extraction produced, kept past target resolution so later
   * stages can tell target words from edit words: a property pick evidenced
   * by a word of the target phrase read the target, not the edit ("hide the
   * top two chips" picked position.top live). Absent until extraction runs,
   * and on paths that resolve without extraction (pickTarget) -- consumers
   * must treat that as "no target words known", never as an error.
   */
  targetHint?: TargetHint
  /** Streams a step to the caller as it happens, when the caller listens. */
  onStep?: (name: string, detail: StepDetail) => void
}

/** Records one resolver step on the context and streams it when listened to. */
export function recordStep(
  context: TurnContext,
  name: string,
  detail: StepDetail,
): void {
  context.steps.push({ name, ...detail })
  context.onStep?.(name, detail)
}

/**
 * Outcome of one family handler. `applied` means at least one action was
 * committed to the working copy and `reply` describes it. `message` is a
 * terminal clarification following the uniform contract -- nothing was
 * changed, and the text tells the user what to do next.
 */
export type FamilyOutcome =
  | { kind: "applied"; reply: string }
  | {
      kind: "message"
      text: string
      /** Why the turn stopped, when a resolver said so -- see MessageReason. */
      reason?: string
      /** The pick list as data, when the ask was a "several". */
      candidateIds?: string[]
    }

/**
 * A terminal clarification: the one shape every resolver and handler in this
 * package uses to stop a turn and tell the user what to do next. Defining it
 * once means the uniform disambiguation contract has a single spelling instead
 * of one per call site.
 */
export interface Clarification {
  kind: "message"
  text: string
}

/**
 * True when a resolver terminated with a clarification instead of returning a
 * value. Narrows the tagged union, so callers get `.text` without re-testing
 * the tag.
 */
export function isClarification<T extends { kind: string }>(
  outcome: T,
): outcome is T & Clarification {
  return outcome.kind === "message"
}

/**
 * Forwards a resolver's clarification outward as this handler's own outcome.
 * Pairs with {@link isClarification} to replace the `if (x.kind === "message")
 * return { kind: "message", text: x.text }` line repeated across every family
 * handler.
 */
export function forwardClarification(
  clarification: Clarification & { reason?: string; candidateIds?: string[] },
): FamilyOutcome {
  return {
    kind: "message",
    text: clarification.text,
    reason: clarification.reason,
    candidateIds: clarification.candidateIds,
  }
}

/**
 * The refusal for a family that cannot act on a set. A plural reference to a
 * single-target action ("move all the chips into...") is a different intent
 * from its singular form and deserves an explicit ask, never an implicit
 * loop over the set and never a silent pick of one member.
 */
export function refuseSetTarget(
  actionDescription: string,
  matchCount: number,
): FamilyOutcome {
  return {
    kind: "message",
    text: `That matched ${matchCount} elements, but I can only ${actionDescription} one at a time. Select the one you mean on the canvas, or name it more specifically, then ask again.`,
  }
}
