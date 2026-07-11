import { build } from "esbuild"
import fs from "node:fs/promises"
import type { IncomingMessage, ServerResponse } from "node:http"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import type { Connect, Plugin } from "vite"
import type {
  AgentRequestBody,
  agentConfig,
  runAgent,
  warmAgent,
} from "./agent-handler"

const ROUTE = "/api/agent"

const pluginDir = path.dirname(fileURLToPath(import.meta.url))
const handlerEntry = path.join(pluginDir, "agent-handler.ts")
const coreRoot = path.join(pluginDir, "../../core")
const factoryRoot = path.join(pluginDir, "../../factory")
const aiRoot = path.join(pluginDir, "../../ai")
const aiEntry = path.join(aiRoot, "index.ts")

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

const repoRoot = path.join(pluginDir, "../../..")

/**
 * Pi and its dependency graph are large and ship runtime assets and dynamic
 * requires, so they are kept external instead of bundled. The bundled handler is
 * written under the repo `node_modules` (below) so Node resolves these bare
 * imports from the project at runtime.
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
 * the repo `node_modules` so those external imports resolve at runtime. Works the
 * same under `vite dev` and `vite preview`.
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

  const outputDir = path.join(repoRoot, "node_modules", ".seldon-agent")
  await fs.mkdir(outputDir, { recursive: true })
  buildId += 1
  const outputFile = path.join(
    outputDir,
    `agent-handler-${process.pid}-${buildId}.mjs`,
  )
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

const middleware: Connect.NextHandleFunction = (req, res, next) => {
  // Mounted at `/api/agent`, so `req.url` is the remainder: `/config`, `/warm`, or `/`.
  const url = req.url ?? ""
  const isConfig = url.startsWith("/config")

  if (req.method === "GET" && isConfig) {
    void (async () => {
      try {
        const agent = await getAgent()
        sendJson(res, 200, await agent.agentConfig())
      } catch (error) {
        sendJson(res, 500, {
          error:
            error instanceof Error ? error.message : "Agent config failed.",
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
      const agent = await getAgent()
      if (isWarm) {
        const body = await readJsonBody<{ model?: string }>(req)
        sendJson(res, 200, await agent.warmAgent(body))
        return
      }
      const body = await readJsonBody<AgentRequestBody>(req)
      sendJson(res, 200, await agent.runAgent(body))
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
