import type { IsolationClosure } from "./isolation"
import type { TargetResolution, TargetSpec } from "./resolve-target"
import type { SelectionScope } from "../types"
import type { TSchema } from "typebox"
import type { Board, BoardKey, Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

/**
 * The selection identity a turn acts within. It mirrors the editor's resolved
 * selection: the active board key, the selected node and its variant-root
 * column, the selected board, the selection scope, the resource entry under a
 * resource scope, and the isolation closure when Isolation Mode is on. It never
 * carries the workspace itself, which lives on the working copy, so reads always
 * see the live copy and selection stays stable across a turn.
 */
export interface SelectionContext {
  resolvedKey?: BoardKey
  activeBoard?: Board
  selectedNodeId?: string
  selectedNodeRootId?: string
  selectedBoardId?: BoardKey
  scope?: SelectionScope
  resourceTargetId?: string
  isolation?: IsolationClosure
}

/** Arguments for one property edit, shared by set_properties and the verb tools. */
export interface PropertyEditArgs {
  target: TargetSpec
  properties: Record<string, unknown>
  scope?: "instance" | "all"
  match?: string
}

/** The accumulated result adopted when a turn or transaction commits. */
export interface CommitResult {
  workspace: Workspace
  actions: WorkspaceAction[]
}

/**
 * The single seam between a tool and its host. A tool reads the live working
 * copy with {@link getWorkspace}, sees the stable {@link selection}, resolves a
 * loose target through {@link resolveTarget}, and writes only by proposing typed
 * actions through {@link propose} or {@link applyPropertyEdit}. A host decides
 * what a commit adopts. Pi backs this with a per-turn session and the editor
 * selection; MCP backs it with a per-connection session and the select tools.
 */
export interface ToolContext {
  getWorkspace(): Workspace
  selection: SelectionContext
  setSelection(patch: Partial<SelectionContext>): void
  resolveTarget(target: TargetSpec, match?: string): TargetResolution
  propose(action: WorkspaceAction): string
  applyPropertyEdit(args: PropertyEditArgs): string
  commit(): CommitResult
  rollback(): void
}

/** The category a tool falls in, used by an adapter to decide exposure. */
export type ToolKind = "read" | "write" | "select"

/**
 * One transport-neutral tool. `parameters` is a TypeBox schema, which is also
 * JSON Schema, so both the Pi harness and the MCP SDK consume it directly.
 * `run` returns the plain text an adapter wraps in its own result shape.
 */
export interface SeldonTool {
  name: string
  label: string
  description: string
  kind: ToolKind
  parameters: TSchema
  run(ctx: ToolContext, params: Record<string, unknown>): string | Promise<string>
}

/**
 * Declares one tool with its parameter type inferred for the `run` body, then
 * erases the parameter generic so a heterogeneous registry stays one array. The
 * body casts `params` the same way the Pi tools always have.
 */
export function defineSeldonTool<S extends TSchema>(def: {
  name: string
  label: string
  description: string
  kind: ToolKind
  parameters: S
  run(ctx: ToolContext, params: Record<string, unknown>): string | Promise<string>
}): SeldonTool {
  return def
}

/** Wraps a plain string in the tool result shape the Pi harness expects. */
export function textResult(text: string) {
  return { content: [{ type: "text" as const, text }], details: {} }
}

/**
 * Joins section lines, or returns the fallback when the section is empty. A
 * section returns blank spacer lines even when it has no real content, so this
 * filters those out before deciding whether to show the fallback.
 */
export function joinOrEmpty(lines: string[], empty: string): string {
  const body = lines.filter((line) => line !== "")

  return body.length > 0 ? lines.join("\n").trim() : empty
}
