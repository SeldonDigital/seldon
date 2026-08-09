import { defineTool } from "@earendil-works/pi-coding-agent"

import { selectTools, textResult } from "../tools"

import type { EditSession, SeldonTool, SelectionContext, ToolContext } from "../tools"
import type { ResolvedContext } from "./editor-context"
import type { ToolDefinition } from "@earendil-works/pi-coding-agent"

/** Maps the editor's resolved context onto the neutral selection the tools read. */
export function selectionFromResolved(resolved: ResolvedContext): SelectionContext {
  return {
    resolvedKey: resolved.resolvedKey,
    activeBoard: resolved.activeBoard,
    selectedNodeId: resolved.selectedNodeId,
    selectedNodeRootId: resolved.selectedNodeRootId,
    selectedBoardId: resolved.selectedBoardId,
    scope: resolved.scope,
    resourceTargetId: resolved.resourceTargetId,
    isolation: resolved.isolation,
  }
}

/** Wraps one neutral tool as a Pi `ToolDefinition` bound to the turn's context. */
function toPiTool(tool: SeldonTool, ctx: ToolContext): ToolDefinition {
  return defineTool({
    name: tool.name,
    label: tool.label,
    description: tool.description,
    parameters: tool.parameters,
    execute: async (_id, params) =>
      textResult(await tool.run(ctx, params as Record<string, unknown>)),
  })
}

/**
 * The context (read) tool names Pi exposes every turn, in order. This mirrors the
 * former `createContextTools` list, so the Pi turn keeps the same read surface.
 * The MCP-only reads (`get_computed_node`, `dry_run_actions`, and so on) are left
 * out on purpose.
 */
const CONTEXT_TOOL_NAMES = [
  "get_active_board",
  "get_selection",
  "describe_node",
  "get_node_properties",
  "get_selection_ancestry",
  "widen_scope",
  "board_summary",
  "get_component_vocabulary",
  "describe_catalog_component",
  "list_theme_tokens",
  "search_theme_tokens",
  "search_icons",
  "search_fonts",
  "list_catalog_ids",
  "list_action_types",
  "get_action_spec",
  "suggest_action",
  "list_boards",
  "find_nodes",
]

/** The always-present mutation tool names, in order. */
const BASE_MUTATION_NAMES = [
  "set_properties",
  "add_component",
  "create_authored_component",
  "insert_component",
  "insert_variant_instance",
  "duplicate_component",
  "add_variant",
  "move_component",
  "reorder_component",
  "remove_instance",
  "set_board_label",
]

/** The intent verb tool names, present in component scopes. */
const COMPONENT_VERB_NAMES = [
  "set_text_role",
  "set_emphasis",
  "set_direction",
  "nudge",
  "align",
  "set_state_style",
  "set_node_ref",
]

/**
 * The mutation tool names for a turn, gated by scope exactly as the former
 * `createMutationTools`: the verb tools in component scopes, `apply_actions`
 * only in workspace or unset scope, and each resource family in its own scope.
 */
function mutationToolNames(scope: SelectionContext["scope"]): string[] {
  const includeAll = scope === undefined || scope === "workspace"
  const componentScope =
    scope === undefined ||
    scope === "workspace" ||
    scope === "board" ||
    scope === "variant" ||
    scope === "instance"

  const names = [...BASE_MUTATION_NAMES]

  if (componentScope) names.push(...COMPONENT_VERB_NAMES)
  if (includeAll) names.push("apply_actions")
  if (includeAll || scope === "theme") names.push("set_theme_override", "set_spacing_feel")

  if (includeAll || scope === "fontCollection") {
    names.push("set_font_collection_family_preset", "set_font_collection_family_variant")
  }

  if (includeAll || scope === "iconSet") {
    names.push("set_icon_set_subcategory_preset", "set_icon_set_override")
  }

  return names
}

/**
 * Builds the Pi tool set for one turn from the shared registry, bound to the
 * turn's {@link EditSession}. Mutation tools are gated by the session's selection
 * scope; read tools are always present. Every write routes through the session's
 * shared write model, so the Pi turn behaves as before while the tool logic is
 * the one both Pi and MCP use.
 */
export function buildPiTools(session: EditSession): ToolDefinition[] {
  const names = [...mutationToolNames(session.selection.scope), ...CONTEXT_TOOL_NAMES]

  return selectTools(names).map((tool) => toPiTool(tool, session))
}
