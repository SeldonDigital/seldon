import type { ChatMessage } from "../../types"

/**
 * One LLM call's inputs, built together by a pure stage builder: the prompt
 * text and the `format` schema handed to callOllamaFormat. Kept as one value
 * because roughly half the stages derive schema enums/bounds from the same
 * data the prompt renders -- returning them together makes that lockstep
 * impossible to break from a call site.
 */
export interface PromptStage {
  prompt: string
  schema: Record<string, unknown>
}

/** Compact `role: content` block for the prompt, mirroring the old harness. */
export function historyBlock(history?: ChatMessage[]): string {
  const thereIsNoHistoryYet = !history || history.length === 0
  if (thereIsNoHistoryYet) return ""
  const turnLines = history.map((turn) => `${turn.role}: ${turn.content}`)
  return `Conversation so far:\n${turnLines.join("\n")}\n\n`
}
