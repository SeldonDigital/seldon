import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"

import { SELDON_TOOLS, SELDON_TOOLS_BY_NAME } from "../tools"

import type { EditSession, SelectionContext, ToolContext } from "../tools"
import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { TSchema } from "typebox"

/** One workspace an MCP host can address, with its current routing. */
export interface WorkspaceTarget {
  id: string
  mode: "headless" | "editor"
  editorConnected: boolean
  label?: string
}

/** One exported file, path relative to the export root plus its text. */
export interface ExportedFile {
  path: string
  contents: string
}

/** Options a caller may pass to an export. Framework and styles pick the target. */
export interface McpExportOptions {
  framework?: string
  styles?: string
  componentsFolder?: string
  outputDir?: string
  write?: boolean
}

/** One stored checkpoint an agent can restore. */
export interface CheckpointInfo {
  id: string
  version: number
  label?: string
}

/**
 * The environment `createSeldonMcpServer` runs against. A host owns workspaces
 * and persistence; the tools do the design work. `HeadlessHost` implements this
 * over an in-memory engine and a file store; `BridgeHost` implements it over a
 * live editor tab with a headless fallback. Everything above this interface is
 * transport-agnostic.
 */
export interface McpHost {
  listTargets(): Promise<WorkspaceTarget[]>
  /**
   * Resolves the workspace an untargeted call acts on. Returns the id when it is
   * unambiguous (a pin, the current selection, or the sole workspace), otherwise
   * a candidate list so the agent picks explicitly.
   */
  defaultTargetId(preferred?: string): Promise<string | { candidates: string[] }>
  status(targetId: string): Promise<WorkspaceTarget>
  /**
   * Opens an edit session seeded from the target's current workspace and a base
   * selection. A write proposes into it; `commitSession` adopts it.
   */
  openSession(targetId: string, options?: { prefer?: "editor" | "headless" }): Promise<EditSession>
  /** Adopts a session's working copy as one revision and persists it. */
  commitSession(targetId: string, session: EditSession): Promise<{ version: number }>
  export(targetId: string, options?: McpExportOptions): Promise<ExportedFile[]>
  undo(targetId: string): Promise<{ version: number } | { message: string }>
  redo(targetId: string): Promise<{ version: number } | { message: string }>
  createCheckpoint(targetId: string, label?: string): Promise<CheckpointInfo>
  restoreCheckpoint(
    targetId: string,
    id: string,
  ): Promise<{ version: number } | { message: string }>
  listCheckpoints(targetId: string): Promise<CheckpointInfo[]>
  createWorkspace(options: { id?: string; label?: string }): Promise<{ id: string }>
}

/** Per-connection state: the pinned target, the running selection, an open transaction. */
interface ConnectionState {
  selection: SelectionContext
  targetId?: string
  transaction?: { targetId: string; session: EditSession }
}

/** Reads the JSON-schema properties/required off a TypeBox object schema. */
interface JsonObjectSchema {
  [key: string]: unknown
  type: "object"
  properties?: Record<string, unknown>
  required?: string[]
}

/**
 * Adds the optional `targetWorkspaceId` and `prefer` parameters every MCP tool
 * accepts, so an agent can address one of several workspaces and steer routing
 * without the neutral tool schema knowing about hosts.
 */
function withHostParams(schema: TSchema): JsonObjectSchema {
  const base = schema as unknown as JsonObjectSchema

  return {
    ...base,
    type: "object",
    properties: {
      ...(base.properties ?? {}),
      targetWorkspaceId: {
        type: "string",
        description:
          "Optional workspace id to target when the store holds several. Defaults to the selected or sole workspace.",
      },
      prefer: {
        type: "string",
        enum: ["editor", "headless"],
        description: "Optional routing hint when both a live editor and a headless engine exist.",
      },
    },
    required: base.required ?? [],
  }
}

/** Wraps text in the MCP tool result shape, marking an error when needed. */
function toolResult(text: string, isError = false) {
  return { content: [{ type: "text" as const, text }], isError }
}

/** A host/session tool defined against the host and the connection state. */
interface HostTool {
  name: string
  description: string
  inputSchema: JsonObjectSchema
  run(args: Record<string, unknown>): Promise<string>
}

const OBJECT_SCHEMA: JsonObjectSchema = { type: "object", properties: {}, required: [] }

/**
 * Builds a configured MCP `Server` from a host, transport-agnostic. It registers
 * every neutral tool from the shared registry plus the host and session tools,
 * wiring each write through the shared edit-session model so an external agent
 * can never break core or factory rules. The caller connects it to whatever
 * transport its runtime offers (stdio, Streamable HTTP, a request handler).
 */
export function createSeldonMcpServer(host: McpHost): Server {
  const state: ConnectionState = { selection: {} }

  const server = new Server(
    { name: "seldon", version: "0.0.0" },
    {
      capabilities: { tools: {} },
      instructions:
        "Drive Seldon designs safely. Discover with the read tools, set a target with select_node/select_board/set_scope, and edit only through the write tools; every write passes the same safe-apply pipeline the editor uses. Group multi-step edits in begin_change/commit_change so they land as one revision.",
    },
  )

  /** Resolves the workspace id for a call, or a directive to pick one. */
  async function resolveTargetId(
    args: Record<string, unknown>,
  ): Promise<{ id: string } | { directive: string }> {
    const explicit = (args.targetWorkspaceId as string | undefined) ?? state.targetId
    const resolved = await host.defaultTargetId(explicit)

    if (typeof resolved === "string") return { id: resolved }

    if (resolved.candidates.length === 0) {
      return {
        directive:
          "No workspaces in the store yet. Create one with the workspace_create tool, or run `npx seldon-mcp init` in your project to scaffold a store and a starter workspace.",
      }
    }

    return {
      directive: `The store holds several workspaces. Call workspace_select with one of: ${resolved.candidates.join(", ")}, or pass targetWorkspaceId.`,
    }
  }

  /** Runs one neutral tool against the right session and applies its write policy. */
  async function runRegistryTool(name: string, args: Record<string, unknown>): Promise<string> {
    const tool = SELDON_TOOLS_BY_NAME.get(name)

    if (!tool) return `Unknown tool "${name}".`

    const resolved = await resolveTargetId(args)

    if ("directive" in resolved) return resolved.directive
    const targetId = resolved.id
    const prefer = args.prefer as "editor" | "headless" | undefined

    // An open transaction on this target accumulates; otherwise the call runs on
    // an ephemeral session that commits a bare write as one revision.
    const inTransaction = state.transaction !== undefined && state.transaction.targetId === targetId
    const session: ToolContext = inTransaction
      ? state.transaction!.session
      : await host.openSession(targetId, { prefer })

    if (!inTransaction) session.setSelection(state.selection)

    const params = { ...args }

    delete params.targetWorkspaceId
    delete params.prefer

    const text = await tool.run(session, params)

    if (tool.kind === "select") {
      state.selection = session.selection
    }

    if (tool.kind === "write" && !inTransaction) {
      const edit = session as EditSession

      if (edit.actions.length > 0) {
        const { version } = await host.commitSession(targetId, edit)

        return `${text}\nCommitted as revision ${version}.`
      }
    }

    return text
  }

  const hostTools: HostTool[] = [
    {
      name: "get_target_status",
      description:
        "Report the target workspace's routing: its id, whether an editor tab is attached, and whether it is served headless or through the editor.",
      inputSchema: OBJECT_SCHEMA,
      run: async (args) => {
        const resolved = await resolveTargetId(args)

        if ("directive" in resolved) return resolved.directive
        const status = await host.status(resolved.id)

        return JSON.stringify(status, null, 2)
      },
    },
    {
      name: "workspace_list",
      description: "List every workspace the store holds, with each one's routing status.",
      inputSchema: OBJECT_SCHEMA,
      run: async () => {
        const targets = await host.listTargets()

        if (targets.length === 0) return "No workspaces in the store."

        return targets
          .map(
            (t) =>
              `${t.id}${t.label ? ` "${t.label}"` : ""} — ${t.mode}${t.editorConnected ? " (editor connected)" : ""}`,
          )
          .join("\n")
      },
    },
    {
      name: "workspace_select",
      description:
        "Pin a workspace as the default target for this connection, so later calls omit targetWorkspaceId.",
      inputSchema: {
        type: "object",
        properties: {
          workspaceId: { type: "string", description: "Workspace id to pin." },
        },
        required: ["workspaceId"],
      },
      run: async (args) => {
        const id = args.workspaceId as string
        const targets = await host.listTargets()

        if (!targets.some((t) => t.id === id)) {
          return `No workspace "${id}" in the store. Call workspace_list for ids.`
        }

        state.targetId = id
        state.selection = {}

        return `Pinned workspace ${id} as the default target.`
      },
    },
    {
      name: "workspace_create",
      description: "Create a new empty workspace in the store and return its id.",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string", description: "Optional id for the new workspace." },
          label: { type: "string", description: "Optional label for the new workspace." },
        },
        required: [],
      },
      run: async (args) => {
        const created = await host.createWorkspace({
          id: args.id as string | undefined,
          label: args.label as string | undefined,
        })

        state.targetId = created.id

        return `Created workspace ${created.id} and pinned it as the default target.`
      },
    },
    {
      name: "workspace_export",
      description:
        "Export the target workspace to framework code, write the files into the project, and return the list of files produced. Pass framework and styles to pick the target. Set write to false to list the paths without writing.",
      inputSchema: withHostParams({
        type: "object",
        properties: {
          framework: {
            type: "string",
            description: 'Export framework, for example "react" or "vue".',
          },
          styles: { type: "string", description: 'Style output, for example "css-properties".' },
          componentsFolder: { type: "string", description: "Output folder for components." },
          outputDir: {
            type: "string",
            description:
              "Subfolder of the project to write the export into. Defaults to the project root.",
          },
          write: {
            type: "boolean",
            description:
              "Write the files to disk under the project. Defaults to true. Set false to only list the paths.",
          },
        },
        required: [],
      } as unknown as TSchema),
      run: async (args) => {
        const resolved = await resolveTargetId(args)

        if ("directive" in resolved) return resolved.directive
        const write = args.write !== false
        const outputDir = args.outputDir as string | undefined
        const files = await host.export(resolved.id, {
          framework: args.framework as string | undefined,
          styles: args.styles as string | undefined,
          componentsFolder: args.componentsFolder as string | undefined,
          outputDir,
          write,
        })

        if (files.length === 0) return "Export produced no files."

        const location = outputDir ?? "the project root"
        const header = write
          ? `Wrote ${files.length} file(s) to ${location}:`
          : `Exported ${files.length} file(s):`

        return `${header}\n${files.map((f) => `- ${f.path}`).join("\n")}`
      },
    },
    {
      name: "begin_change",
      description:
        "Open a transaction on the target workspace. Every write until commit_change accumulates in one edit session and adopts as a single revision (one undo step). Reads inside see the pending changes.",
      inputSchema: OBJECT_SCHEMA,
      run: async (args) => {
        if (state.transaction) {
          return `A transaction is already open on ${state.transaction.targetId}. Call commit_change or rollback_change first.`
        }

        const resolved = await resolveTargetId(args)

        if ("directive" in resolved) return resolved.directive
        const session = await host.openSession(resolved.id, {
          prefer: args.prefer as "editor" | "headless" | undefined,
        })

        session.setSelection(state.selection)
        state.transaction = { targetId: resolved.id, session }

        return `Opened a transaction on ${resolved.id}. Writes accumulate until commit_change.`
      },
    },
    {
      name: "commit_change",
      description: "Adopt the open transaction's accumulated edits as one revision.",
      inputSchema: OBJECT_SCHEMA,
      run: async () => {
        const txn = state.transaction

        if (!txn) return "No transaction is open. Call begin_change first."
        const count = txn.session.actions.length

        if (count === 0) {
          state.transaction = undefined

          return "Transaction closed with no changes."
        }

        const { version } = await host.commitSession(txn.targetId, txn.session)

        state.selection = txn.session.selection
        state.transaction = undefined

        return `Committed ${count} action(s) on ${txn.targetId} as revision ${version}.`
      },
    },
    {
      name: "rollback_change",
      description: "Discard the open transaction and all its pending edits.",
      inputSchema: OBJECT_SCHEMA,
      run: async () => {
        const txn = state.transaction

        if (!txn) return "No transaction is open."
        txn.session.rollback()
        state.transaction = undefined

        return `Rolled back the transaction on ${txn.targetId}. No changes were adopted.`
      },
    },
    {
      name: "undo",
      description:
        "Undo the last revision on the target workspace. Global to the workspace, so with other writers prefer create_checkpoint/restore_checkpoint to revert your own change.",
      inputSchema: OBJECT_SCHEMA,
      run: async (args) => {
        const resolved = await resolveTargetId(args)

        if ("directive" in resolved) return resolved.directive
        const result = await host.undo(resolved.id)

        return "message" in result ? result.message : `Undid to revision ${result.version}.`
      },
    },
    {
      name: "redo",
      description: "Redo the last undone revision on the target workspace.",
      inputSchema: OBJECT_SCHEMA,
      run: async (args) => {
        const resolved = await resolveTargetId(args)

        if ("directive" in resolved) return resolved.directive
        const result = await host.redo(resolved.id)

        return "message" in result ? result.message : `Redid to revision ${result.version}.`
      },
    },
    {
      name: "create_checkpoint",
      description:
        "Capture the target workspace's current state as a named checkpoint. The agent-safe revert: restore_checkpoint re-applies it as a new revision, so it survives other writers.",
      inputSchema: withHostParams({
        type: "object",
        properties: {
          label: { type: "string", description: "Optional label for the checkpoint." },
        },
        required: [],
      } as unknown as TSchema),
      run: async (args) => {
        const resolved = await resolveTargetId(args)

        if ("directive" in resolved) return resolved.directive
        const checkpoint = await host.createCheckpoint(
          resolved.id,
          args.label as string | undefined,
        )

        return `Created checkpoint ${checkpoint.id} at revision ${checkpoint.version}.`
      },
    },
    {
      name: "restore_checkpoint",
      description:
        "Restore a checkpoint as a new revision, so it is itself undoable and does not clobber redo.",
      inputSchema: withHostParams({
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Checkpoint id from create_checkpoint or list_checkpoints.",
          },
        },
        required: ["id"],
      } as unknown as TSchema),
      run: async (args) => {
        const resolved = await resolveTargetId(args)

        if ("directive" in resolved) return resolved.directive
        const result = await host.restoreCheckpoint(resolved.id, args.id as string)

        return "message" in result
          ? result.message
          : `Restored checkpoint ${String(args.id)} as revision ${result.version}.`
      },
    },
    {
      name: "list_checkpoints",
      description: "List the checkpoints captured for the target workspace this session.",
      inputSchema: OBJECT_SCHEMA,
      run: async (args) => {
        const resolved = await resolveTargetId(args)

        if ("directive" in resolved) return resolved.directive
        const checkpoints = await host.listCheckpoints(resolved.id)

        if (checkpoints.length === 0) return "No checkpoints captured yet."

        return checkpoints
          .map((c) => `${c.id}${c.label ? ` "${c.label}"` : ""} at revision ${c.version}`)
          .join("\n")
      },
    },
  ]

  const hostToolsByName = new Map(hostTools.map((tool) => [tool.name, tool]))

  const registryTools: Tool[] = SELDON_TOOLS.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: withHostParams(tool.parameters) as Tool["inputSchema"],
  }))

  const hostToolDefs: Tool[] = hostTools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema as Tool["inputSchema"],
  }))

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [...registryTools, ...hostToolDefs],
  }))

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const name = request.params.name
    const args = (request.params.arguments ?? {}) as Record<string, unknown>

    try {
      const hostTool = hostToolsByName.get(name)
      const text = hostTool ? await hostTool.run(args) : await runRegistryTool(name, args)

      return toolResult(text)
    } catch (caught) {
      const reason = caught instanceof Error ? caught.message : "Tool call failed."

      return toolResult(reason, true)
    }
  })

  return server
}
