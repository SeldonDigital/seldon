import { build } from "esbuild"
import fs from "node:fs/promises"
import type { IncomingMessage, ServerResponse } from "node:http"
import os from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import type { Connect, Plugin } from "vite"
import type { ExportRequestBody, runExport } from "./export-handler"

const ROUTE = "/api/export"

// The editor workspace is a couple of MB at most, so this ceiling leaves ample
// headroom while stopping an unbounded body from exhausting server memory.
const MAX_BODY_BYTES = 32 * 1024 * 1024

/** Thrown when a request body exceeds MAX_BODY_BYTES so the middleware can 413. */
class PayloadTooLargeError extends Error {}

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
  let total = 0
  for await (const chunk of req) {
    const buffer = chunk as Buffer
    total += buffer.length
    if (total > MAX_BODY_BYTES) {
      throw new PayloadTooLargeError(
        `Export request body exceeds ${MAX_BODY_BYTES} bytes.`,
      )
    }
    chunks.push(buffer)
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

  // This endpoint is unauthenticated and reads repo source, so it is meant to
  // stay bound to the local dev/preview server. If you ever expose the server
  // (for example `vite --host` for device testing), add a gate here before
  // running the export: generate a per-session token at server start, require
  // it on the request (header or query param), and/or check req.headers.origin
  // and req.headers.host against an allowlist, rejecting with 401/403 otherwise.
  const contentType = req.headers["content-type"] ?? ""
  if (!contentType.includes("application/json")) {
    sendJson(res, 415, { error: "Expected an application/json request body." })
    return
  }

  void (async () => {
    try {
      const body = await readJsonBody(req)
      const run = await getRunExport()
      const result = await run(body)
      sendJson(res, 200, result)
    } catch (error) {
      if (error instanceof PayloadTooLargeError) {
        sendJson(res, 413, { error: error.message })
        return
      }
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
