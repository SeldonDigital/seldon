import type { AgentToolCall } from "../types"
import type { ResolvedContext } from "./editor-context"
import type { OllamaCallMetrics } from "./ollama-client"
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
  | { kind: "message"; text: string }

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
  clarification: Clarification,
): FamilyOutcome {
  return { kind: "message", text: clarification.text }
}
