import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { Connect, Plugin, PreviewServer, ViteDevServer } from "vite"

/**
 * Filesystem-backed workspace store shared by the React and Vue editors.
 *
 * Browser IndexedDB is per-origin, so two editors on different ports cannot
 * share it. This dev-server plugin serves /api/workspaces over a shared folder
 * on disk, so both editors read and write the same workspace JSON regardless of
 * port. One JSON file per workspace; the directory listing is the index.
 */

const pluginDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.join(pluginDir, "../../..")
const workspacesDir = path.join(repoRoot, ".seldon", "workspaces")

type StoredWorkspace = {
  id: string
  name: string
  workspace: unknown
  updatedAt: string
  lastEditor?: string
}

async function ensureDir(): Promise<void> {
  await fs.mkdir(workspacesDir, { recursive: true })
}

function recordPath(id: string): string {
  const safe = id.replace(/[^a-zA-Z0-9_-]/g, "")
  return path.join(workspacesDir, `${safe}.json`)
}

async function listWorkspaces(): Promise<StoredWorkspace[]> {
  await ensureDir()
  const entries = await fs.readdir(workspacesDir)
  const records: StoredWorkspace[] = []
  for (const entry of entries) {
    if (!entry.endsWith(".json")) continue
    try {
      const raw = await fs.readFile(path.join(workspacesDir, entry), "utf8")
      records.push(JSON.parse(raw) as StoredWorkspace)
    } catch {
      // Skip unreadable or partially written files.
    }
  }
  return records
}

async function getWorkspace(id: string): Promise<StoredWorkspace | undefined> {
  try {
    const raw = await fs.readFile(recordPath(id), "utf8")
    return JSON.parse(raw) as StoredWorkspace
  } catch {
    return undefined
  }
}

async function saveWorkspace(record: StoredWorkspace): Promise<void> {
  await ensureDir()
  const target = recordPath(record.id)
  // Write to a temp file then rename so a crash never leaves a half-written
  // file and readers never observe a partial JSON.
  const tmp = `${target}.${process.pid}.${Date.now()}.tmp`
  await fs.writeFile(tmp, JSON.stringify(record, null, 2), "utf8")
  await fs.rename(tmp, target)
}

async function deleteWorkspace(id: string): Promise<void> {
  try {
    await fs.unlink(recordPath(id))
  } catch {
    // Already gone.
  }
}

async function readBody(req: Connect.IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  return Buffer.concat(chunks).toString("utf8")
}

function sendJson(
  res: import("node:http").ServerResponse,
  status: number,
  body: unknown,
): void {
  const payload = JSON.stringify(body)
  res.statusCode = status
  res.setHeader("Content-Type", "application/json")
  res.end(payload)
}

async function handle(
  req: Connect.IncomingMessage,
  res: import("node:http").ServerResponse,
  next: Connect.NextFunction,
): Promise<void> {
  const url = req.url ?? ""
  if (!url.startsWith("/api/workspaces")) {
    next()
    return
  }

  const idMatch = url.match(/^\/api\/workspaces\/([^/?]+)/)
  const id = idMatch ? decodeURIComponent(idMatch[1]) : undefined

  try {
    if (req.method === "GET" && !id) {
      sendJson(res, 200, await listWorkspaces())
      return
    }
    if (req.method === "GET" && id) {
      const record = await getWorkspace(id)
      if (!record) {
        sendJson(res, 404, { error: "Not found" })
        return
      }
      sendJson(res, 200, record)
      return
    }
    if (req.method === "PUT" && id) {
      const record = JSON.parse(await readBody(req)) as StoredWorkspace
      await saveWorkspace(record)
      sendJson(res, 200, { ok: true })
      return
    }
    if (req.method === "DELETE" && id) {
      await deleteWorkspace(id)
      sendJson(res, 200, { ok: true })
      return
    }
    sendJson(res, 405, { error: "Method not allowed" })
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export function workspaceApiPlugin(): Plugin {
  return {
    name: "seldon-workspace-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        void handle(req, res, next)
      })
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use((req, res, next) => {
        void handle(req, res, next)
      })
    },
  }
}
