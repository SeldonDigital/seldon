import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { EXPORT_FLAGS } from "@seldon/factory"

import { SELDON_TOOLS, SELDON_TOOLS_BY_NAME } from "../tools"
import { getDesignGuide } from "./guide"

import type { EditSession, SelectionContext, ToolContext } from "../tools"
import type { RejectedActionResult } from "../types"
import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { ExportScopeFlags } from "@seldon/factory"
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

/**
 * Options a caller may pass to an export. Framework and styles pick the target;
 * the {@link ExportScopeFlags} choose the scope, matching the editor dialog and
 * the CLI. An omitted flag uses the workspace setting. A passed flag is written
 * back to the workspace so the next editor, CLI, or MCP export matches.
 */
export interface McpExportOptions extends Partial<ExportScopeFlags> {
  framework?: string
  styles?: string
  componentsFolder?: string
  outputDir?: string
  write?: boolean
}

/**
 * Options a caller may pass to stage an image into the project's public folder.
 * Pass `path` or `dataUrl`, not both. `name` overrides the destination filename.
 */
export interface McpWriteImageOptions {
  path?: string
  dataUrl?: string
  name?: string
}

/**
 * Options a caller may pass to a canvas capture. An omitted target captures the
 * board the editor is currently showing. `maxSize` caps the longest JPEG side.
 */
export interface McpCaptureOptions {
  nodeId?: string
  boardKey?: string
  rootPath?: string
  maxSize?: number
  quality?: number
}

/** One JPEG rasterized from a live editor tab. `data` is bare base64. */
export interface CapturedImage {
  data: string
  mimeType: string
  width: number
  height: number
  label?: string
}

/** One stored checkpoint an agent can restore. */
export interface CheckpointInfo {
  id: string
  version: number
  label?: string
}

/** The result of adopting an edit session as one revision. */
export interface CommitOutcome {
  version: number
  rejected?: RejectedActionResult[]
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
  commitSession(targetId: string, session: EditSession): Promise<CommitOutcome>
  export(targetId: string, options?: McpExportOptions): Promise<ExportedFile[]>
  /**
   * Copies an image into the project's `public/sdn` folder and returns the
   * `/sdn/<name>` path the workspace should store on `source` or `background`.
   */
  writeImage(targetId: string, options: McpWriteImageOptions): Promise<{ publicPath: string }>
  /**
   * Rasterizes a board or node from a live editor tab. Headless hosts return a
   * message telling the agent to open the editor.
   */
  capture(
    targetId: string,
    options?: McpCaptureOptions,
  ): Promise<CapturedImage | { message: string }>
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

/** Text plus an optional image a host tool may return. */
interface HostToolResult {
  text: string
  image?: CapturedImage
}

/** Wraps text, and an optional JPEG, in the MCP tool result shape. */
function toolResult(text: string, isError = false, image?: CapturedImage) {
  const content: Array<
    { type: "text"; text: string } | { type: "image"; data: string; mimeType: string }
  > = [{ type: "text", text }]

  if (image) {
    content.push({ type: "image", data: image.data, mimeType: image.mimeType })
  }

  return { content, isError }
}

/** A host/session tool defined against the host and the connection state. */
interface HostTool {
  name: string
  description: string
  inputSchema: JsonObjectSchema
  run(args: Record<string, unknown>): Promise<string | HostToolResult>
}

const OBJECT_SCHEMA: JsonObjectSchema = { type: "object", properties: {}, required: [] }

/**
 * JSON schema properties for the export scope flags, derived from the shared
 * export flag descriptors so the `workspace_export` tool matches the editor
 * dialog and the CLI.
 */
const exportScopeFlagSchema: Record<string, { type: "boolean"; description: string }> =
  Object.fromEntries(
    EXPORT_FLAGS.map(
      (flag) => [flag.storeKey, { type: "boolean", description: flag.description }] as const,
    ),
  )

/** Reads a finite number greater than zero, or undefined when the value is not one. */
function readPositiveNumber(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return undefined

  return value
}

/** Reads a finite number in (0, 1], or undefined when the value is not one. */
function readUnitInterval(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0 || value > 1) {
    return undefined
  }

  return value
}

/** Appends rejected-action reasons to a commit message so the agent can retarget. */
function formatCommitMessage(message: string, outcome: CommitOutcome): string {
  if (!outcome.rejected || outcome.rejected.length === 0) return message

  const reasons = outcome.rejected.map((entry) => `${entry.type}: ${entry.reason}`).join(" ")

  return `${message} Some actions were rejected: ${reasons} Re-read the current state and retry those edits.`
}

/** Reads the boolean export scope flags a caller passed, ignoring the rest. */
function readExportScopeFlags(args: Record<string, unknown>): Partial<ExportScopeFlags> {
  const flags: Partial<ExportScopeFlags> = {}

  for (const flag of EXPORT_FLAGS) {
    const value = args[flag.storeKey]

    if (typeof value === "boolean") flags[flag.storeKey] = value
  }

  return flags
}

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
      instructions: `Seldon is a design engine. You compose components in a workspace, preview them, and export framework code into the project.

One-shot build from an empty workspace:
1. Call get_design_guide with section workflow before you start. Call it again for composition, properties, theme, images, or export when you need detail.
2. Build small components first, then compose them upward. Prefer create_authored_component for new pieces. The catalog is thin. Use add_component only for a useful built-in such as screen, text, icon, image, or frame.
3. Final pages are user variants of the catalog screen component. Add screen, then add_variant before you insert anything. The default screen is locked and rejects children. screenWidth and screenHeight default to 600px exact. Set them or the page clips.
4. New boards fit their content. Do not pin a board width unless you need a device frame.
5. Put images on a node with set_image. Never write a local filesystem path or a raw data URL into source or background.
6. Call commit_change, then render_preview after each meaningful compose so you can see the design. A preview shows the committed canvas, not an open transaction. It needs an editor tab with the workspace open.
7. When the design is done, call workspace_export to write framework code into the project.

Edit only through write tools. Group a multi-step edit in begin_change and commit_change so it lands as one revision. Prefer theme tokens such as @swatch.primary and @fontSize.medium over hardcoded literals.`,
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
        const outcome = await host.commitSession(targetId, edit)

        return formatCommitMessage(`${text}\nCommitted as revision ${outcome.version}.`, outcome)
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
        "Export the target workspace to framework code and write the files into the project. Files land under the project root, or under outputDir when passed. Pass framework and styles to pick the target. Set write to false to list the paths without writing.",
      inputSchema: withHostParams({
        type: "object",
        properties: {
          framework: {
            type: "string",
            description: 'Export framework, for example "react", "vue", or "html".',
          },
          styles: { type: "string", description: 'Style output, for example "css-properties".' },
          componentsFolder: { type: "string", description: "Output folder for components." },
          outputDir: {
            type: "string",
            description:
              "Project-relative folder to nest generated files. Same as workspace outputFolder. Empty is the project root. Saved on the workspace when passed.",
          },
          write: {
            type: "boolean",
            description:
              "Write the files to disk under the project. Defaults to true. Set false to only list the paths.",
          },
          ...exportScopeFlagSchema,
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
          ...readExportScopeFlags(args),
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
      name: "get_design_guide",
      description:
        "Return design guidance for building in Seldon without reading the source. Pass section workflow, composition, properties, theme, images, or export. Omit section for the index.",
      inputSchema: {
        type: "object",
        properties: {
          section: {
            type: "string",
            description:
              "Guide section: workflow, composition, properties, theme, images, or export.",
          },
        },
        required: [],
      },
      run: async (args) => {
        return getDesignGuide(typeof args.section === "string" ? args.section : undefined)
      },
    },
    {
      name: "set_image",
      description:
        "Copy a local image into the project's public/sdn folder and optionally write it onto a node as source or background. Pass a file path or a data URL. With nodeId, writes the property. Without nodeId, stages the file and returns the /sdn path. Never store a filesystem path or a raw data URL on the node yourself.",
      inputSchema: withHostParams({
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "Local file path to copy. Relative paths resolve from the project root.",
          },
          dataUrl: {
            type: "string",
            description: "Image data URL to decode and write. Use when the file is not on disk.",
          },
          name: {
            type: "string",
            description: "Optional filename under public/sdn. Defaults to the source file name.",
          },
          nodeId: {
            type: "string",
            description: "Node to write the image onto. Omit to stage the file only.",
          },
          slot: {
            type: "string",
            enum: ["source", "background"],
            description:
              "Where to write the image on the node. source is the Image source. background paints layer 0 as kind image. Defaults to source.",
          },
        },
        required: [],
      } as unknown as TSchema),
      run: async (args) => {
        const resolved = await resolveTargetId(args)

        if ("directive" in resolved) return resolved.directive
        const written = await host.writeImage(resolved.id, {
          path: typeof args.path === "string" ? args.path : undefined,
          dataUrl: typeof args.dataUrl === "string" ? args.dataUrl : undefined,
          name: typeof args.name === "string" ? args.name : undefined,
        })
        const nodeId = typeof args.nodeId === "string" ? args.nodeId : undefined

        if (!nodeId) {
          return `Staged image at ${written.publicPath}. Pass nodeId to write it onto a node.`
        }

        const slot = args.slot === "background" ? "background" : "source"
        const properties =
          slot === "background"
            ? {
                background: [
                  {
                    kind: { type: "option", value: "image" },
                    image: { type: "exact", value: written.publicPath },
                  },
                ],
              }
            : {
                source: { type: "exact", value: written.publicPath },
              }
        const write = await runRegistryTool("set_properties", {
          ...args,
          target: { nodeId },
          properties,
        })

        return `Wrote ${written.publicPath} onto ${nodeId} ${slot}.\n${write}`
      },
    },
    {
      name: "render_preview",
      description:
        "Return a JPEG of a board or node so you can check the design visually before reporting done. Needs an editor tab with the workspace open. Pass a nodeId to check one variant or part instead of a whole board, which keeps the image small. Pass a boardKey to check a board the editor is not showing. Either way the editor tab keeps its own selection, board, pan, and zoom, so a capture never moves the user. Omit both ids to capture the board the editor is showing.",
      inputSchema: withHostParams({
        type: "object",
        properties: {
          nodeId: {
            type: "string",
            description:
              "Node id to capture, from find_nodes or describe_node. Rasterizes that node alone, on whichever board holds it. Takes precedence over boardKey.",
          },
          boardKey: {
            type: "string",
            description: "Board key to capture, from list_boards. Used when nodeId is omitted.",
          },
          maxSize: {
            type: "number",
            description:
              "Longest JPEG side in pixels. Defaults to 1200. Does not enlarge a smaller target.",
          },
          quality: {
            type: "number",
            description: "JPEG quality from 0 to 1. Defaults to 0.8.",
          },
        },
        required: [],
      } as unknown as TSchema),
      run: async (args) => {
        const resolved = await resolveTargetId(args)

        if ("directive" in resolved) return resolved.directive
        const result = await host.capture(resolved.id, {
          nodeId: typeof args.nodeId === "string" ? args.nodeId : undefined,
          boardKey: typeof args.boardKey === "string" ? args.boardKey : undefined,
          maxSize: readPositiveNumber(args.maxSize),
          quality: readUnitInterval(args.quality),
        })

        if ("message" in result) return result.message

        const label = result.label ?? "the canvas"
        const size = `${result.width}x${result.height}`
        const pending =
          state.transaction?.targetId === resolved.id
            ? " This capture shows the committed canvas. Call commit_change first to see pending edits."
            : ""

        return {
          text: `Captured ${label} as a ${size} JPEG.${pending}`,
          image: result,
        }
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

        const outcome = await host.commitSession(txn.targetId, txn.session)

        state.selection = txn.session.selection
        state.transaction = undefined

        return formatCommitMessage(
          `Committed ${count} action(s) on ${txn.targetId} as revision ${outcome.version}.`,
          outcome,
        )
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
      const output = hostTool ? await hostTool.run(args) : await runRegistryTool(name, args)

      if (typeof output === "string") return toolResult(output)

      return toolResult(output.text, false, output.image)
    } catch (caught) {
      const reason = caught instanceof Error ? caught.message : "Tool call failed."

      return toolResult(reason, true)
    }
  })

  return server
}
