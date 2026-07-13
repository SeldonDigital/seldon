import type {
  AgentDebug,
  AgentMetrics,
  AgentStreamEvent,
  ChatMessage,
  SelectionScope,
  ThinkingLevelOption,
} from "@seldon/ai"
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
  selectedBoardId?: BoardKey
  scope?: SelectionScope
  resourceTargetId?: string
  model?: string
  thinkingLevel?: ThinkingLevelOption
  noThink?: boolean
}

/** Session-config choices the Hari palette renders, from `/api/agent/config`. */
export type AgentConfig = {
  models: string[]
  thinkingLevels: ThinkingLevelOption[]
  defaults: {
    model: string
    thinkingLevel: ThinkingLevelOption
  }
  warnings?: string[]
}

export type AgentChatResponse = {
  actions: WorkspaceAction[]
  reply: string
  debug: AgentDebug
}

/** Terminal stream frame carrying the turn's final actions, reply, and debug. */
type DoneFrame = { type: "done" } & AgentChatResponse
/** Stream frame emitted when the turn fails after the stream opened. */
type ErrorFrame = { type: "error"; error: string }
type StreamFrame = AgentStreamEvent | DoneFrame | ErrorFrame

/**
 * Posts a chat message and the current workspace to the local `/api/agent`
 * route, which runs the AI agent in Node and streams its events back as
 * newline-delimited JSON. Each event is forwarded to `onEvent` for live
 * rendering; the promise resolves with the final actions, reply, and debug once
 * the `done` frame arrives. The route reads the workspace for grounding only;
 * the editor applies the actions.
 */
export async function runAgentChat(
  request: AgentChatRequest,
  onEvent?: (event: AgentStreamEvent) => void,
  signal?: AbortSignal,
): Promise<AgentChatResponse> {
  const response = await fetch("/api/agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  })

  if (!response.ok || !response.body) {
    let message = "Agent request failed."
    try {
      const data = (await response.json()) as { error?: string }
      if (data?.error) message = data.error
    } catch {
      // Response was not JSON; keep the default message.
    }
    throw new Error(message)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  let result: AgentChatResponse | undefined

  const handleLine = (line: string) => {
    const trimmed = line.trim()
    if (!trimmed) return
    const frame = JSON.parse(trimmed) as StreamFrame
    if (frame.type === "done") {
      const { type: _type, ...rest } = frame
      result = rest
    } else if (frame.type === "error") {
      throw new Error(frame.error)
    } else {
      onEvent?.(frame)
    }
  }

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    let newline = buffer.indexOf("\n")
    while (newline !== -1) {
      handleLine(buffer.slice(0, newline))
      buffer = buffer.slice(newline + 1)
      newline = buffer.indexOf("\n")
    }
  }
  handleLine(buffer)

  if (!result) throw new Error("Agent stream ended before completion.")
  return result
}

/**
 * Fetches the agent session-config choices from `/api/agent/config` for the Hari
 * palette to render. Returns undefined when the endpoint is unavailable, so the
 * palette can fall back gracefully.
 */
export async function getAgentConfig(): Promise<AgentConfig | undefined> {
  try {
    const response = await fetch("/api/agent/config")
    if (!response.ok) return undefined
    const config = (await response.json()) as AgentConfig
    for (const warning of config.warnings ?? []) {
      console.warn(
        "%c[seldon/ai]%c %s",
        "color:#a855f7;font-weight:bold",
        "",
        warning,
      )
    }
    return config
  } catch {
    return undefined
  }
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
export async function warmAgent(warm?: {
  model?: string
}): Promise<WarmResponse> {
  const response = await fetch("/api/agent/warm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(warm ?? {}),
  })
  if (!response.ok) {
    let message = "Agent warm-up failed."
    try {
      const data = (await response.json()) as { error?: string }
      if (data?.error) message = data.error
    } catch {
      // Response was not JSON; keep the default message.
    }
    throw new Error(message)
  }
  return (await response.json()) as WarmResponse
}
