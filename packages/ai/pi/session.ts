import {
  type AgentSession,
  DefaultResourceLoader,
  SessionManager,
  SettingsManager,
  createAgentSession,
  getAgentDir,
} from "@earendil-works/pi-coding-agent"

import {
  type EditorContextInput,
  type ResolvedContext,
  resolveContext,
} from "./editor-context"
import { buildOllamaModel, createPiAuth } from "./model"
import type { ThinkingLevelOption } from "./model"
import { buildPiSystemPrompt } from "./system-prompt"
import { createContextTools } from "./tools/context"
import { createMutationTools } from "./tools/mutations"
import { type PiTurnState, createTurnState } from "./tools/turn-state"

export interface SeldonSessionOptions {
  model?: string
  host?: string
  thinkingLevel?: ThinkingLevelOption
}

export interface SeldonSession {
  session: AgentSession
  state: PiTurnState
  resolved: ResolvedContext
}

/**
 * Builds a resource loader that serves only the Seldon system prompt. Project
 * skills, extensions, prompts, themes, and context files are disabled so the
 * agent is hermetic and fast, and the system-prompt prefix is stable for cache
 * reuse.
 */
async function buildResourceLoader(): Promise<DefaultResourceLoader> {
  const loader = new DefaultResourceLoader({
    cwd: process.cwd(),
    agentDir: getAgentDir(),
    noExtensions: true,
    noSkills: true,
    noPromptTemplates: true,
    noThemes: true,
    noContextFiles: true,
    systemPromptOverride: () => buildPiSystemPrompt(),
  })
  await loader.reload()
  return loader
}

/**
 * Creates a Pi agent session wired for Seldon. All file tools are disabled and
 * only the Seldon mutation and read tools are exposed, so the model can act on a
 * design without touching the machine. The mutation tools share a working copy
 * seeded from the request workspace and accumulate the actions the caller
 * applies. Compaction and retry are off to keep a turn short and predictable.
 */
export async function createSeldonSession(
  input: EditorContextInput,
  options: SeldonSessionOptions = {},
): Promise<SeldonSession> {
  const resolved = resolveContext(input)
  const state = createTurnState(input.workspace)

  const mutationTools = createMutationTools(state)
  const contextTools = createContextTools(resolved)
  const customTools = [...mutationTools, ...contextTools]
  const toolNames = customTools.map((tool) => tool.name)

  const reasoning =
    options.thinkingLevel !== undefined && options.thinkingLevel !== "off"
  const model = buildOllamaModel({
    model: options.model,
    host: options.host,
    reasoning,
  })
  const { authStorage, modelRegistry } = createPiAuth()
  const resourceLoader = await buildResourceLoader()

  const { session } = await createAgentSession({
    model,
    thinkingLevel: reasoning ? options.thinkingLevel : undefined,
    authStorage,
    modelRegistry,
    resourceLoader,
    noTools: "all",
    customTools,
    tools: toolNames,
    sessionManager: SessionManager.inMemory(),
    settingsManager: SettingsManager.inMemory({
      compaction: { enabled: false },
      retry: { enabled: false },
    }),
  })

  return { session, state, resolved }
}

/**
 * Creates a tool-less Pi session for warm-up. It loads the model and prefills
 * the stable system prompt without a workspace, so the first real turn skips the
 * cold model load and reuses the cached system-prompt prefix.
 */
export async function createWarmSession(
  options: SeldonSessionOptions = {},
): Promise<AgentSession> {
  const model = buildOllamaModel({ model: options.model, host: options.host })
  const { authStorage, modelRegistry } = createPiAuth()
  const resourceLoader = await buildResourceLoader()

  const { session } = await createAgentSession({
    model,
    authStorage,
    modelRegistry,
    resourceLoader,
    noTools: "all",
    sessionManager: SessionManager.inMemory(),
    settingsManager: SettingsManager.inMemory({
      compaction: { enabled: false },
      retry: { enabled: false },
    }),
  })

  return session
}
