import type { PromptStage } from "./shared"

/** One executed step of the plan, flattened for the reply prompt. */
export interface ReplyOutcomeLine {
  status: "DONE" | "STOPPED"
  /** The decomposed, self-contained instruction this step executed. */
  step: string
  /** What came of it: the applied reply or the terminal message. */
  body: string
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
    "",
    "Outcomes:",
    ...inputs.outcomes.map(
      (entry, index) =>
        `${index + 1}. [${entry.status}] ${entry.step} -> ${entry.body}`,
    ),
  ].join("\n")
  return { prompt, schema: REPLY_SCHEMA }
}
