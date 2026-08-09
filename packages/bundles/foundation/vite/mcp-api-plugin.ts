import { randomUUID } from "node:crypto"
import path from "node:path"

import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { HeadlessHost, createSeldonMcpServer } from "@seldon/ai"

import {
  BRIDGE_EVENTS_PATH,
  BRIDGE_RESULT_PATH,
  MCP_PATH,
} from "../../../editor/shared/lib/mcp/bridge-protocol"
import { BridgeHost, BridgeHub } from "./bridge-host"

import type { BridgeResult } from "../../../editor/shared/lib/mcp/bridge-protocol"
import type { ServerResponse } from "node:http"
import type { Connect, Plugin, PreviewServer, ViteDevServer } from "vite"

/**
 * Options for {@link mcpApiPlugin}. `root` is the project the store lives under,
 * matching `workspaceApiPlugin`, so the MCP server and the editor share one
 * `.seldon/workspaces` folder. `exportRoot` is where the factory reads engine
 * assets during an export, defaulting to `root`.
 */
export interface McpApiPluginOptions {
  root?: string
  exportRoot?: string
}

async function readBody(req: Connect.IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []

  for await (const chunk of req) chunks.push(chunk as Buffer)

  return Buffer.concat(chunks).toString("utf8")
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify(body))
}

/** Opens an SSE stream for a subscribing tab and keeps it alive with comments. */
function openEventStream(res: ServerResponse): void {
  res.statusCode = 200
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache, no-transform")
  res.setHeader("Connection", "keep-alive")
  res.flushHeaders?.()
  res.write(": connected\n\n")

  const keepAlive = setInterval(() => res.write(": keep-alive\n\n"), 15_000)

  res.on("close", () => clearInterval(keepAlive))
}

/** The parts of the MCP mount reused by the dev and preview servers. */
interface McpMount {
  bridge: BridgeHub
  bridgeHost: BridgeHost
  transports: Map<string, StreamableHTTPServerTransport>
}

function createMount(root: string, exportRoot: string): McpMount {
  const fallback = new HeadlessHost({
    storeDir: path.join(root, ".seldon", "workspaces"),
    exportRoot,
  })
  const bridge = new BridgeHub()
  const bridgeHost = new BridgeHost(bridge, fallback)

  return { bridge, bridgeHost, transports: new Map() }
}

/** Routes one MCP Streamable HTTP request, creating a session server on init. */
async function handleMcp(
  mount: McpMount,
  req: Connect.IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const sessionId = req.headers["mcp-session-id"] as string | undefined
  const existing = sessionId ? mount.transports.get(sessionId) : undefined
  const body = req.method === "POST" ? await readBody(req) : undefined
  const parsed = body ? JSON.parse(body) : undefined

  if (existing) {
    await existing.handleRequest(req, res, parsed)

    return
  }

  const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
    onsessioninitialized: (id: string) => {
      mount.transports.set(id, transport)
    },
  })

  transport.onclose = () => {
    if (transport.sessionId) mount.transports.delete(transport.sessionId)
  }

  const server = createSeldonMcpServer(mount.bridgeHost)

  await server.connect(transport)
  await transport.handleRequest(req, res, parsed)
}

async function handle(
  mount: McpMount,
  req: Connect.IncomingMessage,
  res: ServerResponse,
  next: Connect.NextFunction,
): Promise<void> {
  const url = req.url ?? ""

  if (url.startsWith(BRIDGE_EVENTS_PATH)) {
    const query = new URL(url, "http://localhost").searchParams
    const workspaceId = query.get("workspace")

    if (!workspaceId) {
      sendJson(res, 400, { error: "Missing workspace query parameter." })

      return
    }

    openEventStream(res)
    mount.bridge.addClient(workspaceId, res)

    return
  }

  if (url.startsWith(BRIDGE_RESULT_PATH)) {
    if (req.method !== "POST") {
      sendJson(res, 405, { error: "Method not allowed" })

      return
    }

    const result = JSON.parse(await readBody(req)) as BridgeResult

    mount.bridge.deliverResult(result)
    sendJson(res, 200, { ok: true })

    return
  }

  if (url.startsWith(MCP_PATH)) {
    try {
      await handleMcp(mount, req, res)
    } catch (error) {
      if (!res.headersSent) {
        sendJson(res, 500, { error: error instanceof Error ? error.message : "MCP error" })
      }
    }

    return
  }

  next()
}

/**
 * Serves the MCP editor bridge from the dev and preview servers. It mounts the
 * MCP Streamable HTTP endpoint at `/api/mcp` backed by a {@link BridgeHost}, so
 * an external agent client drives the workspace a live tab has open, and it
 * mounts the bridge's SSE and result endpoints the tab's `useMcpBridge` hook
 * uses. With no tab connected the same endpoint serves the headless host over
 * the shared `.seldon/workspaces` store.
 */
export function mcpApiPlugin(options: McpApiPluginOptions = {}): Plugin {
  const root = options.root ?? process.cwd()
  const exportRoot = options.exportRoot ?? root
  const mount = createMount(root, exportRoot)

  return {
    name: "seldon-mcp-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        void handle(mount, req, res, next)
      })
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use((req, res, next) => {
        void handle(mount, req, res, next)
      })
    },
  }
}
