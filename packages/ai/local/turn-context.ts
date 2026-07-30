import type { AgentToolCall } from "../types"
import type { ResolvedContext } from "./editor-context"
import type { OllamaCallMetrics } from "./ollama-client"
import type { TurnState } from "./turn-state"

/**
 * What a step did, attached to its transcript row: the prompt the step sent
 * to the model (absent on deterministic steps) and the answer or result it
 * produced. This is what makes the per-tool dropdown in the transcript useful.
 */
export interface StepDetail {
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
  onStep?: (name: string, ok: boolean, detail?: StepDetail) => void
}

/** Records one resolver step on the context and streams it when listened to. */
export function recordStep(
  context: TurnContext,
  name: string,
  ok: boolean,
  detail?: StepDetail,
): void {
  context.steps.push({ name, ok, ...detail })
  context.onStep?.(name, ok, detail)
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
