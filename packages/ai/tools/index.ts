import { DISCOVERY_TOOLS } from "./discovery"
import { MUTATION_TOOLS } from "./mutations"
import { SELECTION_TOOLS } from "./selection"

import type { SeldonTool } from "./context"

/**
 * Every transport-neutral tool, defined once and shared by Pi and MCP. An
 * adapter maps each entry to its transport (a Pi `ToolDefinition`, or an MCP SDK
 * tool) and decides which subset to expose. Add or change a tool here and both
 * consumers pick it up.
 */
export const SELDON_TOOLS: SeldonTool[] = [
  ...DISCOVERY_TOOLS,
  ...MUTATION_TOOLS,
  ...SELECTION_TOOLS,
]

/** The registry indexed by tool name, for adapters that select tools explicitly. */
export const SELDON_TOOLS_BY_NAME: Map<string, SeldonTool> = new Map(
  SELDON_TOOLS.map((tool) => [tool.name, tool]),
)

/** Returns the tools with the given names, in the order requested, skipping any missing. */
export function selectTools(names: readonly string[]): SeldonTool[] {
  const tools: SeldonTool[] = []

  for (const name of names) {
    const tool = SELDON_TOOLS_BY_NAME.get(name)

    if (tool) tools.push(tool)
  }

  return tools
}

export { DISCOVERY_TOOLS, MUTATION_TOOLS, SELECTION_TOOLS }
export { defineSeldonTool, joinOrEmpty, textResult } from "./context"
export { EditSession, dryRun, safeApply } from "./session"
export { buildIsolationClosure } from "./isolation"
export { resolveNodeTarget } from "./resolve-target"
export { resolveCatalogId } from "./catalog-ids"
export { withCreatedIdentity } from "./created-nodes"

export type {
  CommitResult,
  PropertyEditArgs,
  SelectionContext,
  SeldonTool,
  ToolContext,
  ToolKind,
} from "./context"
export type { SafeApplyResult } from "./session"
export type { IsolationClosure } from "./isolation"
export type { TargetResolution, TargetSpec } from "./resolve-target"
export type { CatalogIdResolution } from "./catalog-ids"
