import { chatToActionsPi, warmModelPi } from "./pi/orchestrate"
import type {
  AgentMetrics,
  ChatToActionsInput,
  ChatToActionsResult,
} from "./types"

/**
 * Translates a chat message into workspace actions through the Pi tool-calling
 * loop. The caller applies the returned actions; this function never mutates
 * state.
 */
export async function chatToActions(
  input: ChatToActionsInput,
): Promise<ChatToActionsResult> {
  return chatToActionsPi(input)
}

/**
 * Loads the model and prefills the system prompt without running a turn, so the
 * first real turn skips the cold load. Returns the warm-up metrics for logging.
 */
export async function warmModel(options?: {
  model?: string
  host?: string
}): Promise<AgentMetrics> {
  return warmModelPi(options)
}
