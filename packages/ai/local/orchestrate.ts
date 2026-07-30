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
import { classifyAction } from "./resolvers/classify-action"
import { decompose } from "./resolvers/decompose"
import { type StepOutcome, generateReply } from "./resolvers/reply"
import { route } from "./resolvers/route"
import {
  type FamilyOutcome,
  type TurnContext,
  recordStep,
} from "./turn-context"
import { createTurnState } from "./turn-state"

/** Family handlers by intent key. Intents without one terminate politely below. */
const HANDLERS: Record<
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

const NOT_YET =
  "I can't do that edit yet in this version. I can change or reset properties, rename, remove or duplicate elements and components."

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
  const started = Date.now()
  const state = createTurnState(input.workspace)
  const resolved = resolveContext(input)
  const model = resolveModelId(input.model)

  const context: TurnContext = {
    state,
    resolved,
    message: input.message,
    model,
    calls: [],
    steps: [],
    onStep: (name, ok, detail) => {
      input.onEvent?.({ type: "tool", name, prompt: detail?.prompt })
      input.onEvent?.({ type: "toolResult", ok, output: detail?.output })
    },
  }

  const finish = (reply: string): ChatToActionsResult => {
    input.onEvent?.({ type: "text", delta: reply })
    const outputTokens = context.calls.reduce(
      (sum, call) => sum + call.outputTokens,
      0,
    )
    const generationMs = context.calls.reduce(
      (sum, call) => sum + call.evalDurationMs,
      0,
    )
    const metrics: AgentMetrics = {
      model,
      calls: context.calls.length,
      totalMs: Date.now() - started,
      loadMs: context.calls.reduce((sum, call) => sum + call.loadDurationMs, 0),
      promptTokens: context.calls.reduce(
        (sum, call) => sum + call.promptTokens,
        0,
      ),
      outputTokens,
      outputTokensPerSecond:
        generationMs > 0 ? outputTokens / (generationMs / 1000) : undefined,
    }
    return {
      actions: state.actions,
      workspace: state.workspace,
      reply,
      ineffective: state.ineffective,
      rejected: state.rejected,
      debug: {
        context: buildTurnContext(resolved),
        rawResponse: reply,
        repairs: state.repairs,
        toolCalls: context.steps.length > 0 ? context.steps : undefined,
        metrics,
      },
    }
  }

  // Cooperative cancellation: between stages only for now. In-flight fetches
  // run to completion; threading AbortSignal into the Ollama calls is a
  // follow-up.
  if (input.signal?.aborted) return finish("Stopped.")

  // Stage 1: route. Conversation gets its answer from this same call and the
  // turn ends with zero actions.
  const decision = await route(context, input.history)
  if (decision.kind === "reply") return finish(decision.message)
  if (input.signal?.aborted) return finish("Stopped.")

  // Stage 2: decompose into self-contained steps (a single instruction comes
  // back as one step, making this path a superset of single-action behavior).
  const steps = await decompose(context, input.history)
  if (input.signal?.aborted) return finish("Stopped.")

  // Stage 3: classify and execute each step in order against the working
  // copy. A clarification or rejection stops the plan; committed steps stay.
  const outcomes: StepOutcome[] = []
  for (const [index, step] of steps.entries()) {
    if (input.signal?.aborted) break
    const stepLabel =
      steps.length > 1
        ? `classify-action ${index + 1}/${steps.length}`
        : "classify-action"
    context.message = step

    const classification = await classifyAction({
      message: step,
      scope: input.scope,
      hasSelectedNode: input.selectedNodeId !== undefined,
      model,
    })
    context.calls.push(classification.metrics)

    if (classification.kind === "message") {
      // A none-label on a decomposed step is noise, not an edit: note it and
      // move on rather than stopping a plan over it.
      recordStep(context, stepLabel, false, {
        prompt: classification.prompt,
        output: classification.text,
      })
      outcomes.push({
        step,
        intent: "skipped",
        outcome: {
          kind: "message",
          text: `Skipped "${step}" -- it doesn't look like a design edit.`,
        },
      })
      continue
    }

    const intent = classification.intent.intent
    recordStep(context, stepLabel, true, {
      prompt: classification.prompt,
      output: intent,
    })

    const handler = HANDLERS[intent]
    const outcome: FamilyOutcome = handler
      ? await handler(context)
      : { kind: "message", text: NOT_YET }
    outcomes.push({ step, intent, outcome })

    // A stop is terminal for the REST of the plan: later steps may depend on
    // this one having happened, so continuing would compound the miss.
    if (outcome.kind === "message") break
  }

  return finish(await generateReply(context, outcomes))
}
