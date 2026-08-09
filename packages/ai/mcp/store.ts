import fs from "node:fs/promises"
import path from "node:path"

import { loadWorkspace } from "@seldon/core/workspace/reducers/load-workspace"
import { orderWorkspaceNodeKeys } from "@seldon/core/workspace/helpers/nodes/order-entry-node-keys"

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

  private recordPath(id: string): string {
    const safe = id.replace(/[^a-zA-Z0-9_-]/g, "")

    return path.join(this.dir, `${safe}.json`)
  }

  private async ensureDir(): Promise<void> {
    await fs.mkdir(this.dir, { recursive: true })
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
}
