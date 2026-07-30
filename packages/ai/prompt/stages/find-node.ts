import type { PromptStage } from "./shared"

/** One board node offered to the escalation pick: its id and summary text. */
export interface FindNodeCandidate {
  id: string
  text: string
}

/** The shared `- id: text` rendering, so prompt and miss message agree. */
function candidateLines(pool: readonly FindNodeCandidate[]): string {
  return pool.map((candidate) => `- ${candidate.id}: ${candidate.text}`).join("\n")
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

/** The terminal clarification for a "none" pick, listing the near misses. */
export function findNodeMissMessage(
  query: string,
  pool: readonly FindNodeCandidate[],
): string {
  return `I couldn't confidently match "${query}" to an element on this board. The closest candidates were:\n${candidateLines(
    pool.slice(0, 5),
  )}\nTell me which one you mean, or select it on the canvas.`
}
