import type { PromptStage } from "./shared"

/**
 * One step that committed work. Deliberately carries ONLY what the handler
 * wrote, not the instruction that asked for it. A step's text is the REQUEST,
 * and a handler does not always do what was requested: "rename the second
 * variant to Compact" was classified as `add_variant`, which added a variant
 * and renamed nothing, and the reply narrated both -- a fabricated rename
 * beside a truthful add (issue 17). Given the request, the model describes the
 * request. Given only the effect, it can only describe the effect. Every
 * handler reply names its own action and target, so nothing is lost.
 */
export interface CompletedStepLine {
  /** The handler's description of what it wrote. */
  body: string
}

/**
 * Longest outcome body the reply model sees. Bodies are one- or two-sentence
 * resolver messages; anything longer is machine context that leaked in, and
 * the reply model paraphrases such blobs into hallucinated nonsense
 * (issue 06). Clamping is defense in depth -- the known leak is fixed at its
 * source in resolve-target.
 */
const BODY_LIMIT = 600

function clampBody(body: string): string {
  if (body.length <= BODY_LIMIT) return body
  return `${body.slice(0, BODY_LIMIT)} [...]`
}

const REPLY_SCHEMA = {
  type: "object",
  properties: { message: { type: "string", minLength: 1 } },
  required: ["message"],
}

/**
 * Phrases the part of a turn that COMMITTED. This call is given nothing else:
 * a step that stopped never reaches it, so the reply model has no failure to
 * paraphrase and cannot restate one as a success. Whether the request is
 * finished is a fact the orchestrator knows, so it is passed in rather than
 * inferred from the lines -- a model that sees only successes will otherwise
 * announce the whole request is done.
 */
export function buildCompletedWorkReplyStage(inputs: {
  completions: CompletedStepLine[]
  requestHasUnfinishedSteps: boolean
}): PromptStage {
  const prompt = [
    "You are the chat assistant in a design editor. Summarize the completed edits below for the user in one or two friendly sentences.",
    "State ONLY what the edits below say. Do not add suggestions, do not claim anything else was done.",
    // The bodies name nodes by internal id (component-text-h8EzKcld).
    // Repeating those reads as debug output, and the id means nothing to the
    // user -- they see the element, not its key. Describe it in words instead.
    'Never repeat internal node ids such as "component-text-h8EzKcld". Refer to the element in plain words ("the text", "the icon"), or leave it out.',
    ...(inputs.requestHasUnfinishedSteps
      ? [
          "Other parts of this request did NOT complete. A separate sentence reports those, so cover only the edits below and never say the request is finished or that everything was done.",
        ]
      : []),
    "",
    "What the editor did:",
    ...inputs.completions.map(
      (entry, index) => `${index + 1}. ${clampBody(entry.body)}`,
    ),
  ].join("\n")
  return { prompt, schema: REPLY_SCHEMA }
}
