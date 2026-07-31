import { buildConversationalReplyStage } from "../../prompt/stages/reply"
import { callOllamaFormat } from "../ollama-client"
import {
  type FamilyOutcome,
  type TurnContext,
  recordStep,
} from "../turn-context"

/**
 * The user-facing reply for a completed turn, ported from terminus's
 * confirmation/error conversational calls. Conversational phrasing is the
 * default (SELDON_AI_REPLY_MODE=template forces the deterministic form),
 * because the template exposes raw node ids -- "Set content to "Go" on
 * component-text-ac6JiaK3." -- which reads as debug output, not an answer.
 *
 * Two safety properties make generating this text safe: the call only ever
 * sees the structured outcomes of what actually committed, so it cannot claim
 * work that never happened, and any failure of the call itself falls back to
 * the template, so reply phrasing can never fail a turn that did its work.
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
export function buildTemplateReply(stepOutcomes: StepOutcome[]): string {
  const planDidNothing = stepOutcomes.length === 0
  if (planDidNothing) return "Nothing to do."

  const planHadOneStep = stepOutcomes.length === 1
  if (planHadOneStep) {
    const onlyOutcome = stepOutcomes[0]!.outcome
    const onlyStepApplied = onlyOutcome.kind === "applied"
    return onlyStepApplied ? onlyOutcome.reply : onlyOutcome.text
  }

  const numberedLines = stepOutcomes.map(({ outcome }, stepIndex) => {
    const stepApplied = outcome.kind === "applied"
    const outcomeText = stepApplied ? outcome.reply : outcome.text
    return `${stepIndex + 1}. ${outcomeText}`
  })
  return numberedLines.join("\n")
}

/**
 * Conversational reply: one call given only the structured outcomes. Throws
 * are swallowed into the template so reply generation can never fail a turn
 * that already did its work.
 */
export async function buildConversationalReply(
  context: TurnContext,
  stepOutcomes: StepOutcome[],
): Promise<string> {
  const templateReply = buildTemplateReply(stepOutcomes)
  const { prompt, schema } = buildConversationalReplyStage({
    outcomes: stepOutcomes.map(({ step, outcome }) => {
      const stepApplied = outcome.kind === "applied"
      return {
        status: stepApplied ? "DONE" : "STOPPED",
        step,
        body: stepApplied ? outcome.reply : outcome.text,
      }
    }),
  })
  try {
    const { value: replyAnswer, metrics } = await callOllamaFormat<{
      message: string
    }>({
      model: context.model,
      host: context.host,
      prompt,
      schema,
    })
    context.calls.push(metrics)
    recordStep(context, "reply", {
      ok: true,
      prompt,
      output: replyAnswer.message,
    })
    return replyAnswer.message
  } catch {
    recordStep(context, "reply", {
      ok: false,
      prompt,
      output: "The reply call failed; fell back to the template reply.",
    })
    return templateReply
  }
}

/**
 * True unless the deterministic template mode is forced via env. Defaults on:
 * the template's raw node ids read as debug output next to the rest of the
 * chat, and the phrasing call is grounded in committed outcomes only.
 */
export function conversationalRepliesEnabled(): boolean {
  return process.env.SELDON_AI_REPLY_MODE !== "template"
}

/** The turn's reply, honoring the mode switch. */
export async function generateReply(
  context: TurnContext,
  stepOutcomes: StepOutcome[],
): Promise<string> {
  if (conversationalRepliesEnabled()) {
    return buildConversationalReply(context, stepOutcomes)
  }
  return buildTemplateReply(stepOutcomes)
}
