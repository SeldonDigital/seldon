import { build } from "esbuild"
import fs from "node:fs/promises"
import type { IncomingMessage, ServerResponse } from "node:http"
import os from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import type { Connect, Plugin } from "vite"
import type { AgentRequestBody, runAgent } from "./agent-handler"

const ROUTE = "/api/agent"

const pluginDir = path.dirname(fileURLToPath(import.meta.url))
const handlerEntry = path.join(pluginDir, "agent-handler.ts")
const coreRoot = path.join(pluginDir, "../../core")
const factoryRoot = path.join(pluginDir, "../../factory")
const aiEntry = path.join(pluginDir, "../../ai/src/index.ts")

type RunAgent = typeof runAgent

let cachedRunAgent: Promise<RunAgent> | null = null

/**
 * Bundles the agent handler and its core/ai graph into a single Node module with
 * esbuild, then imports it. The `development` condition makes `@seldon/core` and
 * `@seldon/ai` resolve to source instead of built output, mirroring the editor's
 * source-first setup. Works the same under `vite dev` and `vite preview`.
 */
async function loadRunAgent(): Promise<RunAgent> {
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
  const mod = (await import(pathToFileURL(outputFile).href)) as {
    runAgent: RunAgent
  }
  return mod.runAgent
}

function getRunAgent(): Promise<RunAgent> {
  if (!cachedRunAgent) {
    cachedRunAgent = loadRunAgent()
  }
  return cachedRunAgent
}

async function readJsonBody(req: IncomingMessage): Promise<AgentRequestBody> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(chunk as Buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as AgentRequestBody
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
  void (async () => {
    try {
      const body = await readJsonBody(req)
      const run = await getRunAgent()
      const result = await run(body)
      sendJson(res, 200, result)
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
