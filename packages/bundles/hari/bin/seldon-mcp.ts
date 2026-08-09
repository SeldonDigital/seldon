#!/usr/bin/env node
import { randomUUID } from "node:crypto"
import { createServer } from "node:http"

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { HeadlessHost, createSeldonMcpServer } from "@seldon/ai"

import type { McpHost } from "@seldon/ai"
import type { IncomingMessage, ServerResponse } from "node:http"

/** Parsed command-line options for the bin. */
interface CliOptions {
  storeDir: string
  http: boolean
  port: number
  workspace?: string
  exportRoot?: string
}

/** Reads the flags the bin accepts: --store, --workspace, --http, --port, --export-root. */
function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { storeDir: ".seldon/workspaces", http: false, port: 7355 }

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === "--http") options.http = true
    else if (arg === "--store") options.storeDir = argv[++index]
    else if (arg === "--workspace") options.workspace = argv[++index]
    else if (arg === "--export-root") options.exportRoot = argv[++index]
    else if (arg === "--port") options.port = Number(argv[++index])
    else if (arg.startsWith("--store=")) options.storeDir = arg.slice("--store=".length)
    else if (arg.startsWith("--workspace=")) options.workspace = arg.slice("--workspace=".length)
    else if (arg.startsWith("--port=")) options.port = Number(arg.slice("--port=".length))
  }

  return options
}

/** Serves one MCP server over stdio, the transport a local agent client spawns. */
async function runStdio(host: McpHost): Promise<void> {
  const server = createSeldonMcpServer(host)
  const transport = new StdioServerTransport()

  await server.connect(transport)
}

/** Reads and JSON-parses a Node request body, or null when it is empty. */
async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []

  for await (const chunk of req) chunks.push(chunk as Buffer)
  if (chunks.length === 0) return null

  return JSON.parse(Buffer.concat(chunks).toString("utf8"))
}

/**
 * Serves MCP over Streamable HTTP on `POST /mcp`. Each client session gets its
 * own server instance, keyed by the `mcp-session-id` header the SDK assigns on
 * initialize, so per-connection selection and transactions stay isolated.
 */
async function runHttp(host: McpHost, port: number): Promise<void> {
  const transports = new Map<string, StreamableHTTPServerTransport>()

  const httpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
    void (async () => {
      if (!req.url || !req.url.startsWith("/mcp")) {
        res.statusCode = 404
        res.end("Not found")

        return
      }

      const sessionId = req.headers["mcp-session-id"] as string | undefined
      const existing = sessionId ? transports.get(sessionId) : undefined

      if (existing) {
        await existing.handleRequest(req, res, await readJsonBody(req))

        return
      }

      const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (id: string) => {
          transports.set(id, transport)
        },
      })

      transport.onclose = () => {
        if (transport.sessionId) transports.delete(transport.sessionId)
      }

      const server = createSeldonMcpServer(host)

      await server.connect(transport)
      await transport.handleRequest(req, res, await readJsonBody(req))
    })()
  })

  await new Promise<void>((resolve) => httpServer.listen(port, resolve))
  process.stderr.write(`seldon-mcp listening on http://localhost:${port}/mcp\n`)
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2))
  const host = new HeadlessHost({ storeDir: options.storeDir, exportRoot: options.exportRoot })

  if (options.http) {
    await runHttp(host, options.port)

    return
  }

  await runStdio(host)
}

main().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`,
  )
  process.exit(1)
})
