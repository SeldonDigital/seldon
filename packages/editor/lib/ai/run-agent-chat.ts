import type { AgentDebug, AgentMetrics, ChatMessage } from "@seldon/ai"
import type {
  BoardKey,
  Workspace,
  WorkspaceAction,
} from "@seldon/core/workspace/types"

export type AgentChatRequest = {
  workspace: Workspace
  message: string
  history?: ChatMessage[]
  activeBoardKey?: BoardKey
  selectedNodeId?: string
  selectedNodeRootId?: string
}

export type AgentChatResponse = {
  actions: WorkspaceAction[]
  reply: string
  debug: AgentDebug
}

/**
 * Posts a chat message and the current workspace to the local `/api/agent`
 * route, which runs the AI agent in Node and returns the actions to apply. The
 * route reads the workspace for grounding only; the editor applies the actions.
 */
export async function runAgentChat(
  request: AgentChatRequest,
): Promise<AgentChatResponse> {
  const response = await fetch("/api/agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    let message = "Agent request failed."
    try {
      const data = (await response.json()) as { error?: string }
      if (data?.error) message = data.error
    } catch {
      // Response was not JSON; keep the default message.
    }
    throw new Error(message)
  }

  return (await response.json()) as AgentChatResponse
}

export type WarmResponse = {
  ok: true
  metrics: AgentMetrics
}

/**
 * Asks the local agent to load the model and prefill the system prompt via
 * `/api/agent/warm`, so the first real turn skips the cold load. Fire and forget
 * from the UI; the returned metrics are logged when AI Logging is on.
 */
export async function warmAgent(): Promise<WarmResponse> {
  const response = await fetch("/api/agent/warm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  })
  if (!response.ok) {
    throw new Error("Agent warm-up failed.")
  }
  return (await response.json()) as WarmResponse
}
