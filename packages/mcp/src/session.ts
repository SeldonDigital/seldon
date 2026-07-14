import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"

import type { Workspace } from "@seldon/core/workspace/types"

import { ToolError } from "./errors"

/**
 * Session state. One server process serves one client session holding at
 * most one open workspace. The session tracks the file it is bound to and
 * the hash of the file content it last read or wrote — the basis of the
 * optimistic-concurrency check.
 */
export interface OpenWorkspace {
  workspace: Workspace
  /** Absolute path of the workspace file. */
  filePath: string
  /** SHA-256 of the file bytes this session last read from or wrote to disk. */
  lastKnownHash: string
}

/**
 * An in-memory snapshot of the session workspace. Holding the
 * workspace object by reference is safe — reducers never mutate their input
 * (guaranteed by the reducer-purity suite), so a snapshot can never be
 * changed by later batches.
 */
export interface Checkpoint {
  id: string
  label?: string
  createdAt: string
  /** The file the snapshot belongs to; guards restores across path switches. */
  filePath: string
  workspace: Workspace
}

/** Default cap; oldest checkpoints are evicted first (FIFO). */
export const CHECKPOINT_CAP = 20

export class Session {
  open: OpenWorkspace | null = null

  /**
   * Checkpoints, oldest first. In-memory only, by design: the disk
   * file is always current (every accepted batch persists), so a process
   * exit costs rollback depth, never work. Opening a different workspace
   * path drops them (a snapshot of another file must never be restorable
   * into the newly opened one); re-opening the same path — the
   * write-conflict recovery loop — keeps them.
   */
  readonly checkpoints: Checkpoint[] = []
  private checkpointCounter = 0

  addCheckpoint(label: string | undefined): {
    checkpoint: Checkpoint
    evictedId?: string
  } {
    const open = this.requireOpen()
    const checkpoint: Checkpoint = {
      id: `cp-${++this.checkpointCounter}`,
      ...(label !== undefined ? { label } : {}),
      createdAt: new Date().toISOString(),
      filePath: open.filePath,
      workspace: open.workspace,
    }
    this.checkpoints.push(checkpoint)
    let evictedId: string | undefined
    if (this.checkpoints.length > CHECKPOINT_CAP) {
      evictedId = this.checkpoints.shift()!.id
    }
    return { checkpoint, evictedId }
  }

  dropCheckpointsForOtherFiles(filePath: string): void {
    for (let i = this.checkpoints.length - 1; i >= 0; i--) {
      if (this.checkpoints[i]!.filePath !== filePath) {
        this.checkpoints.splice(i, 1)
      }
    }
  }

  /**
   * Top-level property keys whose schema this session has been served — via
   * `get_property_schema` or attached to a schema-gate teaching bounce. The hard
   * schema gate on `set_node_properties` checks this set. Per-session by
   * design: it survives workspace switches but not process restarts.
   */
  readonly servedPropertySchemas = new Set<string>()

  requireOpen(): OpenWorkspace {
    if (!this.open) {
      throw new ToolError({
        code: "no_workspace_open",
        message: "No workspace is open in this session.",
        recovery:
          "Call workspace_open with the path of a workspace file first " +
          "(pass createIfMissing: true to start a new one).",
      })
    }
    return this.open
  }

  /**
   * Binds the session to a workspace file it just read or created.
   * Checkpoints of other files are dropped (a snapshot of another
   * file must never be restorable into this one); re-binding the same path
   * — the write-conflict recovery loop — keeps them.
   */
  bind(filePath: string, workspace: Workspace, lastKnownHash: string): void {
    this.open = { workspace, filePath, lastKnownHash }
    this.dropCheckpointsForOtherFiles(filePath)
  }

  /**
   * The only way to persist a new workspace version: checks the
   * disk hash immediately before the write (disk wins on conflict), writes
   * atomically, then swaps the session workspace and records the written
   * hash — one sequence, so no caller can persist without updating the hash.
   *
   * `conflict` supplies the caller-specific clauses of the write-conflict
   * teaching error: what was aborted, and how to retry after reloading.
   */
  commit(
    next: Workspace,
    conflict: { aborted: string; retry: string },
  ): OpenWorkspace {
    const open = this.requireOpen()
    if (diskChangedSince(open)) {
      throw new ToolError({
        code: "write_conflict",
        message:
          "The workspace file changed on disk since this session last read " +
          `or wrote it. ${conflict.aborted} and the file was not overwritten.`,
        recovery:
          "The disk version wins. Call workspace_open with the same path " +
          `to reload, then ${conflict.retry}.`,
        detail: { filePath: open.filePath },
      })
    }
    const hash = writeWorkspaceAtomic(open.filePath, next)
    open.workspace = next
    open.lastKnownHash = hash
    return open
  }
}

export function hashBytes(content: string | Buffer): string {
  return crypto.createHash("sha256").update(content).digest("hex")
}

/** Reads a file and its content hash; null when the file does not exist. */
export function readFileWithHash(
  absPath: string,
): { text: string; hash: string } | null {
  let text: string
  try {
    text = fs.readFileSync(absPath, "utf8")
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null
    throw error
  }
  return { text, hash: hashBytes(text) }
}

export function serializeWorkspace(workspace: Workspace): string {
  return JSON.stringify(workspace, null, 2) + "\n"
}

/**
 * Atomic file write: write to a temp file in the same directory,
 * then rename over the target. Shared by workspace persistence and
 * workspace_export's per-file writes.
 */
export function writeFileAtomic(
  absPath: string,
  content: string | Buffer,
): void {
  const tmpPath = path.join(
    path.dirname(absPath),
    `.${path.basename(absPath)}.${process.pid}.${crypto.randomUUID()}.tmp`,
  )
  fs.mkdirSync(path.dirname(absPath), { recursive: true })
  fs.writeFileSync(tmpPath, content)
  fs.renameSync(tmpPath, absPath)
}

/**
 * Atomic persist. Returns the hash of the written bytes so
 * the caller can record it as the session's last-known hash.
 */
export function writeWorkspaceAtomic(
  absPath: string,
  workspace: Workspace,
): string {
  const text = serializeWorkspace(workspace)
  writeFileAtomic(absPath, text)
  return hashBytes(text)
}

/**
 * True when the file on disk no longer matches what this session last
 * read or wrote (external edit or deletion). Disk wins; the caller must
 * surface a write-conflict teaching error instead of writing.
 */
export function diskChangedSince(open: OpenWorkspace): boolean {
  const current = readFileWithHash(open.filePath)
  return current === null || current.hash !== open.lastKnownHash
}
