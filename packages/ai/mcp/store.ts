import { createHash } from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"

import { orderWorkspaceNodeKeys } from "@seldon/core/workspace/helpers/nodes/order-entry-node-keys"
import { loadWorkspace } from "@seldon/core/workspace/reducers/load-workspace"

import type { Workspace } from "@seldon/core/workspace/types"

/**
 * The on-disk record shape, matching the editor's workspace API plugin so a
 * headless MCP server and a running editor share one `.seldon/workspaces` store.
 * One `<id>.json` file per workspace; the directory listing is the index.
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

/**
 * A multi-file workspace store over a directory, the headless twin of the
 * editor's `workspaceApiPlugin`. It reads and writes the same `<id>.json` record
 * shape, so pointing the MCP server at a project's `.seldon/workspaces` folder
 * lets the editor and a headless agent share workspaces. Writes go through a
 * temp file and a rename, so a reader never sees a half-written file.
 */
export class WorkspaceStore {
  private readonly dir: string

  constructor(dir: string) {
    this.dir = dir
  }

  /** Lists every stored workspace id, in directory order. */
  async listIds(): Promise<string[]> {
    await this.ensureDir()
    const entries = await fs.readdir(this.dir)

    return entries.filter((entry) => entry.endsWith(".json")).map((entry) => entry.slice(0, -5))
  }

  /** Reads one workspace, or null when the file is absent or unreadable. */
  async read(id: string): Promise<StoreEntry | null> {
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
   * The record file's mtime and size, or null when it is absent. A caller
   * compares this against a cached token to skip a full reload when the file has
   * not changed, so the hot read path stays a single `stat`.
   */
  async statToken(id: string): Promise<StatToken | null> {
    try {
      const stat = await fs.stat(this.recordPath(id))

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

  /** Persists one workspace atomically, keeping a single `.bak` of the prior file. */
  async write(id: string, workspace: Workspace): Promise<void> {
    await this.ensureDir()
    const target = this.recordPath(id)
    const ordered = orderWorkspaceNodeKeys(workspace)

    const record: StoredWorkspace = {
      id,
      workspace: ordered,
      updatedAt: new Date().toISOString(),
      lastEditor: "mcp",
    }

    try {
      await fs.access(target)
      await fs.copyFile(target, `${target}.bak`)
    } catch {
      // No prior file to back up, which is the normal first-write case.
    }

    const tmp = `${target}.${process.pid}.${Date.now()}.tmp`

    await fs.writeFile(tmp, JSON.stringify(record, null, 2), "utf8")
    await fs.rename(tmp, target)
  }

  private recordPath(id: string): string {
    const safe = id.replace(/[^a-zA-Z0-9_-]/g, "")

    return path.join(this.dir, `${safe}.json`)
  }

  private async ensureDir(): Promise<void> {
    await fs.mkdir(this.dir, { recursive: true })
  }
}
