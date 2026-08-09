import { randomUUID } from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

import {
  createNodeExportAssetReader,
  createResolvedExportAssetReader,
  exportWorkspace,
} from "@seldon/factory"

import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"

import { EditSession, safeApply } from "../tools"
import { WorkspaceStore } from "./store"

import type {
  CheckpointInfo,
  ExportedFile,
  McpExportOptions,
  McpHost,
  WorkspaceTarget,
} from "./server"
import type { Workspace } from "@seldon/core/workspace/types"
import type { ExportOptions } from "@seldon/factory"

/** How many revisions the per-target undo history keeps in memory. */
const HISTORY_LIMIT = 100

const DEFAULT_COMPONENTS_FOLDER = "components"

/** The live state the host holds for one workspace between calls. */
interface TargetState {
  workspace: Workspace
  version: number
  history: Workspace[]
  historyIndex: number
  checkpoints: CheckpointRecord[]
  queue: Promise<unknown>
}

interface CheckpointRecord {
  id: string
  version: number
  workspace: Workspace
  label?: string
}

/** Options to construct a {@link HeadlessHost}. */
export interface HeadlessHostOptions {
  /** Directory holding the `<id>.json` workspace files. */
  storeDir: string
  /** Root the factory reads engine assets from during export. Defaults to cwd. */
  exportRoot?: string
}

/**
 * Walks up from a start directory to the monorepo root that holds the
 * `packages/core` source the factory reads icon and native files from. Returns
 * null off the monorepo, where the export resolves the installed `@seldon/core`.
 */
function findMonorepoRoot(start: string): string | null {
  let current = start

  while (true) {
    if (fs.existsSync(path.join(current, "packages/core/icon-sets/catalog"))) return current
    const parent = path.dirname(current)

    if (parent === current) return null
    current = parent
  }
}

/** Encodes an exported file's contents as text, base64 for binary assets. */
function toExportedFile(file: { path: string; content: string | ArrayBuffer }): ExportedFile {
  if (typeof file.content === "string") return { path: file.path, contents: file.content }

  return { path: file.path, contents: Buffer.from(file.content).toString("base64") }
}

/**
 * An {@link McpHost} over an in-memory engine and a file-backed store. It holds
 * one live workspace per id, loaded lazily from the store on first touch, and
 * routes every write through the shared `safeApply` pipeline and the reducer, so
 * an external agent gets the same rule enforcement the editor does. Each id has
 * its own promise queue, so concurrent commits on one workspace serialize into
 * atomic read-modify-write-persist steps and never lose an update. Undo, redo,
 * and checkpoints run against a bounded per-target history. This is the host the
 * `seldon-mcp` stdio and HTTP bins wire to a transport.
 */
export class HeadlessHost implements McpHost {
  private readonly store: WorkspaceStore
  private readonly exportRoot: string
  private readonly states = new Map<string, TargetState>()

  constructor(options: HeadlessHostOptions) {
    this.store = new WorkspaceStore(options.storeDir)
    this.exportRoot = path.resolve(options.exportRoot ?? process.cwd())
  }

  /** Loads a target into memory once, then serves it from the cache. */
  private async getState(id: string): Promise<TargetState> {
    const cached = this.states.get(id)

    if (cached) return cached
    const entry = await this.store.read(id)

    if (!entry) throw new Error(`No workspace "${id}" in the store.`)

    return this.seedState(id, entry.workspace)
  }

  private seedState(id: string, workspace: Workspace): TargetState {
    const state: TargetState = {
      workspace,
      version: 0,
      history: [workspace],
      historyIndex: 0,
      checkpoints: [],
      queue: Promise.resolve(),
    }

    this.states.set(id, state)

    return state
  }

  /** Serializes work on one target so read-modify-write-persist stays atomic. */
  private enqueue<T>(state: TargetState, run: () => Promise<T>): Promise<T> {
    const next = state.queue.then(run, run)

    state.queue = next.then(
      () => undefined,
      () => undefined,
    )

    return next
  }

  /** Adopts a new workspace as one revision: records history and persists. */
  private async adopt(id: string, state: TargetState, workspace: Workspace): Promise<number> {
    state.workspace = workspace
    state.history = state.history.slice(0, state.historyIndex + 1)
    state.history.push(workspace)

    if (state.history.length > HISTORY_LIMIT) state.history.shift()
    state.historyIndex = state.history.length - 1
    state.version += 1
    await this.store.write(id, workspace)

    return state.version
  }

  async listTargets(): Promise<WorkspaceTarget[]> {
    const ids = await this.store.listIds()
    const targets: WorkspaceTarget[] = []

    for (const id of ids) {
      const entry = await this.store.read(id)

      targets.push({
        id,
        mode: "headless",
        editorConnected: false,
        label: entry?.label,
      })
    }

    return targets
  }

  async defaultTargetId(preferred?: string): Promise<string | { candidates: string[] }> {
    const ids = await this.store.listIds()

    if (preferred && ids.includes(preferred)) return preferred
    if (ids.length === 1) return ids[0]

    return { candidates: ids }
  }

  async status(targetId: string): Promise<WorkspaceTarget> {
    const entry = await this.store.read(targetId)

    return { id: targetId, mode: "headless", editorConnected: false, label: entry?.label }
  }

  async openSession(targetId: string): Promise<EditSession> {
    const state = await this.getState(targetId)

    return new EditSession(state.workspace)
  }

  async commitSession(targetId: string, session: EditSession): Promise<{ version: number }> {
    const state = await this.getState(targetId)

    return this.enqueue(state, async () => {
      // Re-apply the session's accepted actions against the current workspace,
      // not the snapshot the session opened on, so a concurrent commit that
      // landed first is preserved rather than overwritten.
      const result = safeApply(state.workspace, session.actions)
      const version = await this.adopt(targetId, state, result.workspace)

      return { version }
    })
  }

  async export(targetId: string, options?: McpExportOptions): Promise<ExportedFile[]> {
    const state = await this.getState(targetId)
    const monorepoRoot = findMonorepoRoot(this.exportRoot)
    const rootDirectory = monorepoRoot ?? this.exportRoot
    const assetReader = monorepoRoot
      ? createNodeExportAssetReader(monorepoRoot)
      : createResolvedExportAssetReader(pathToFileURL(path.join(this.exportRoot, "index.js")).href)

    const componentsFolder = options?.componentsFolder ?? DEFAULT_COMPONENTS_FOLDER

    const exportOptions: ExportOptions = {
      rootDirectory,
      target: {
        framework: (options?.framework as ExportOptions["target"]["framework"]) ?? "react",
        styles: (options?.styles as ExportOptions["target"]["styles"]) ?? "css-properties",
      },
      output: {
        componentsFolder,
        assetsFolder: `${componentsFolder}/assets`,
        assetPublicPath: `/${componentsFolder}/assets`,
      },
      assetReader,
    }

    const files = await exportWorkspace(state.workspace, exportOptions)

    return files.map(toExportedFile)
  }

  async undo(targetId: string): Promise<{ version: number } | { message: string }> {
    const state = await this.getState(targetId)

    return this.enqueue(state, async () => {
      if (state.historyIndex === 0) return { message: "Nothing to undo." }
      state.historyIndex -= 1
      state.workspace = state.history[state.historyIndex]
      state.version += 1
      await this.store.write(targetId, state.workspace)

      return { version: state.version }
    })
  }

  async redo(targetId: string): Promise<{ version: number } | { message: string }> {
    const state = await this.getState(targetId)

    return this.enqueue(state, async () => {
      if (state.historyIndex >= state.history.length - 1) return { message: "Nothing to redo." }
      state.historyIndex += 1
      state.workspace = state.history[state.historyIndex]
      state.version += 1
      await this.store.write(targetId, state.workspace)

      return { version: state.version }
    })
  }

  async createCheckpoint(targetId: string, label?: string): Promise<CheckpointInfo> {
    const state = await this.getState(targetId)
    const id = `cp-${state.checkpoints.length + 1}`

    state.checkpoints.push({ id, version: state.version, workspace: state.workspace, label })

    return { id, version: state.version, label }
  }

  async restoreCheckpoint(
    targetId: string,
    id: string,
  ): Promise<{ version: number } | { message: string }> {
    const state = await this.getState(targetId)
    const checkpoint = state.checkpoints.find((entry) => entry.id === id)

    if (!checkpoint) return { message: `No checkpoint "${id}".` }

    return this.enqueue(state, async () => {
      // Restore as a new revision so the restore is itself undoable and does not
      // clobber redo, which is the agent-safe revert with other writers present.
      const version = await this.adopt(targetId, state, checkpoint.workspace)

      return { version }
    })
  }

  async listCheckpoints(targetId: string): Promise<CheckpointInfo[]> {
    const state = await this.getState(targetId)

    return state.checkpoints.map((entry) => ({
      id: entry.id,
      version: entry.version,
      label: entry.label,
    }))
  }

  async createWorkspace(options: { id?: string; label?: string }): Promise<{ id: string }> {
    const base = createEmptyWorkspace()
    // createEmptyWorkspace returns a frozen snapshot, so label is applied by
    // cloning the metadata rather than mutating in place.
    const workspace: Workspace = options.label
      ? { ...base, metadata: { ...base.metadata, label: options.label } }
      : base
    const id = options.id ?? workspace.metadata.id ?? randomUUID()

    await this.store.write(id, workspace)
    this.seedState(id, workspace)

    return { id }
  }
}
