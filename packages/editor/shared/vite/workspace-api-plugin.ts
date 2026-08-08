import fs from "node:fs/promises"
import path from "node:path"

import type { ServerResponse } from "node:http"
import type { Connect, Plugin, PreviewServer, ViteDevServer } from "vite"

/**
 * Filesystem-backed workspace store shared by the React and Vue editors.
 *
 * Browser IndexedDB is per-origin, so two editors on different ports cannot
 * share it. This dev-server plugin serves /api/workspaces over a shared folder
 * on disk, so both editors read and write the same workspace JSON regardless of
 * port. One JSON file per workspace; the directory listing is the index.
 *
 * The store lives at `<root>/.seldon/workspaces`. `root` defaults to the process
 * working directory, so a consumer that mounts the editor gets the store under
 * its own project. The monorepo passes its repo root, so both editors share one
 * store no matter which app started the server.
 */

export interface WorkspaceApiPluginOptions {
  root?: string
}

type StoredWorkspace = {
  id: string
  workspace: unknown
  updatedAt: string
  lastEditor?: string
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true })
}

function recordPath(dir: string, id: string): string {
  const safe = id.replace(/[^a-zA-Z0-9_-]/g, "")

  return path.join(dir, `${safe}.json`)
}

async function listWorkspaces(dir: string): Promise<StoredWorkspace[]> {
  await ensureDir(dir)
  const entries = await fs.readdir(dir)
  const records: StoredWorkspace[] = []

  for (const entry of entries) {
    if (!entry.endsWith(".json")) continue

    try {
      const raw = await fs.readFile(path.join(dir, entry), "utf8")

      records.push(JSON.parse(raw) as StoredWorkspace)
    } catch {
      // Skip unreadable or partially written files.
    }
  }

  return records
}

async function getWorkspace(dir: string, id: string): Promise<StoredWorkspace | undefined> {
  try {
    const raw = await fs.readFile(recordPath(dir, id), "utf8")

    return JSON.parse(raw) as StoredWorkspace
  } catch {
    return undefined
  }
}

/**
 * Keeps exactly one backup of the file a save is about to replace, at
 * `<file>.bak`. A workspace the editor overwrites with the wrong state is still
 * on disk for the next save, and the backup is overwritten in place, so a
 * workspace never keeps more than one backup per id. Backups do not end in
 * `.json`, so the listing never offers them as workspaces.
 *
 * Numbered `.N.bak` files left by an earlier rotation scheme are pruned, so a
 * store written before this cleans itself up on the next save.
 */
async function backupExisting(target: string): Promise<void> {
  try {
    await fs.access(target)
  } catch {
    return
  }

  await fs.copyFile(target, `${target}.bak`)
  await pruneLegacyBackups(target)
}

/** Removes numbered `.N.bak` backups left by the earlier rotation scheme. */
async function pruneLegacyBackups(target: string): Promise<void> {
  for (let slot = 1; slot <= 9; slot++) {
    try {
      await fs.rm(`${target}.${slot}.bak`)
    } catch {
      // That slot does not exist, which is the normal case.
    }
  }
}

async function saveWorkspace(dir: string, record: StoredWorkspace): Promise<void> {
  await ensureDir(dir)
  const target = recordPath(dir, record.id)

  await backupExisting(target)

  // Write to a temp file then rename so a crash never leaves a half-written
  // file and readers never observe a partial JSON.
  const tmp = `${target}.${process.pid}.${Date.now()}.tmp`

  await fs.writeFile(tmp, JSON.stringify(record, null, 2), "utf8")
  await fs.rename(tmp, target)
}

async function deleteWorkspace(dir: string, id: string): Promise<void> {
  try {
    await fs.unlink(recordPath(dir, id))
  } catch {
    // Already gone.
  }
}

async function readBody(req: Connect.IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []

  for await (const chunk of req) chunks.push(chunk as Buffer)

  return Buffer.concat(chunks).toString("utf8")
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body)

  res.statusCode = status
  res.setHeader("Content-Type", "application/json")
  res.end(payload)
}

async function handle(
  dir: string,
  req: Connect.IncomingMessage,
  res: ServerResponse,
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
      sendJson(res, 200, await listWorkspaces(dir))

      return
    }

    if (req.method === "GET" && id) {
      const record = await getWorkspace(dir, id)

      if (!record) {
        sendJson(res, 404, { error: "Not found" })

        return
      }

      sendJson(res, 200, record)

      return
    }

    if (req.method === "PUT" && id) {
      const record = JSON.parse(await readBody(req)) as StoredWorkspace

      await saveWorkspace(dir, record)
      sendJson(res, 200, { ok: true })

      return
    }

    if (req.method === "DELETE" && id) {
      await deleteWorkspace(dir, id)
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

export function workspaceApiPlugin(options: WorkspaceApiPluginOptions = {}): Plugin {
  const root = options.root ?? process.cwd()
  const workspacesDir = path.join(root, ".seldon", "workspaces")

  return {
    name: "seldon-workspace-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        void handle(workspacesDir, req, res, next)
      })
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use((req, res, next) => {
        void handle(workspacesDir, req, res, next)
      })
    },
  }
}
