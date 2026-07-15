import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { searchFontsSection } from "../../../prompt/context-sections/fonts"
import type { ResolvedContext } from "../../editor-context"
import { joinOrEmpty, textResult } from "./shared"

/** Returns enabled font family values whose value or name matches the query. */
export function createSearchFontsTool(
  resolved: ResolvedContext,
): ToolDefinition {
  const { workspace } = resolved
  return defineTool({
    name: "search_fonts",
    label: "Search Fonts",
    description:
      'Return enabled font family values whose name matches the query, for example "Merri" or "serif". Use it to find the value for the font.family facet, which takes an enabled family value or a custom name, never a family the workspace has not enabled.',
    parameters: Type.Object({
      query: Type.String({
        description: "Text to match against enabled font family names.",
      }),
    }),
    execute: async (_id, params) =>
      textResult(
        joinOrEmpty(
          searchFontsSection(workspace, params.query),
          `No enabled fonts match "${params.query}".`,
        ),
      ),
  })
}
