import { build } from "esbuild"
import fs from "node:fs/promises"
import type { IncomingMessage, ServerResponse } from "node:http"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import type { Connect, Plugin } from "vite"
import type { ImportWebRequestBody, runImportWebHandler } from "./import-web-handler"

const ROUTE = "/api/import-web"

const pluginDir = path.dirname(fileURLToPath(import.meta.url))
const handlerEntry = path.join(pluginDir, "import-web-handler.ts")
const coreRoot = path.join(pluginDir, "../../core")
const factoryRoot = path.join(pluginDir, "../../factory")
const repoRoot = path.join(pluginDir, "../../..")

type RunImportWebHandler = typeof runImportWebHandler

let cachedHandler: Promise<RunImportWebHandler> | null = null

/**
 * happy-dom ships runtime assets and is large, so it is kept external instead of
 * bundled. The bundled handler is written under the repo's `node_modules` so
 * Node's upward resolution reaches the hoisted happy-dom install at runtime.
 */
const externalPackages = ["happy-dom"]

/**
 * Bundles the import-web handler and its core/factory graph into a single Node
 * module with esbuild, then imports it. The `development` condition resolves
 * `@seldon/core` and `@seldon/factory` to source, mirroring the export and
 * agent plugins. Works the same under `vite dev` and `vite preview`.
 */
async function loadHandler(): Promise<RunImportWebHandler> {
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
    },
  })

  const outputDir = path.join(repoRoot, "node_modules", ".seldon-import-web")
  await fs.mkdir(outputDir, { recursive: true })
  const outputFile = path.join(outputDir, `import-web-handler-${process.pid}.mjs`)
  await fs.writeFile(outputFile, result.outputFiles[0].text)
  const mod = (await import(pathToFileURL(outputFile).href)) as {
    runImportWebHandler: RunImportWebHandler
  }
  return mod.runImportWebHandler
}

function getHandler(): Promise<RunImportWebHandler> {
  if (!cachedHandler) {
    cachedHandler = loadHandler()
  }
  return cachedHandler
}

async function readJsonBody(req: IncomingMessage): Promise<ImportWebRequestBody> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(chunk as Buffer)
  }
  const text = Buffer.concat(chunks).toString("utf8").trim()
  return (text ? JSON.parse(text) : {}) as ImportWebRequestBody
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

  // This endpoint is unauthenticated and fetches an arbitrary URL server-side,
  // so it is meant to stay bound to the local dev/preview server. If you ever
  // expose the server (for example `vite --host`), add a gate here: require a
  // per-session token and/or check req.headers.origin and req.headers.host
  // against an allowlist, rejecting with 401/403 otherwise.
  const contentType = req.headers["content-type"] ?? ""
  if (!contentType.includes("application/json")) {
    sendJson(res, 415, { error: "Expected an application/json request body." })
    return
  }

  void (async () => {
    try {
      const body = await readJsonBody(req)
      const run = await getHandler()
      const result = await run(body)
      sendJson(res, 200, result)
    } catch (error) {
      sendJson(res, 500, {
        error: error instanceof Error ? error.message : "Import failed.",
      })
    }
  })()
}

/**
 * Serves the factory web import over POST `/api/import-web` for both `vite dev`
 * and `vite preview`. It turns a URL into draft component schemas and a report.
 */
export function importWebApiPlugin(): Plugin {
  return {
    name: "seldon-import-web-api",
    configureServer(server) {
      server.middlewares.use(ROUTE, middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(ROUTE, middleware)
    },
  }
}
