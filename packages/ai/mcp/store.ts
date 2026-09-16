import { createHash } from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"

import { orderWorkspaceNodeKeys } from "@seldon/core/workspace/helpers/nodes/order-entry-node-keys"
import { loadWorkspace } from "@seldon/core/workspace/reducers/load-workspace"

import type { Workspace } from "@seldon/core/workspace/types"

/**
 * The on-disk record shape for a workspace backup, matching the editor's
 * workspace API plugin. One `<id>.json` file per workspace under the store dir.
 */
interface StoredWorkspace {
  id: string
  workspace: unknown
  updatedAt: string
  lastEditor?: string
}

/** One workspace on disk, its id and its parsed engine workspace. */
export interface StoreEntry {
  id: string
  workspace: Workspace
  label: string
}

/** A cheap freshness prefilter derived from the record file's stat. */
export interface StatToken {
  mtimeMs: number
  size: number
}

/** A read plus the content revision hash of the serialized workspace. */
export interface RevEntry {
  entry: StoreEntry
  rev: string
}

/** Optional live workspace source the store reads and writes first. */
export interface WorkspaceStoreOptions {
  liveFile?: string
}

/**
 * A workspace store over a project folder.
 *
 * When `liveFile` is set, that raw workspace JSON is the file the editor, MCP,
 * and CLI share. Each write also refreshes `.seldon/workspaces/<id>.json` as a
 * backup. Without `liveFile`, the store directory is the only home, matching
 * the editor's unbound `/api/workspaces` layout.
 *
 * Writes go through a temp file and a rename, so a reader never sees a
 * half-written file.
 */
export class WorkspaceStore {
  private readonly dir: string
  private readonly liveFile: string | undefined = undefined

  constructor(dir: string, options: WorkspaceStoreOptions = {}) {
    this.dir = dir
    this.liveFile = options.liveFile ? path.resolve(options.liveFile) : undefined
  }

  /** Lists every stored workspace id, in directory order. */
  async listIds(): Promise<string[]> {
    if (this.liveFile) {
      const live = await this.readLive()

      return live ? [live.id] : []
    }

    await this.ensureDir()
    const entries = await fs.readdir(this.dir)

    return entries.filter((entry) => entry.endsWith(".json")).map((entry) => entry.slice(0, -5))
  }

  /** Reads one workspace, or null when the file is absent or unreadable. */
  async read(id: string): Promise<StoreEntry | null> {
    if (this.liveFile) {
      const live = await this.readLive()

      return live?.id === id ? live : null
    }

    try {
      const raw = await fs.readFile(this.recordPath(id), "utf8")
      const record = JSON.parse(raw) as StoredWorkspace
      const workspace = loadWorkspace(JSON.stringify(record.workspace))

      return { id: record.id, workspace, label: workspace.metadata.label ?? "" }
    } catch {
      return null
    }
  }

  /**
   * The live file or record file's mtime and size, or null when it is absent.
   * A caller compares this against a cached token to skip a full reload when
   * the file has not changed, so the hot read path stays a single `stat`.
   */
  async statToken(id: string): Promise<StatToken | null> {
    const target = this.liveFile ?? this.recordPath(id)

    try {
      const stat = await fs.stat(target)

      return { mtimeMs: stat.mtimeMs, size: stat.size }
    } catch {
      return null
    }
  }

  /**
   * Reads one workspace and its content revision, or null when absent. The rev
   * is a hash of the ordered workspace, the same shape {@link write} persists,
   * so two processes that read the same file compute the same rev. It ignores
   * `updatedAt`, so a rewrite with identical content keeps the rev stable.
   */
  async readWithRev(id: string): Promise<RevEntry | null> {
    const entry = await this.read(id)

    if (!entry) return null
    const ordered = orderWorkspaceNodeKeys(entry.workspace)
    const rev = createHash("sha1").update(JSON.stringify(ordered)).digest("hex")

    return { entry, rev }
  }

  /**
   * Persists one workspace atomically. Writes the live source when one is
   * configured, then writes the hashed backup record in the store directory.
   */
  async write(id: string, workspace: Workspace): Promise<void> {
    const ordered = orderWorkspaceNodeKeys(workspace)

    if (this.liveFile) {
      await this.writeLive(ordered)
    }

    await this.writeBackup(id, ordered)
  }

  private async readLive(): Promise<StoreEntry | null> {
    if (!this.liveFile) return null

    try {
      const workspace = loadWorkspace(await fs.readFile(this.liveFile, "utf8"))
      const id = workspace.metadata.id

      if (!id) return null

      return { id, workspace, label: workspace.metadata.label ?? "" }
    } catch {
      return null
    }
  }

  private async writeLive(workspace: Workspace): Promise<void> {
    if (!this.liveFile) return

    await fs.mkdir(path.dirname(this.liveFile), { recursive: true })
    await replaceFile(this.liveFile, `${JSON.stringify(workspace, null, 2)}\n`)
  }

  private async writeBackup(id: string, workspace: Workspace): Promise<void> {
    await this.ensureDir()
    const target = this.recordPath(id)
    const record: StoredWorkspace = {
      id,
      workspace,
      updatedAt: new Date().toISOString(),
      lastEditor: "mcp",
    }

    await replaceFile(target, JSON.stringify(record, null, 2))
  }

  private recordPath(id: string): string {
    const safe = id.replace(/[^a-zA-Z0-9_-]/g, "")

    return path.join(this.dir, `${safe}.json`)
  }

  private async ensureDir(): Promise<void> {
    await fs.mkdir(this.dir, { recursive: true })
  }
}

/** Writes `contents` over `target`, keeping one `.bak` of the prior file. */
async function replaceFile(target: string, contents: string): Promise<void> {
  try {
    await fs.access(target)
    await fs.copyFile(target, `${target}.bak`)
  } catch {
    // No prior file to back up, which is the normal first-write case.
  }

  const tmp = `${target}.${process.pid}.${Date.now()}.tmp`

  await fs.writeFile(tmp, contents, "utf8")
  await fs.rename(tmp, target)
}
