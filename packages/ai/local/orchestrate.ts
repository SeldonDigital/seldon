import { resolveModelId } from "../shared/model-thinking"
import type {
  AgentMetrics,
  ChatToActionsInput,
  ChatToActionsResult,
} from "../types"
import {
  executeAddComponent,
  executeAddSandbox,
  executeAddVariant,
  executeInsertVariantInstance,
} from "./actions/add-insert"
import { executeComposition } from "./actions/composition"
import { executeTranslate } from "./actions/content"
import {
  executeFontFamilyPreset,
  executeFontFamilyVariant,
  executeIconOverride,
  executeIconSubcategoryPreset,
} from "./actions/fonts-icons"
import { executeMove, executeReorder } from "./actions/ordering"
import {
  executeResetProperty,
  executeSetLabel,
  executeSetProperties,
} from "./actions/properties"
import {
  executeDuplicate,
  executeRemoveComponent,
  executeRemoveInstance,
} from "./actions/remove-duplicate"
import {
  executeAddCustomToken,
  executeAddTheme,
  executeSetComponentTheme,
  executeSetNodeTheme,
  executeSetThemeOverride,
} from "./actions/theme"
import { buildTurnContext, resolveContext } from "./editor-context"
import type { OllamaCallMetrics } from "./ollama-client"
import { classifyAction } from "./resolvers/classify-action"
import { decompose } from "./resolvers/decompose"
import { type StepOutcome, generateReply } from "./resolvers/reply"
import { route } from "./resolvers/route"
import {
  type FamilyOutcome,
  type TurnContext,
  isClarification,
  recordStep,
} from "./turn-context"
import { createTurnState } from "./turn-state"

/** Family handlers by intent key. Intents without one terminate politely below. */
const FAMILY_HANDLERS_BY_INTENT: Record<
  string,
  (context: TurnContext) => Promise<FamilyOutcome>
> = {
  set_node_properties: executeSetProperties,
  reset_node_property: executeResetProperty,
  set_node_label: executeSetLabel,
  remove_instance: executeRemoveInstance,
  remove_component: executeRemoveComponent,
  duplicate_node: executeDuplicate,
  add_component: executeAddComponent,
  add_variant: executeAddVariant,
  insert_variant_instance: executeInsertVariantInstance,
  add_sandbox: executeAddSandbox,
  move_instance: executeMove,
  reorder_instance: executeReorder,
  add_theme: executeAddTheme,
  set_theme_override: executeSetThemeOverride,
  set_component_theme: executeSetComponentTheme,
  set_node_theme: executeSetNodeTheme,
  add_theme_custom_token: executeAddCustomToken,
  set_font_collection_family_preset: executeFontFamilyPreset,
  set_font_collection_family_variant: executeFontFamilyVariant,
  set_icon_set_subcategory_preset: executeIconSubcategoryPreset,
  set_icon_set_override: executeIconOverride,
  translate: executeTranslate,
  compose_component: executeComposition,
}

const UNSUPPORTED_INTENT_REPLY =
  "I can't do that edit yet in this version. I can change or reset properties, rename, remove or duplicate elements and components."

const CANCELLED_REPLY = "Stopped."

const MS_PER_SECOND = 1000

/**
 * Totals every model call this turn in one pass, so the turn's metrics read as
 * one named aggregation rather than four separate folds over the same array.
 */
function sumCallMetrics(calls: OllamaCallMetrics[]): {
  promptTokens: number
  outputTokens: number
  generationMs: number
  loadMs: number
} {
  return calls.reduce(
    (totals, call) => ({
      promptTokens: totals.promptTokens + call.promptTokens,
      outputTokens: totals.outputTokens + call.outputTokens,
      generationMs: totals.generationMs + call.evalDurationMs,
      loadMs: totals.loadMs + call.loadDurationMs,
    }),
    { promptTokens: 0, outputTokens: 0, generationMs: 0, loadMs: 0 },
  )
}

/**
 * Translates one chat message into workspace actions through the hari-style
 * flow, unbundled into narrow stages: route decides reply-vs-process,
 * decompose rewrites the message into self-contained steps, each step is
 * classified with the existing intent classifier and executed by its family
 * handler against the working copy -- sequentially, so a later step sees the
 * nodes an earlier one created -- and the reply is assembled from the
 * structured outcomes (templates by default; SELDON_AI_REPLY_MODE=
 * conversational opts into the terminus-style phrasing call).
 *
 * A step that terminates with a clarification stops the plan there: what
 * committed stays committed, and the reply reports both the done and the
 * stopped steps. No retries anywhere. The caller applies the returned
 * working copy; this function never mutates real state.
 */
export async function chatToActions(
  input: ChatToActionsInput,
): Promise<ChatToActionsResult> {
  const turnStartedMs = Date.now()
  const turnState = createTurnState(input.workspace)
  const resolvedContext = resolveContext(input)
  const modelId = resolveModelId(input.model)

  const context: TurnContext = {
    state: turnState,
    resolved: resolvedContext,
    message: input.message,
    model: modelId,
    calls: [],
    steps: [],
    onStep: (name, detail) => {
      input.onEvent?.({ type: "tool", name, prompt: detail.prompt })
      input.onEvent?.({
        type: "toolResult",
        ok: detail.ok,
        output: detail.output,
      })
    },
  }

  const finish = (reply: string): ChatToActionsResult => {
    input.onEvent?.({ type: "text", delta: reply })
    const totals = sumCallMetrics(context.calls)
    const modelGeneratedTokens = totals.generationMs > 0
    const metrics: AgentMetrics = {
      model: modelId,
      calls: context.calls.length,
      totalMs: Date.now() - turnStartedMs,
      loadMs: totals.loadMs,
      promptTokens: totals.promptTokens,
      outputTokens: totals.outputTokens,
      outputTokensPerSecond: modelGeneratedTokens
        ? totals.outputTokens / (totals.generationMs / MS_PER_SECOND)
        : undefined,
    }
    return {
      actions: turnState.actions,
      workspace: turnState.workspace,
      reply,
      ineffective: turnState.ineffective,
      rejected: turnState.rejected,
      debug: {
        context: buildTurnContext(resolvedContext),
        rawResponse: reply,
        repairs: turnState.repairs,
        toolCalls: context.steps.length > 0 ? context.steps : undefined,
        metrics,
      },
    }
  }

  // Cooperative cancellation: between stages only for now. In-flight fetches
  // run to completion; threading AbortSignal into the Ollama calls is a
  // follow-up.
  const turnWasCancelled = (): boolean => input.signal?.aborted === true
  if (turnWasCancelled()) return finish(CANCELLED_REPLY)

  // Stage 1: route. Conversation gets its answer from this same call and the
  // turn ends with zero actions.
  const routeDecision = await route(context, input.history)
  const routeChoseConversation = routeDecision.kind === "reply"
  if (routeChoseConversation) return finish(routeDecision.message)
  if (turnWasCancelled()) return finish(CANCELLED_REPLY)

  // Stage 2: decompose into self-contained steps (a single instruction comes
  // back as one step, making this path a superset of single-action behavior).
  const plannedSteps = await decompose(context, input.history)
  if (turnWasCancelled()) return finish(CANCELLED_REPLY)

  // Stage 3: classify and execute each step in order against the working
  // copy. A clarification or rejection stops the plan; committed steps stay.
  const stepOutcomes: StepOutcome[] = []
  const planHasMultipleSteps = plannedSteps.length > 1
  for (const [stepIndex, step] of plannedSteps.entries()) {
    if (turnWasCancelled()) break
    const stepLabel = planHasMultipleSteps
      ? `classify-action ${stepIndex + 1}/${plannedSteps.length}`
      : "classify-action"
    context.message = step

    const classification = await classifyAction({
      message: step,
      scope: input.scope,
      hasSelectedNode: input.selectedNodeId !== undefined,
      model: modelId,
    })
    context.calls.push(classification.metrics)

    const stepIsNotAnEdit = isClarification(classification)
    if (stepIsNotAnEdit) {
      // A none-label on a decomposed step is noise, not an edit: note it and
      // move on rather than stopping a plan over it.
      recordStep(context, stepLabel, {
        ok: false,
        prompt: classification.prompt,
        output: classification.text,
      })
      stepOutcomes.push({
        step,
        intent: "skipped",
        outcome: {
          kind: "message",
          text: `Skipped "${step}" -- it doesn't look like a design edit.`,
        },
      })
      continue
    }

    const intentKey = classification.intent.intent
    recordStep(context, stepLabel, {
      ok: true,
      prompt: classification.prompt,
      output: intentKey,
    })

    const familyHandler = FAMILY_HANDLERS_BY_INTENT[intentKey]
    const outcome: FamilyOutcome = familyHandler
      ? await familyHandler(context)
      : { kind: "message", text: UNSUPPORTED_INTENT_REPLY }
    stepOutcomes.push({ step, intent: intentKey, outcome })

    // A stop is terminal for the REST of the plan: later steps may depend on
    // this one having happened, so continuing would compound the miss.
    const stepStoppedThePlan = isClarification(outcome)
    if (stepStoppedThePlan) break
  }

  return finish(await generateReply(context, stepOutcomes))
}
