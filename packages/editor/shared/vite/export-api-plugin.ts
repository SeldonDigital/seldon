import { existsSync } from "node:fs"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { build } from "esbuild"

import type { ExportRequestBody, runExport } from "./export-handler"
import type { IncomingMessage, ServerResponse } from "node:http"
import type { Connect, Plugin } from "vite"

export interface ExportApiPluginOptions {
  root?: string
}

const ROUTE = "/api/export"

// The editor workspace is a couple of MB at most, so this ceiling leaves ample
// headroom while stopping an unbounded body from exhausting server memory.
const MAX_BODY_BYTES = 32 * 1024 * 1024

/** Thrown when a request body exceeds MAX_BODY_BYTES so the middleware can 413. */
class PayloadTooLargeError extends Error {}

const pluginDir = path.dirname(fileURLToPath(import.meta.url))
const handlerEntry = path.join(pluginDir, "export-handler.ts")
const coreRoot = path.join(pluginDir, "../../../core")
const factoryRoot = path.join(pluginDir, "../../../factory")

type RunExport = typeof runExport

let cachedRunExport: Promise<RunExport> | null = null

/**
 * Bundles the export handler and its core/factory graph into a single Node
 * module with esbuild, then imports it. Bundling resolves the workspace
 * aliases and applies CommonJS interop, mirroring the former Next.js route
 * runtime. Works the same under `vite dev` and `vite preview`.
 */
async function loadRunExport(): Promise<RunExport> {
  // Alias to the monorepo source when it is on disk, so an in-repo export reads
  // live core and factory code. Off the monorepo (an installed editor) the
  // aliases are dropped, so esbuild resolves `@seldon/core` and `@seldon/factory`
  // from the consumer's `node_modules`.
  const alias: Record<string, string> = {}

  if (existsSync(coreRoot)) alias["@seldon/core"] = coreRoot
  if (existsSync(factoryRoot)) alias["@seldon/factory"] = factoryRoot

  const result = await build({
    entryPoints: [handlerEntry],
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node22",
    write: false,
    logLevel: "silent",
    alias,
    // The bindings scanner and best-effort formatter reach these through the
    // export graph, but the handler never runs them. They resolve from the
    // consumer's own node_modules at runtime, so leaving them external keeps
    // esbuild from bundling `@vue/compiler-sfc`'s optional template engines.
    external: [
      "@vue/compiler-sfc",
      "typescript",
      "prettier",
      "@ianvs/prettier-plugin-sort-imports",
    ],
  })

  const outputFile = path.join(os.tmpdir(), `seldon-export-handler-${process.pid}.mjs`)

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
      throw new PayloadTooLargeError(`Export request body exceeds ${MAX_BODY_BYTES} bytes.`)
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

function createMiddleware(root: string): Connect.NextHandleFunction {
  return (req, res, next) => {
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
        const result = await run(body, { root })

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
}

/**
 * Drops the bundled handler so the next export rebundles the current core and
 * factory source. Without this a running dev server keeps the first bundle for
 * its whole lifetime, so a schema edit does not reach an in-editor export.
 */
function invalidateOnSourceChange(file: string): void {
  if (file.startsWith(coreRoot) || file.startsWith(factoryRoot)) {
    cachedRunExport = null
  }
}

/**
 * Serves the factory export over POST `/api/export` for both `vite dev` and
 * `vite preview`, replacing the former Next.js API route.
 */
export function exportApiPlugin(options: ExportApiPluginOptions = {}): Plugin {
  const root = options.root ?? process.cwd()
  const middleware = createMiddleware(root)

  return {
    name: "seldon-export-api",
    configureServer(server) {
      server.middlewares.use(ROUTE, middleware)
      server.watcher.on("change", invalidateOnSourceChange)
      server.watcher.on("add", invalidateOnSourceChange)
      server.watcher.on("unlink", invalidateOnSourceChange)
    },
    configurePreviewServer(server) {
      server.middlewares.use(ROUTE, middleware)
    },
  }
}
