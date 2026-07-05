import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"
import {
  getLoadedModelInfo,
  ollamaChat,
  type OllamaChatMessage,
  type OllamaChatMetrics,
} from "./ollama-client"
import { buildContext } from "./prompt/build-context"
import { buildSystemPrompt } from "./prompt/system-prompt"
import {
  normalizeActions,
  type ActionRepair,
} from "./repair/normalize-actions"
import { ALL_ACTION_TYPES, RESPONSE_FORMAT } from "./schema/action-schema"
import type { AgentMetrics, ChatToActionsInput, ChatToActionsResult } from "./types"

const KNOWN_ACTION_TYPES = new Set(ALL_ACTION_TYPES)

interface AgentEnvelope {
  reply?: string
  actions?: WorkspaceAction[]
}

function parseEnvelope(raw: string): AgentEnvelope {
  try {
    return JSON.parse(raw) as AgentEnvelope
  } catch {
    throw new Error(
      `Model did not return valid JSON. Raw response: ${raw.slice(0, 500)}`,
    )
  }
}

/**
 * Turns a raw model response into a repaired, known-type action list. Drops
 * hallucinated action types, then runs the deterministic shape repair pass so
 * common shape mistakes never reach the reducer.
 */
function actionsFromRaw(raw: string): {
  reply: string
  actions: WorkspaceAction[]
  repairs: ActionRepair[]
} {
  const envelope = parseEnvelope(raw)
  const parsed = Array.isArray(envelope.actions) ? envelope.actions : []
  const known = parsed.filter((action) => KNOWN_ACTION_TYPES.has(action?.type))
  const { actions, repairs } = normalizeActions(known)
  return {
    reply: typeof envelope.reply === "string" ? envelope.reply : "",
    actions,
    repairs,
  }
}

/**
 * Dry-runs each action through the reducer against a working copy so later
 * actions that depend on earlier ones still validate. Returns one reason string
 * per action the reducer rejected. No-op actions are not rejections.
 */
function collectRejections(
  workspace: Workspace,
  actions: readonly WorkspaceAction[],
): string[] {
  let current = workspace
  const reasons: string[] = []
  for (const action of actions) {
    try {
      current = applyActions(current, [action])
    } catch (caught) {
      reasons.push(
        `${action.type}: ${caught instanceof Error ? caught.message : "invalid action"}`,
      )
    }
  }
  return reasons
}

const NS_PER_MS = 1_000_000
const NS_PER_S = 1_000_000_000

function sum(values: (number | undefined)[]): number {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0)
}

/** Aggregates per-call Ollama metrics and the loaded-model memory into one summary. */
function summarizeMetrics(
  calls: OllamaChatMetrics[],
  modelInfo?: { size?: number; sizeVram?: number },
): AgentMetrics {
  const evalCount = sum(calls.map((call) => call.evalCount))
  const evalDuration = sum(calls.map((call) => call.evalDuration))
  return {
    model: calls[0]?.model ?? "unknown",
    calls: calls.length,
    totalMs: sum(calls.map((call) => call.totalDuration)) / NS_PER_MS,
    loadMs: sum(calls.map((call) => call.loadDuration)) / NS_PER_MS,
    promptTokens: sum(calls.map((call) => call.promptEvalCount)),
    outputTokens: evalCount,
    outputTokensPerSecond:
      evalDuration > 0 ? evalCount / (evalDuration / NS_PER_S) : undefined,
    modelSizeBytes: modelInfo?.size,
    modelVramBytes: modelInfo?.sizeVram,
  }
}

/** Prompt for the single corrective call, listing the reducer's rejections. */
function correctionPrompt(reasons: string[]): string {
  return `The editor validated your actions against the workspace and rejected some of them. Return the full corrected JSON envelope with the same shape. Fix only the rejected actions and keep the rest unchanged. Use the property value shapes from the context. Rejections:\n${reasons
    .map((reason) => `- ${reason}`)
    .join("\n")}`
}

/**
 * Single-shot translation of a chat message into workspace actions, with a
 * deterministic repair pass and at most one corrective round-trip. Builds a
 * compact grounding context, calls the local model with a schema-constrained
 * response format, repairs common shape mistakes, then dry-runs the actions
 * through the reducer. If core rejects any, it makes one corrective call (as a
 * chat continuation, so the shared prefix stays in the KV cache) with the
 * rejection reasons. The caller applies the returned actions; this function
 * never mutates state.
 */
export async function chatToActions(
  input: ChatToActionsInput,
): Promise<ChatToActionsResult> {
  const context = buildContext(input.workspace, {
    activeBoardKey: input.activeBoardKey,
    selectedNodeId: input.selectedNodeId,
    selectedNodeRootId: input.selectedNodeRootId,
  })

  const messages: OllamaChatMessage[] = [
    { role: "system", content: buildSystemPrompt() },
  ]

  for (const turn of input.history ?? []) {
    messages.push({ role: turn.role, content: turn.content })
  }

  messages.push({
    role: "user",
    content: `Current design context:\n${context}\n\nUser request: ${input.message}`,
  })

  const { content: raw, metrics: firstMetrics } = await ollamaChat({
    model: input.model,
    messages,
    format: RESPONSE_FORMAT,
  })

  const first = actionsFromRaw(raw)
  let reply = first.reply
  let actions = first.actions
  const repairs = [...first.repairs]
  const callMetrics: OllamaChatMetrics[] = [firstMetrics]

  const rejections = collectRejections(input.workspace, actions)

  let correction: ChatToActionsResult["debug"]["correction"]
  if (rejections.length > 0) {
    const { content: correctiveRaw, metrics: secondMetrics } = await ollamaChat({
      model: input.model,
      messages: [
        ...messages,
        { role: "assistant", content: raw },
        { role: "user", content: correctionPrompt(rejections) },
      ],
      format: RESPONSE_FORMAT,
    })

    const second = actionsFromRaw(correctiveRaw)
    if (second.reply) reply = second.reply
    actions = second.actions
    repairs.push(...second.repairs)
    callMetrics.push(secondMetrics)
    correction = { reasons: rejections, rawResponse: correctiveRaw }
  }

  const modelInfo = await getLoadedModelInfo(input.model)
  const metrics = summarizeMetrics(callMetrics, modelInfo)

  return {
    actions,
    reply,
    debug: { context, rawResponse: raw, repairs, correction, metrics },
  }
}
