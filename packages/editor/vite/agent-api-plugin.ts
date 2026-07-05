import { build } from "esbuild"
import fs from "node:fs/promises"
import type { IncomingMessage, ServerResponse } from "node:http"
import os from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import type { Connect, Plugin } from "vite"
import type { AgentRequestBody, runAgent, warmAgent } from "./agent-handler"

const ROUTE = "/api/agent"

const pluginDir = path.dirname(fileURLToPath(import.meta.url))
const handlerEntry = path.join(pluginDir, "agent-handler.ts")
const coreRoot = path.join(pluginDir, "../../core")
const factoryRoot = path.join(pluginDir, "../../factory")
const aiEntry = path.join(pluginDir, "../../ai/index.ts")

type RunAgent = typeof runAgent
type WarmAgent = typeof warmAgent
type AgentModule = { runAgent: RunAgent; warmAgent: WarmAgent }

let cachedAgent: Promise<AgentModule> | null = null

/**
 * Bundles the agent handler and its core/ai graph into a single Node module with
 * esbuild, then imports it. The `development` condition makes `@seldon/core` and
 * `@seldon/ai` resolve to source instead of built output, mirroring the editor's
 * source-first setup. Works the same under `vite dev` and `vite preview`.
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
    alias: {
      "@seldon/core": coreRoot,
      "@seldon/factory": factoryRoot,
      "@seldon/ai": aiEntry,
    },
  })

  const outputFile = path.join(
    os.tmpdir(),
    `seldon-agent-handler-${process.pid}.mjs`,
  )
  await fs.writeFile(outputFile, result.outputFiles[0].text)
  return (await import(pathToFileURL(outputFile).href)) as AgentModule
}

function getAgent(): Promise<AgentModule> {
  if (!cachedAgent) {
    cachedAgent = loadAgent()
  }
  return cachedAgent
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
  if (req.method !== "POST") {
    next()
    return
  }
  // Mounted at `/api/agent`, so `req.url` is the remainder: `/warm` or `/`.
  const isWarm = (req.url ?? "").startsWith("/warm")
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
    },
    configurePreviewServer(server) {
      server.middlewares.use(ROUTE, middleware)
    },
  }
}
