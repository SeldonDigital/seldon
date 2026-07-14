import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { findNodesSection } from "../../../prompt/context-sections/workspace-index"
import type { ResolvedContext } from "../../editor-context"
import { joinOrEmpty, textResult } from "./shared"

/** Tier 3. Searches every board for nodes matching a label or catalog id query. */
export function createFindNodesTool(resolved: ResolvedContext): ToolDefinition {
  const { workspace } = resolved
  return defineTool({
    name: "find_nodes",
    label: "Find Nodes",
    description:
      "Tier 3. Search every board for nodes whose label or catalog id contains the query, returning each match's node id, board, and variant. Use only when the target is on no on-screen board. A node reached only through tier 3 needs the user's permission before you edit it.",
    parameters: Type.Object({
      query: Type.String({
        description: "Text to match against node labels and catalog ids.",
      }),
    }),
    execute: async (_id, params) =>
      textResult(
        joinOrEmpty(
          findNodesSection(workspace, params.query),
          `No nodes match "${params.query}".`,
        ),
      ),
  })
}
