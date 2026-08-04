import { buildCompletedWorkReplyStage } from "../../prompt/stages/reply"
import { replaceNodeIdsWithWords } from "../node-words"
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
 * The reply is assembled from two halves that are kept apart on purpose. What
 * COMMITTED is phrased by a model call. What did NOT -- a clarification, a
 * refusal, a skipped step -- is carried through verbatim, only with its node
 * ids swapped for plain words. The phrasing call never sees the failing half,
 * so it has no failure to soften, reorder, or restate as a success: a turn
 * that stopped at resolve_target used to come back as "The text in several
 * elements was changed."
 *
 * Nor does it see the REQUEST. Only the handlers' own descriptions of what
 * they wrote reach it, so a step whose handler did something other than what
 * was asked cannot be narrated as though it obeyed (issue 17).
 */

/** One executed step of the plan, with what came of it. */
export interface StepOutcome {
  /** The decomposed, self-contained instruction this step executed. */
  step: string
  /** The intent the classifier assigned, or "skipped" for a none-label. */
  intent: string
  outcome: FamilyOutcome
}

/** A step whose handler committed at least one action. */
type CompletedStep = StepOutcome & {
  outcome: Extract<FamilyOutcome, { kind: "applied" }>
}

/** A step that stopped or was skipped: nothing was written for it. */
type UnresolvedStep = StepOutcome & {
  outcome: Extract<FamilyOutcome, { kind: "message" }>
}

function stepCommittedWork(
  stepOutcome: StepOutcome,
): stepOutcome is CompletedStep {
  return stepOutcome.outcome.kind === "applied"
}

/**
 * Splits the plan by what actually landed. Both halves keep their original
 * step order, so a reply reads in the order the user asked for things.
 */
function partitionByWhatCommitted(stepOutcomes: StepOutcome[]): {
  completed: CompletedStep[]
  unresolved: UnresolvedStep[]
} {
  const completed: CompletedStep[] = []
  const unresolved: UnresolvedStep[] = []
  for (const stepOutcome of stepOutcomes) {
    if (stepCommittedWork(stepOutcome)) completed.push(stepOutcome)
    else unresolved.push(stepOutcome as UnresolvedStep)
  }
  return { completed, unresolved }
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
 * Phrases the committed half of the turn. Throws are swallowed into the
 * template so reply generation can never fail a turn that already did its
 * work.
 */
async function phraseCompletedWork(
  context: TurnContext,
  completed: CompletedStep[],
  options: { requestHasUnfinishedSteps: boolean },
): Promise<string> {
  const { prompt, schema } = buildCompletedWorkReplyStage({
    completions: completed.map(({ outcome }) => ({ body: outcome.reply })),
    requestHasUnfinishedSteps: options.requestHasUnfinishedSteps,
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
    return buildTemplateReply(completed)
  }
}

/**
 * Conversational reply: the committed half phrased by the model, the
 * unresolved half forwarded word for word. A turn where nothing committed
 * makes no model call at all -- there is nothing to phrase, and the resolver
 * messages are already written for the user.
 */
export async function buildConversationalReply(
  context: TurnContext,
  stepOutcomes: StepOutcome[],
): Promise<string> {
  const { completed, unresolved } = partitionByWhatCommitted(stepOutcomes)
  const unresolvedSentences = unresolved.map(({ outcome }) =>
    replaceNodeIdsWithWords(context.state.workspace, outcome.text),
  )

  const nothingCommitted = completed.length === 0
  if (nothingCommitted) {
    const planDidNothingAtAll = unresolvedSentences.length === 0
    if (planDidNothingAtAll) return "Nothing to do."
    return unresolvedSentences.join(" ")
  }

  const phrasedCompletions = await phraseCompletedWork(context, completed, {
    requestHasUnfinishedSteps: unresolvedSentences.length > 0,
  })
  return [phrasedCompletions, ...unresolvedSentences].join(" ")
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
