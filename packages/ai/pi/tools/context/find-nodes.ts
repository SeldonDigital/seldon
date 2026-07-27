import { defineTool } from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { findNodesSection } from "../../../prompt/context-sections/workspace-index"
import { joinOrEmpty, textResult } from "./shared"

import type { ToolDefinition } from "@earendil-works/pi-coding-agent"
import type { ResolvedContext } from "../../editor-context"
import type { PiTurnState } from "../turn-state"

/** Searches every board for nodes matching a label or catalog id query. */
export function createFindNodesTool(state: PiTurnState, resolved: ResolvedContext): ToolDefinition {
  return defineTool({
    name: "find_nodes",
    label: "Find Nodes",
    description:
      "Tier 3. Search every board for nodes whose label or catalog id contains the query, returning each match's node id, board, and variant. Use only when the target is on no on-screen board. A node reached only through tier 3 needs the user's permission before you edit it. In Isolation Mode, the search is limited to the boards in scope.",
    parameters: Type.Object({
      query: Type.String({
        description: "Text to match against node labels and catalog ids.",
      }),
    }),

    execute: async (_id, params) =>
      textResult(
        joinOrEmpty(
          findNodesSection(state.workspace, params.query, resolved.isolation?.allowedBoardKeys),
          `No nodes match "${params.query}".`,
        ),
      ),
  })
}
