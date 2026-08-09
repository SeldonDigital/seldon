import { EditSession } from "@seldon/ai"

import type { BridgeCommandType, BridgeContext, BridgeResult } from "../lib/mcp/bridge-protocol"
import type {
  CheckpointInfo,
  ExportedFile,
  McpExportOptions,
  McpHost,
  SelectionContext,
  WorkspaceTarget,
} from "@seldon/ai"
import type { HeadlessHost } from "@seldon/hari"
import type { SelectionScope } from "@seldon/ai"
import type { BoardKey, WorkspaceAction } from "@seldon/core/workspace/types"
import type { ServerResponse } from "node:http"

/** How long the server waits for a tab to answer one command. */
const COMMAND_TIMEOUT_MS = 15_000

interface PendingCommand {
  resolve: (result: BridgeResult) => void
  reject: (error: Error) => void
  timer: ReturnType<typeof setTimeout>
}

/** Raised when a target has no connected editor tab, so the host falls back. */
class NoTabError extends Error {}

/**
 * The SSE side of the bridge. It holds one open response stream per workspace a
 * tab has open, keyed by workspace id, and correlates each command it pushes
 * with the result the tab posts back. One command is in flight per id at a time,
 * which the host's per-target serialization guarantees.
 */
export class BridgeHub {
  private readonly clients = new Map<string, ServerResponse>()
  private readonly pending = new Map<string, PendingCommand>()
  private sequence = 0

  /** Registers a tab's event stream for a workspace and clears it on close. */
  addClient(workspaceId: string, res: ServerResponse): void {
    this.clients.get(workspaceId)?.end()
    this.clients.set(workspaceId, res)

    res.on("close", () => {
      if (this.clients.get(workspaceId) === res) this.clients.delete(workspaceId)
    })
  }

  /** The workspace ids that currently have a connected tab. */
  connectedIds(): string[] {
    return [...this.clients.keys()]
  }

  hasClient(workspaceId: string): boolean {
    return this.clients.has(workspaceId)
  }

  /** Settles the pending command a tab result correlates to. */
  deliverResult(result: BridgeResult): void {
    const pending = this.pending.get(result.id)

    if (!pending) return
    clearTimeout(pending.timer)
    this.pending.delete(result.id)
    pending.resolve(result)
  }

  /**
   * Pushes one command to the tab holding this workspace and resolves with its
   * result. Throws {@link NoTabError} when no tab is connected, so the host
   * routes to its headless fallback instead.
   */
  send(
    workspaceId: string,
    type: BridgeCommandType,
    extra: { actions?: WorkspaceAction[]; workspace?: unknown } = {},
  ): Promise<BridgeResult> {
    const client = this.clients.get(workspaceId)

    if (!client) throw new NoTabError(`No editor tab connected for workspace ${workspaceId}.`)
    const id = `cmd-${(this.sequence += 1)}`

    return new Promise<BridgeResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id)
        reject(new Error(`Editor tab did not answer "${type}" within ${COMMAND_TIMEOUT_MS}ms.`))
      }, COMMAND_TIMEOUT_MS)

      this.pending.set(id, { resolve, reject, timer })
      client.write(`data: ${JSON.stringify({ id, type, ...extra })}\n\n`)
    })
  }
}

/** One checkpoint the bridge captured from a live tab. */
interface BridgeCheckpoint {
  id: string
  version: number
  workspace: unknown
  targetId: string
  label?: string
}

/** Maps a tab's reported context onto the neutral selection the tools read. */
function selectionFromContext(context: BridgeContext): SelectionContext {
  return {
    resolvedKey: context.activeBoardKey as BoardKey | undefined,
    selectedNodeId: context.selectedNodeId,
    selectedNodeRootId: context.selectedNodeRootId,
    selectedBoardId: context.selectedBoardId as BoardKey | undefined,
    scope: context.scope as SelectionScope | undefined,
    resourceTargetId: context.resourceTargetId,
  }
}

/**
 * An {@link McpHost} that relays to a live editor tab, with a headless fallback.
 * When a tab has the target workspace open, reads and writes route to it over
 * SSE: the tab reports its current workspace and selection, folds a commit's
 * actions through its own reducer as one undo step, and steps its own history.
 * The agent then edits exactly what the user sees, and every change lands in the
 * tab's undo stack. When no tab is connected, calls fall through to the headless
 * host over the shared store, so the same MCP endpoint serves both.
 */
export class BridgeHost implements McpHost {
  private readonly hub: BridgeHub
  private readonly fallback: HeadlessHost
  private readonly checkpoints: BridgeCheckpoint[] = []

  constructor(hub: BridgeHub, fallback: HeadlessHost) {
    this.hub = hub
    this.fallback = fallback
  }

  private async context(targetId: string): Promise<BridgeContext> {
    const result = await this.hub.send(targetId, "context")

    if (!result.ok || !result.context) {
      throw new Error(result.error ?? "The editor tab returned no context.")
    }

    return result.context
  }

  async listTargets(): Promise<WorkspaceTarget[]> {
    const connected = new Set(this.hub.connectedIds())
    const stored = await this.fallback.listTargets()
    const seen = new Set(stored.map((target) => target.id))

    const targets: WorkspaceTarget[] = stored.map((target) => ({
      ...target,
      mode: connected.has(target.id) ? "editor" : "headless",
      editorConnected: connected.has(target.id),
    }))

    for (const id of connected) {
      if (!seen.has(id)) targets.push({ id, mode: "editor", editorConnected: true })
    }

    return targets
  }

  async defaultTargetId(preferred?: string): Promise<string | { candidates: string[] }> {
    const connected = this.hub.connectedIds()

    if (preferred) return preferred
    if (connected.length === 1) return connected[0]
    if (connected.length > 1) return { candidates: connected }

    return this.fallback.defaultTargetId(preferred)
  }

  async status(targetId: string): Promise<WorkspaceTarget> {
    const connected = this.hub.hasClient(targetId)

    if (connected) return { id: targetId, mode: "editor", editorConnected: true }

    return this.fallback.status(targetId)
  }

  async openSession(targetId: string): Promise<EditSession> {
    if (!this.hub.hasClient(targetId)) return this.fallback.openSession(targetId)
    const context = await this.context(targetId)

    return new EditSession(context.workspace, selectionFromContext(context))
  }

  async commitSession(targetId: string, session: EditSession): Promise<{ version: number }> {
    if (!this.hub.hasClient(targetId)) return this.fallback.commitSession(targetId, session)
    const result = await this.hub.send(targetId, "apply", { actions: session.actions })

    if (!result.ok) throw new Error(result.error ?? "The editor tab rejected the change.")

    return { version: result.version ?? 0 }
  }

  async export(targetId: string, options?: McpExportOptions): Promise<ExportedFile[]> {
    // Export always runs headless in the dev server, which has the factory and
    // filesystem. A connected tab autosaves to the same store, so the headless
    // read is current.
    return this.fallback.export(targetId, options)
  }

  async undo(targetId: string): Promise<{ version: number } | { message: string }> {
    if (!this.hub.hasClient(targetId)) return this.fallback.undo(targetId)
    const result = await this.hub.send(targetId, "undo")

    if (!result.ok) return { message: result.error ?? "Nothing to undo." }

    return { version: result.version ?? 0 }
  }

  async redo(targetId: string): Promise<{ version: number } | { message: string }> {
    if (!this.hub.hasClient(targetId)) return this.fallback.redo(targetId)
    const result = await this.hub.send(targetId, "redo")

    if (!result.ok) return { message: result.error ?? "Nothing to redo." }

    return { version: result.version ?? 0 }
  }

  async createCheckpoint(targetId: string, label?: string): Promise<CheckpointInfo> {
    if (!this.hub.hasClient(targetId)) return this.fallback.createCheckpoint(targetId, label)
    const context = await this.context(targetId)
    const id = `cp-${this.checkpoints.length + 1}`

    this.checkpoints.push({ id, version: context.version, workspace: context.workspace, targetId, label })

    return { id, version: context.version, label }
  }

  async restoreCheckpoint(
    targetId: string,
    id: string,
  ): Promise<{ version: number } | { message: string }> {
    const checkpoint = this.checkpoints.find(
      (entry) => entry.id === id && entry.targetId === targetId,
    )

    if (!checkpoint) return this.fallback.restoreCheckpoint(targetId, id)
    if (!this.hub.hasClient(targetId)) {
      return { message: `Checkpoint ${id} was captured from a live tab. Reopen the workspace in the editor to restore it.` }
    }
    const result = await this.hub.send(targetId, "adopt", { workspace: checkpoint.workspace })

    if (!result.ok) return { message: result.error ?? "The editor tab rejected the restore." }

    return { version: result.version ?? 0 }
  }

  async listCheckpoints(targetId: string): Promise<CheckpointInfo[]> {
    const bridged = this.checkpoints
      .filter((entry) => entry.targetId === targetId)
      .map((entry) => ({ id: entry.id, version: entry.version, label: entry.label }))

    if (bridged.length > 0) return bridged

    return this.fallback.listCheckpoints(targetId)
  }

  async createWorkspace(options: { id?: string; label?: string }): Promise<{ id: string }> {
    return this.fallback.createWorkspace(options)
  }
}
