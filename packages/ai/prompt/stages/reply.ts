import type { PromptStage } from "./shared"

/** One executed step of the plan, flattened for the reply prompt. */
export interface ReplyOutcomeLine {
  status: "DONE" | "STOPPED"
  /** The decomposed, self-contained instruction this step executed. */
  step: string
  /** What came of it: the applied reply or the terminal message. */
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
 * Conversational turn summary. The call only ever sees the structured
 * outcomes -- what committed and what stopped the plan -- so it cannot claim
 * work that never happened.
 */
export function buildConversationalReplyStage(inputs: {
  outcomes: ReplyOutcomeLine[]
}): PromptStage {
  const prompt = [
    "You are the chat assistant in a design editor. Summarize this turn's outcome for the user in one or two friendly sentences.",
    "State ONLY what the outcomes below say. Do not add suggestions, do not claim anything else was done.",
    // The outcome bodies name nodes by internal id (component-text-h8EzKcld).
    // Repeating those reads as debug output, and the id means nothing to the
    // user -- they see the element, not its key. Describe it in words instead.
    'Never repeat internal node ids such as "component-text-h8EzKcld". Refer to the element in plain words ("the text", "the icon"), or leave it out.',
    "",
    "Outcomes:",
    ...inputs.outcomes.map(
      (entry, index) =>
        `${index + 1}. [${entry.status}] ${entry.step} -> ${clampBody(entry.body)}`,
    ),
  ].join("\n")
  return { prompt, schema: REPLY_SCHEMA }
}
