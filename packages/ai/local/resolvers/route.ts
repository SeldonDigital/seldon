import { buildRouteStage } from "../../prompt/stages/route"
import type { ChatMessage } from "../../types"
import { callOllamaFormat } from "../ollama-client"
import { type TurnContext, recordStep } from "../turn-context"

/**
 * The entry decision of a turn, unbundled from terminus's ConversationalHari:
 * one shallow-union call decides whether the message is conversation (answer
 * it directly, no processing) or a design edit (hand it to decomposition).
 * This is deliberately the ONLY judgment this call makes -- segmentation,
 * rewriting, and action labeling are separate narrower calls, so a small
 * model never faces CH's bundled four-judgments-at-once task.
 */
export type RouteDecision =
  | { kind: "reply"; message: string }
  | { kind: "process" }

/** Routes one message: conversational reply, or on to processing. */
export async function route(context: TurnContext, history?: ChatMessage[]) {
  const { prompt, schema } = buildRouteStage({
    message: context.message,
    history,
  })
  const { value: routeDecision, metrics } =
    await callOllamaFormat<RouteDecision>({
      model: context.model,
      host: context.host,
      prompt,
      schema,
    })
  context.calls.push(metrics)
  recordStep(context, "route", {
    ok: true,
    prompt,
    output: JSON.stringify(routeDecision, null, 2),
  })
  return routeDecision
}
