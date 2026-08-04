import type { PromptStage } from "./shared"

/** One board node offered to the escalation pick: its id and summary text. */
export interface FindNodeCandidate {
  id: string
  text: string
}

/**
 * The `- id: text` rendering the PICK prompt needs: the model answers with an
 * id, so it has to see them. A user never does -- the miss message below takes
 * plain-word descriptions instead. These two renderings used to be one shared
 * helper, which is how the embedding descriptor
 * (`chip, Chip, content="Assist", position: row 1`) ended up in a sentence
 * addressed to a person.
 */
function candidateLines(pool: readonly FindNodeCandidate[]): string {
  return pool
    .map((candidate) => `- ${candidate.id}: ${candidate.text}`)
    .join("\n")
}

/**
 * One enum-constrained pick over a small labeled candidate list. The schema's
 * id enum is exactly the candidates the prompt listed, plus "none".
 */
export function buildFindNodeEscalateStage(inputs: {
  query: string
  pool: readonly FindNodeCandidate[]
}): PromptStage {
  const prompt = [
    `Which element does "${inputs.query}" refer to?`,
    "",
    "Candidates:",
    candidateLines(inputs.pool),
    "",
    'Pick the matching id, or "none" when none of them fits.',
  ].join("\n")
  return {
    prompt,
    schema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          enum: [...inputs.pool.map((candidate) => candidate.id), "none"],
        },
      },
      required: ["id"],
    },
  }
}

/** Most near misses the user is asked to choose between. */
const MISS_LIST_LIMIT = 5

/**
 * The terminal clarification for a "none" pick, listing the near misses. Takes
 * descriptions already phrased for a reader, not candidates: this message goes
 * to the user verbatim.
 */
export function findNodeMissMessage(
  query: string,
  candidateDescriptions: readonly string[],
): string {
  const bulletedNearMisses = candidateDescriptions
    .slice(0, MISS_LIST_LIMIT)
    .map((description) => `- ${description}`)
    .join("\n")
  return `I couldn't confidently match "${query}" to an element on this board. The closest were:\n${bulletedNearMisses}\nTell me which one you mean, or select it on the canvas and ask again.`
}
