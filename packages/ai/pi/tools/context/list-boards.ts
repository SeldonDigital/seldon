import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { workspaceBoardsSection } from "../../../prompt/context-sections/workspace-index"
import type { ResolvedContext } from "../../editor-context"
import { joinOrEmpty, textResult } from "./shared"

/** Tier 3. Returns every component board, to locate one other than the active. */
export function createListBoardsTool(
  resolved: ResolvedContext,
): ToolDefinition {
  const { workspace } = resolved
  return defineTool({
    name: "list_boards",
    label: "List Boards",
    description:
      "Tier 3. Return every component board as board key -> catalog id -> label, to locate a board other than the active one. A node reached only through tier 3 needs the user's permission before you edit it.",
    parameters: Type.Object({}),
    execute: async () =>
      textResult(
        joinOrEmpty(workspaceBoardsSection(workspace), "No boards available."),
      ),
  })
}
