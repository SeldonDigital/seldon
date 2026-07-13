import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { searchIconsSection } from "../../../prompt/context-sections/icons"
import type { ResolvedContext } from "../../editor-context"
import { joinOrEmpty, textResult } from "./shared"

/** Returns enabled icon ids whose id or label matches the query. */
export function createSearchIconsTool(
  resolved: ResolvedContext,
): ToolDefinition {
  const { workspace } = resolved
  return defineTool({
    name: "search_icons",
    label: "Search Icons",
    description:
      'Return enabled icon ids whose id or label matches the query, for example "plus". Use it to find the id for the symbol property, which takes an id like "seldon-plus", never a display name.',
    parameters: Type.Object({
      query: Type.String({
        description: "Text to match against icon ids and labels.",
      }),
    }),
    execute: async (_id, params) =>
      textResult(
        joinOrEmpty(
          searchIconsSection(workspace, params.query),
          `No enabled icons match "${params.query}".`,
        ),
      ),
  })
}
