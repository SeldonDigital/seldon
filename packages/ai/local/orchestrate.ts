import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"

import { nodeStringsSummary } from "../prompt/context-sections/node-strings"
import { resolveModelId } from "../shared/model-thinking"
import type {
  AgentMetrics,
  ChatToActionsInput,
  ChatToActionsResult,
  MessageReason,
  PendingClarification,
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

  const finish = (
    reply: string,
    clarification?: PendingClarification,
  ): ChatToActionsResult => {
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
      clarification,
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

  // Plain-word descriptions of the previous ask's pick list, deterministic
  // and workspace-grounded, so a "which ones can I choose from?" follow-up
  // is answered from the real candidates rather than improvised.
  const pendingCandidates = (input.pendingClarification?.candidateIds ?? [])
    .map((nodeId) => {
      const node = input.workspace.nodes[nodeId]
      if (!node) return undefined
      const parts = [
        getNodeCatalogId(node, input.workspace) ?? "",
        node.label ?? "",
        nodeStringsSummary(input.workspace, nodeId),
      ].filter((part) => part !== "")
      return parts.length > 0 ? parts.join(", ") : undefined
    })
    .filter((entry): entry is string => entry !== undefined)

  // Clarification guard, enforced in code rather than left to the router's
  // judgment: when the previous turn ended by asking which element was meant
  // and the user now has a node selected, the selection IS the answer -- the
  // message ("this one", a name) goes straight to processing. The router
  // cannot see selections, so asking it would risk answering the user's
  // answer with another question (issue 02).
  const selectionAnswersPendingClarification =
    input.pendingClarification !== undefined &&
    input.selectedNodeId !== undefined
  // Stage 1: route. Conversation gets its answer from this same call and the
  // turn ends with zero actions.
  const routeDecision = selectionAnswersPendingClarification
    ? ({ kind: "process" } as const)
    : await route(
        context,
        input.history,
        pendingCandidates.length > 0 ? pendingCandidates : undefined,
      )
  if (selectionAnswersPendingClarification) {
    recordStep(context, "route", {
      ok: true,
      output:
        "Skipped the router: the previous turn asked which element was meant and a node is now selected, so the selection answers it (deterministic, no model call).",
    })
  }
  const routeChoseConversation = routeDecision.kind === "reply"
  // A conversational aside ("which ones can I choose from?") does not answer
  // a pending ask -- carry it forward so selecting an element on the NEXT
  // message still counts as the answer.
  if (routeChoseConversation)
    return finish(routeDecision.message, input.pendingClarification)
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
    context.calls.push(...classification.metrics)

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
      // Both picks, so a family chosen right with the member chosen wrong (or
      // the reverse) is readable in the transcript instead of looking like one
      // opaque answer.
      output: `${classification.family} -> ${intentKey}`,
    })

    const familyHandler = FAMILY_HANDLERS_BY_INTENT[intentKey]
    const committedActionsBeforeStep = turnState.actions.length
    const handlerOutcome: FamilyOutcome = familyHandler
      ? await familyHandler(context)
      : { kind: "message", text: UNSUPPORTED_INTENT_REPLY }

    // `commit` is the only writer of `turnState.actions`, and it throws unless
    // the working copy really changed -- so the action count is ground truth
    // for "something happened". A handler that answers `applied` without one
    // is claiming work the document never got, and the reply would repeat the
    // claim. Audited here rather than trusted, because that lie is invisible:
    // the user sees a confident sentence and an unchanged canvas.
    const handlerClaimedSuccess = handlerOutcome.kind === "applied"
    const stepWroteNothing =
      turnState.actions.length === committedActionsBeforeStep
    const handlerClaimedWorkItDidNotDo =
      handlerClaimedSuccess && stepWroteNothing
    if (handlerClaimedWorkItDidNotDo) {
      recordStep(context, "commit-audit", {
        ok: false,
        output: `${intentKey} reported "${handlerOutcome.reply}" but committed no action; reporting it as unchanged.`,
      })
    }
    const outcome: FamilyOutcome = handlerClaimedWorkItDidNotDo
      ? {
          kind: "message",
          text: `Nothing changed for "${step}": the edit reported success but wrote nothing to the document.`,
        }
      : handlerOutcome
    stepOutcomes.push({ step, intent: intentKey, outcome })

    // A stop is terminal for the REST of the plan: later steps may depend on
    // this one having happened, so continuing would compound the miss.
    const stepStoppedThePlan = isClarification(outcome)
    if (stepStoppedThePlan) break
  }

  // When the turn ended in an ask, surface it as data so the editor can echo
  // it back next turn (the guard above) and the reply layer can list real
  // candidates instead of improvising.
  const lastOutcome = stepOutcomes[stepOutcomes.length - 1]?.outcome
  const turnEndedInAsk =
    lastOutcome !== undefined &&
    lastOutcome.kind === "message" &&
    lastOutcome.reason !== undefined
  const clarification: PendingClarification | undefined = turnEndedInAsk
    ? {
        reason: lastOutcome.reason as MessageReason,
        candidateIds: lastOutcome.candidateIds,
      }
    : undefined

  return finish(await generateReply(context, stepOutcomes), clarification)
}
