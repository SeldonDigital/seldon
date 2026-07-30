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
  const hasSelection = context.resolved.selectedNodeId !== undefined
  const prompt = [
    "A design-editor chat message either refers to the currently selected element or names an element to find.",
    hasSelection
      ? "The user HAS an element selected."
      : "The user has NOTHING selected, so a bare pronoun still needs a search phrase when the message names anything at all.",
    "",
    `Message: ${JSON.stringify(context.message)}`,
    "",
    'If the message uses a pronoun ("it", "this") or names no element, answer {"kind":"selection"}.',
    'If it names an element, answer {"kind":"search","match":"<the shortest phrase naming it, e.g. \'title\' or \'hero heading\'>"}.',
  ].join("\n")

  const { value, metrics } = await callOllamaFormat<TargetHint>({
    model: context.model,
    host: context.host,
    prompt,
    schema: {
      type: "object",
      oneOf: [
        {
          properties: { kind: { const: "selection" } },
          required: ["kind"],
        },
        {
          properties: {
            kind: { const: "search" },
            match: { type: "string" },
          },
          required: ["kind", "match"],
        },
      ],
    },
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
