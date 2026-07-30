import { buildExtractTargetStage } from "../../prompt/stages/extract-target"
import { callOllamaFormat } from "../ollama-client"
import { type TurnContext, recordStep } from "../turn-context"

/**
 * What the message points at: the current selection, or a short search phrase
 * naming a node to find. This is the narrow bridge into target resolution --
 * the model never sees the tree here, it only reads the message. (The
 * embedding-based find_node pipeline replaces the search side of this for
 * spatial/semantic phrasing; the selection/search split stays.)
 */
export type TargetHint =
  | { kind: "selection" }
  | { kind: "search"; match: string }

/**
 * Extracts a target hint from the message with one shallow-union call. A
 * pronoun ("it", "this"), an implicit target, or plain selection-reference
 * resolves to the selection; an explicit name ("the title", "the hero
 * heading") resolves to a short search phrase.
 */
export async function extractTargetHint(
  context: TurnContext,
): Promise<TargetHint> {
  const { prompt, schema } = buildExtractTargetStage({
    message: context.message,
    hasSelection: context.resolved.selectedNodeId !== undefined,
  })

  const { value, metrics } = await callOllamaFormat<TargetHint>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "extract_target", true, {
    prompt,
    output: JSON.stringify(value, null, 2),
  })

  // A search hint with an empty phrase degrades to the selection: there is
  // nothing to search for, and resolve-target reports the miss cleanly.
  if (value.kind === "search" && value.match.trim() === "") {
    return { kind: "selection" }
  }
  return value
}
