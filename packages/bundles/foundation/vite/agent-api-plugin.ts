import { spawn, spawnSync } from "node:child_process"
import { randomUUID } from "node:crypto"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

import { build } from "esbuild"

import type {
  AgentRequestBody,
  AgentStreamEvent,
  agentConfig,
  runAgent,
  warmAgent,
} from "@seldon/ai"
import type { IncomingMessage, ServerResponse } from "node:http"
import type { Connect, Plugin } from "vite"

const ROUTE = "/api/agent"
const CODEX_MODEL = "codex"

const pluginDir = path.dirname(fileURLToPath(import.meta.url))
const coreRoot = path.join(pluginDir, "../../../core")
const factoryRoot = path.join(pluginDir, "../../../factory")
const aiRoot = path.join(pluginDir, "../../../ai")
const aiEntry = path.join(aiRoot, "index.ts")
// Bundle the agent functions straight from the `ai` package source, not through
// the package index, so the bundle skips the MCP server and factory graph the
// index re-exports and pulls only the chat-to-actions path Pi needs.
const handlerEntry = path.join(aiRoot, "server/agent.ts")

type RunAgent = typeof runAgent
type WarmAgent = typeof warmAgent
type AgentConfig = typeof agentConfig
type AgentModule = {
  runAgent: RunAgent
  warmAgent: WarmAgent
  agentConfig: AgentConfig
}

let cachedAgent: Promise<AgentModule> | null = null
/** Bumped per build so each bundle imports from a fresh URL, bypassing the ESM cache. */
let buildId = 0
/** Previous bundle path, removed after the next build so the cache dir stays clean. */
let previousOutputFile: string | null = null

const repoRoot = path.join(pluginDir, "../../../..")

/**
 * Pi and its dependency graph are large and ship runtime assets and dynamic
 * requires, so they are kept external instead of bundled. The bundled handler is
 * written under the `ai` package's `node_modules` (below) so Node's upward
 * resolution reaches wherever npm installed Pi, whether it nests under
 * `packages/ai/node_modules` or hoists to the repo root, and still finds the
 * root-level externals like `typebox`.
 */
const externalPackages = [
  "@earendil-works/pi-coding-agent",
  "@earendil-works/pi-ai",
  "@earendil-works/pi-agent-core",
  "@earendil-works/pi-tui",
  "typebox",
]

/**
 * Bundles the agent handler and its core/ai graph into a single Node module with
 * esbuild, then imports it. The `development` condition makes `@seldon/core` and
 * `@seldon/ai` resolve to source instead of built output, mirroring the editor's
 * source-first setup. Pi packages stay external, and the output is written under
 * the `ai` package's `node_modules` so those external imports resolve at runtime.
 * Works the same under `vite dev` and `vite preview`.
 */
async function loadAgent(): Promise<AgentModule> {
  const result = await build({
    entryPoints: [handlerEntry],
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node22",
    write: false,
    logLevel: "silent",
    conditions: ["development"],
    external: externalPackages,
    alias: {
      "@seldon/core": coreRoot,
      "@seldon/factory": factoryRoot,
      "@seldon/ai": aiEntry,
    },
  })

  const outputDir = path.join(aiRoot, "node_modules", ".seldon-agent")

  await fs.mkdir(outputDir, { recursive: true })
  buildId += 1
  const outputFile = path.join(outputDir, `agent-handler-${process.pid}-${buildId}.mjs`)

  await fs.writeFile(outputFile, result.outputFiles[0].text)
  const staleOutputFile = previousOutputFile

  previousOutputFile = outputFile
  if (staleOutputFile) await fs.rm(staleOutputFile, { force: true })

  return (await import(pathToFileURL(outputFile).href)) as AgentModule
}

function getAgent(): Promise<AgentModule> {
  if (!cachedAgent) {
    cachedAgent = loadAgent()
  }

  return cachedAgent
}

/** True when a changed file is part of the agent handler or the `ai` package. */
function affectsAgent(file: string): boolean {
  const normalized = path.normalize(file)

  if (normalized === handlerEntry) return true

  return (
    normalized.startsWith(aiRoot + path.sep) &&
    !normalized.includes(`${path.sep}node_modules${path.sep}`)
  )
}

async function readJsonBody<T>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = []

  for await (const chunk of req) {
    chunks.push(chunk as Buffer)
  }

  const text = Buffer.concat(chunks).toString("utf8").trim()

  return (text ? JSON.parse(text) : {}) as T
}

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify(payload))
}

/** Writes one newline-delimited JSON frame to the streaming response. */
function writeFrame(res: ServerResponse, frame: unknown): void {
  res.write(`${JSON.stringify(frame)}\n`)
}

/** The local Codex executable can reuse the user's existing Codex login. */
function codexCommand(): string {
  return process.env.SELDON_CODEX_BIN ?? "codex"
}

/** True when the local Codex CLI is installed and can be launched. */
function codexAvailable(): boolean {
  if (process.env.SELDON_CODEX_ENABLED === "0") return false

  try {
    return spawnSync(codexCommand(), ["--version"], { stdio: "ignore" }).status === 0
  } catch {
    return false
  }
}

/** Builds the MCP URL on the same local Vite server that received the chat. */
function localMcpUrl(req: IncomingMessage): string {
  const host = req.headers.host ?? "127.0.0.1:5173"
  const forwarded = req.headers["x-forwarded-proto"]
  const protocol = typeof forwarded === "string" ? forwarded.split(",")[0] : "http"

  return `${protocol}://${host}/api/mcp`
}

/** Converts the current editor context into instructions for the Codex turn. */
function codexPrompt(body: AgentRequestBody): string {
  const history = (body.history ?? [])
    .slice(-12)
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n")

  return [
    "You are editing a Seldon design workspace.",
    "Use the Seldon MCP server tools for every workspace read and edit.",
    "Do not use shell, file, git, or browser tools to modify the design.",
    "Complete the user's request, then briefly summarize what changed.",
    `Target workspace id: ${body.workspace.metadata.id ?? "(use the sole workspace)"}`,
    `Active board: ${body.activeBoardKey ?? "none"}`,
    `Selected node: ${body.selectedNodeId ?? "none"}`,
    `Selection scope: ${body.scope ?? "workspace"}`,
    "If the request mentions components, nodes, boards, buttons, or page content while the selection scope is theme, fontCollection, or iconSet, call widen_scope first (and again if needed) until the relevant board/workspace is visible. Do not conclude that there are no component nodes from a resource-scoped view.",
    "For requests that apply to all matching components, inspect the widened board/workspace and edit every matching node rather than only the currently selected resource.",
    history ? `Recent conversation:\n${history}` : "",
    `User request:\n${body.message}`,
  ]
    .filter(Boolean)
    .join("\n\n")
}

/** Runs one local Codex turn against the editor's MCP bridge. */
async function streamCodexTurn(
  req: IncomingMessage,
  res: ServerResponse,
  body: AgentRequestBody,
): Promise<void> {
  res.statusCode = 200
  res.setHeader("Content-Type", "application/x-ndjson")
  res.setHeader("Cache-Control", "no-cache")
  res.flushHeaders?.()

  if (!codexAvailable()) {
    writeFrame(res, {
      type: "error",
      error: `Codex CLI was not found. Install or authenticate Codex, or set SELDON_CODEX_BIN.`,
    })
    res.end()

    return
  }

  const outputFile = path.join(os.tmpdir(), `seldon-codex-${randomUUID()}.txt`)
  const args = [
    "--approve-for-me",
    "exec",
    "--ephemeral",
    "--skip-git-repo-check",
    "--ignore-user-config",
    "--sandbox",
    "workspace-write",
    "-C",
    repoRoot,
    "-c",
    `mcp_servers.seldon.url=${JSON.stringify(localMcpUrl(req))}`,
    "-o",
    outputFile,
    codexPrompt(body),
  ]
  const child = spawn(codexCommand(), args, {
    cwd: repoRoot,
    stdio: ["ignore", "pipe", "pipe"],
  })
  let stderr = ""
  let finished = false

  const stop = () => {
    if (!finished) child.kill("SIGTERM")
  }

  req.on("aborted", stop)
  res.on("close", stop)
  writeFrame(res, {
    type: "thinking",
    delta: "Codex is working through the Seldon tools…",
  })

  child.stderr.on("data", (chunk: Buffer) => {
    stderr += chunk.toString()
  })

  const exitCode = await new Promise<number | null>((resolve, reject) => {
    child.once("error", reject)
    child.once("exit", (code) => resolve(code))
  }).catch((error: unknown) => {
    throw error instanceof Error ? error : new Error(String(error))
  })

  finished = true

  try {
    const reply = (await fs.readFile(outputFile, "utf8")).trim()

    if (exitCode !== 0) {
      throw new Error(stderr.trim() || `Codex exited with code ${exitCode ?? "unknown"}.`)
    }

    writeFrame(res, { type: "thinkingDone", ms: 0 })
    writeFrame(res, {
      type: "done",
      // The MCP bridge applies the live changes directly to the editor tab.
      // The existing Hari reducer therefore must not adopt the stale request copy.
      actions: [],
      workspace: body.workspace,
      reply: reply || "Codex completed the Seldon edit.",
      ineffective: [],
      rejected: [],
      debug: {
        context: "codex-mcp-bridge",
        rawResponse: reply,
        repairs: [],
        toolCalls: [],
        metrics: {
          model: CODEX_MODEL,
          calls: 1,
          totalMs: 0,
          loadMs: 0,
          promptTokens: 0,
          outputTokens: 0,
        },
      },
    })
  } catch (error) {
    writeFrame(res, {
      type: "error",
      error: error instanceof Error ? error.message : "Codex request failed.",
    })
  } finally {
    await fs.rm(outputFile, { force: true })
    res.end()
  }
}

/**
 * Runs a chat turn and streams its events as newline-delimited JSON: one frame
 * per {@link AgentStreamEvent} as it arrives, then a final `done` frame with the
 * actions, reply, and debug the client applies. Errors before the stream opens
 * return JSON; errors mid-stream close the stream with an `error` frame.
 */
async function streamAgentTurn(
  res: ServerResponse,
  agent: AgentModule,
  body: AgentRequestBody,
): Promise<void> {
  res.statusCode = 200
  res.setHeader("Content-Type", "application/x-ndjson")
  res.setHeader("Cache-Control", "no-cache")
  res.flushHeaders?.()

  // The client aborts the fetch when the user presses Stop, which closes the
  // response socket. Forward that as an abort into the agent so the local model
  // turn is cancelled instead of running to completion in the background. Watch
  // the response, not the request: the request body is already fully consumed by
  // the time we get here, so its stream closes at once and would abort every
  // turn at the start. The `finished` guard skips the close that our own
  // res.end() triggers on a normal turn.
  const controller = new AbortController()
  let finished = false

  res.on("close", () => {
    if (!finished) controller.abort()
  })

  const onEvent = (event: AgentStreamEvent) => writeFrame(res, event)

  try {
    const result = await agent.runAgent(body, onEvent, controller.signal)

    writeFrame(res, { type: "done", ...result })
  } catch (error) {
    writeFrame(res, {
      type: "error",
      error: error instanceof Error ? error.message : "Agent request failed.",
    })
  } finally {
    finished = true
    res.end()
  }
}

const middleware: Connect.NextHandleFunction = (req, res, next) => {
  // Mounted at `/api/agent`, so `req.url` is the remainder: `/config`, `/warm`, or `/`.
  const url = req.url ?? ""
  const isConfig = url.startsWith("/config")

  if (req.method === "GET" && isConfig) {
    void (async () => {
      try {
        const agent = await getAgent()
        const config = await agent.agentConfig()

        if (codexAvailable()) {
          config.models = [...new Set([...config.models, CODEX_MODEL])]
          config.thinkingByModel[CODEX_MODEL] = {
            mode: "none",
            options: [],
            default: "off",
          }
          config.clampedLevels[CODEX_MODEL] = "off"
        }

        sendJson(res, 200, config)
      } catch (error) {
        sendJson(res, 500, {
          error: error instanceof Error ? error.message : "Agent config failed.",
        })
      }
    })()

    return
  }

  if (req.method !== "POST") {
    next()

    return
  }

  const isWarm = url.startsWith("/warm")

  void (async () => {
    try {
      if (isWarm) {
        const body = await readJsonBody<{ model?: string }>(req)

        if (body.model === CODEX_MODEL) {
          sendJson(res, 200, {
            ok: true,
            metrics: {
              model: CODEX_MODEL,
              calls: 0,
              totalMs: 0,
              loadMs: 0,
              promptTokens: 0,
              outputTokens: 0,
            },
          })

          return
        }

        const agent = await getAgent()

        sendJson(res, 200, await agent.warmAgent(body))

        return
      }

      const body = await readJsonBody<AgentRequestBody>(req)

      if (body.model === CODEX_MODEL) {
        await streamCodexTurn(req, res, body)

        return
      }

      const agent = await getAgent()

      await streamAgentTurn(res, agent, body)
    } catch (error) {
      sendJson(res, 500, {
        error: error instanceof Error ? error.message : "Agent request failed.",
      })
    }
  })()
}

/**
 * Serves the local AI agent over POST `/api/agent` for both `vite dev` and
 * `vite preview`. The agent turns a chat message into workspace actions.
 */
export function agentApiPlugin(): Plugin {
  return {
    name: "seldon-agent-api",
    configureServer(server) {
      server.middlewares.use(ROUTE, middleware)

      // The agent handler and `ai` package are bundled once and cached, and Vite
      // HMR does not cover this Node-side bundle. Watch their sources and drop the
      // cache on change so the next request re-bundles without a server restart.
      server.watcher.add([handlerEntry, aiRoot])

      const invalidate = (file: string) => {
        if (!affectsAgent(file)) return
        cachedAgent = null
        server.config.logger.info(
          `[seldon-agent] reloading agent after change to ${path.relative(repoRoot, file)}`,
        )
      }

      server.watcher.on("change", invalidate)
      server.watcher.on("add", invalidate)
      server.watcher.on("unlink", invalidate)
    },
    configurePreviewServer(server) {
      server.middlewares.use(ROUTE, middleware)
    },
  }
}
