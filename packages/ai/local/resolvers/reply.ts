import { buildConversationalReplyStage } from "../../prompt/stages/reply"
import { callOllamaFormat } from "../ollama-client"
import {
  type FamilyOutcome,
  type TurnContext,
  recordStep,
} from "../turn-context"

/**
 * The user-facing reply for a completed turn, ported from terminus's
 * confirmation/error conversational calls but held behind a switch: templates
 * are the default until an eval reply-quality pass shows small local models
 * phrase these well (SELDON_AI_REPLY_MODE=conversational opts in). The
 * conversational call only ever sees the structured outcomes -- what
 * committed and what stopped the plan -- so it cannot claim work that never
 * happened, and any failure of the call itself falls back to the template.
 */

/** One executed step of the plan, with what came of it. */
export interface StepOutcome {
  /** The decomposed, self-contained instruction this step executed. */
  step: string
  /** The intent the classifier assigned, or "skipped" for a none-label. */
  intent: string
  outcome: FamilyOutcome
}

/** Deterministic reply: exactly what happened, step by step. */
export function buildTemplateReply(outcomes: StepOutcome[]): string {
  if (outcomes.length === 0) return "Nothing to do."
  if (outcomes.length === 1) {
    const only = outcomes[0]!.outcome
    return only.kind === "applied" ? only.reply : only.text
  }
  const lines = outcomes.map((entry, index) => {
    const body =
      entry.outcome.kind === "applied"
        ? entry.outcome.reply
        : entry.outcome.text
    return `${index + 1}. ${body}`
  })
  return lines.join("\n")
}

/**
 * Conversational reply: one call given only the structured outcomes. Throws
 * are swallowed into the template so reply generation can never fail a turn
 * that already did its work.
 */
export async function buildConversationalReply(
  context: TurnContext,
  outcomes: StepOutcome[],
): Promise<string> {
  const template = buildTemplateReply(outcomes)
  const { prompt, schema } = buildConversationalReplyStage({
    outcomes: outcomes.map((entry) => ({
      status: entry.outcome.kind === "applied" ? "DONE" : "STOPPED",
      step: entry.step,
      body:
        entry.outcome.kind === "applied"
          ? entry.outcome.reply
          : entry.outcome.text,
    })),
  })
  try {
    const { value, metrics } = await callOllamaFormat<{ message: string }>({
      model: context.model,
      host: context.host,
      prompt,
      schema,
    })
    context.calls.push(metrics)
    recordStep(context, "reply", true, { prompt, output: value.message })
    return value.message
  } catch {
    recordStep(context, "reply", false, {
      prompt,
      output: "The reply call failed; fell back to the template reply.",
    })
    return template
  }
}

/** True when the conversational reply mode is opted into via env. */
export function conversationalRepliesEnabled(): boolean {
  return process.env.SELDON_AI_REPLY_MODE === "conversational"
}

/** The turn's reply, honoring the mode switch. */
export async function generateReply(
  context: TurnContext,
  outcomes: StepOutcome[],
): Promise<string> {
  if (conversationalRepliesEnabled()) {
    return buildConversationalReply(context, outcomes)
  }
  return buildTemplateReply(outcomes)
}
