import {
  DefaultResourceLoader,
  SessionManager,
  SettingsManager,
  createAgentSession,
  getAgentDir,
} from "@earendil-works/pi-coding-agent"

import { EditSession } from "../tools"
import { buildPiTools, selectionFromResolved } from "./adapter"
import { resolveContext } from "./editor-context"
import { buildOllamaModel, clampedThinkingLevel, createPiAuth, supportsThinking } from "./model"
import { buildPiSystemPrompt } from "./system-prompt"

import type { EditorContextInput, ResolvedContext } from "./editor-context"
import type { ThinkingLevelOption } from "./model"
import type { AgentSession } from "@earendil-works/pi-coding-agent"

/**
 * Options for building a Seldon Pi session. `thinkingCapable` is whether the
 * model can run a thinking pass, resolved by the caller from Ollama's reported
 * capabilities; when omitted it falls back to the name-based
 * {@link supportsThinking} check. `noThink` forces reasoning off for the turn,
 * overriding the thinking level.
 */
export interface SeldonSessionOptions {
  model?: string
  host?: string
  thinkingLevel?: ThinkingLevelOption
  thinkingCapable?: boolean
  noThink?: boolean
}

export interface SeldonSession {
  session: AgentSession
  state: EditSession
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

  // The turn runs on one shared edit session seeded from the request workspace
  // and the resolved selection. It carries the isolation closure so the shared
  // write model rejects out-of-closure edits and grows the allowed set as
  // in-scope inserts mint ids.
  const state = new EditSession(input.workspace, selectionFromResolved(resolved))

  const customTools = buildPiTools(state)
  const toolNames = customTools.map((tool) => tool.name)

  // Thinking-capable models keep `reasoning: true` so Pi always emits the
  // `enable_thinking` kwarg. Leaving it false makes Pi send nothing, and qwen's
  // chat template then defaults thinking ON, so "off" would never disable it.
  // On/off is driven by the session thinking level: a level enables thinking,
  // `undefined` sends `enable_thinking: false`. Clamp asks each model for the
  // least reasoning it supports: qwen3 turns off, gpt-oss drops to low effort.
  const thinkingCapable = options.thinkingCapable ?? supportsThinking(options.model)
  const requestedLevel = options.noThink
    ? clampedThinkingLevel(options.model)
    : options.thinkingLevel
  const thinkingOn = thinkingCapable && requestedLevel !== undefined && requestedLevel !== "off"
  const model = buildOllamaModel({
    model: options.model,
    host: options.host,
    reasoning: thinkingCapable,
  })
  const { authStorage, modelRegistry } = createPiAuth()
  const resourceLoader = await buildResourceLoader()

  const { session } = await createAgentSession({
    model,
    thinkingLevel: thinkingOn ? requestedLevel : undefined,
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
export async function createWarmSession(options: SeldonSessionOptions = {}): Promise<AgentSession> {
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
