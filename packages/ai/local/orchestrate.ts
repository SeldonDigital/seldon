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
import type { FamilyOutcome, TurnContext } from "./turn-context"
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
 * Translates one chat message into workspace actions: one enum-constrained
 * call classifies the message into a v1 intent, code dispatches to that
 * intent's handler, and the handler resolves the action's fields through
 * further narrow calls before committing through the reducer. The caller
 * applies the returned actions; this function never mutates real state.
 *
 * The reply is deterministic: a handler's templated confirmation on success,
 * or the terminating resolver's clarification message -- never a free-text
 * model generation, so the reply can't claim a change the reducer didn't make.
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
    onStep: (name, ok) => {
      input.onEvent?.({ type: "tool", name })
      input.onEvent?.({ type: "toolResult", ok })
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

  const classification = await classifyAction({
    message: input.message,
    scope: input.scope,
    hasSelectedNode: input.selectedNodeId !== undefined,
    model,
  })
  context.calls.push(classification.metrics)
  context.onStep?.("classify_action", classification.kind === "classified")

  if (classification.kind === "message") return finish(classification.text)
  if (input.signal?.aborted) return finish("Stopped.")

  const handler = HANDLERS[classification.intent.intent]
  if (!handler) return finish(NOT_YET)

  const outcome = await handler(context)
  return finish(outcome.kind === "applied" ? outcome.reply : outcome.text)
}
