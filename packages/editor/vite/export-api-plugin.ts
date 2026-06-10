import { build } from "esbuild"
import fs from "node:fs/promises"
import type { IncomingMessage, ServerResponse } from "node:http"
import os from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import type { Connect, Plugin } from "vite"
import type { ExportRequestBody, runExport } from "./export-handler"

const ROUTE = "/api/export"

const pluginDir = path.dirname(fileURLToPath(import.meta.url))
const handlerEntry = path.join(pluginDir, "export-handler.ts")
const coreRoot = path.join(pluginDir, "../../core")
const factoryRoot = path.join(pluginDir, "../../factory")

type RunExport = typeof runExport

let cachedRunExport: Promise<RunExport> | null = null

/**
 * Bundles the export handler and its core/factory graph into a single Node
 * module with esbuild, then imports it. Bundling resolves the workspace
 * aliases and applies CommonJS interop, mirroring the former Next.js route
 * runtime. Works the same under `vite dev` and `vite preview`.
 */
async function loadRunExport(): Promise<RunExport> {
  const result = await build({
    entryPoints: [handlerEntry],
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node22",
    write: false,
    logLevel: "silent",
    alias: {
      "@seldon/core": coreRoot,
      "@seldon/factory": factoryRoot,
    },
  })

  const outputFile = path.join(
    os.tmpdir(),
    `seldon-export-handler-${process.pid}.mjs`,
  )
  await fs.writeFile(outputFile, result.outputFiles[0].text)
  const mod = (await import(pathToFileURL(outputFile).href)) as {
    runExport: RunExport
  }
  return mod.runExport
}

function getRunExport(): Promise<RunExport> {
  if (!cachedRunExport) {
    cachedRunExport = loadRunExport()
  }
  return cachedRunExport
}

async function readJsonBody(req: IncomingMessage): Promise<ExportRequestBody> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(chunk as Buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as ExportRequestBody
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
      const run = await getRunExport()
      const result = await run(body)
      sendJson(res, 200, result)
    } catch (error) {
      sendJson(res, 500, {
        error: error instanceof Error ? error.message : "Export failed.",
      })
    }
  })()
}

/**
 * Serves the factory export over POST `/api/export` for both `vite dev` and
 * `vite preview`, replacing the former Next.js API route.
 */
export function exportApiPlugin(): Plugin {
  return {
    name: "seldon-export-api",
    configureServer(server) {
      server.middlewares.use(ROUTE, middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(ROUTE, middleware)
    },
  }
}
