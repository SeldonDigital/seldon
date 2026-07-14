import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { searchThemeTokensSection } from "../../../prompt/context-sections/theme-tokens"
import type { ResolvedContext } from "../../editor-context"
import { joinOrEmpty, textResult } from "./shared"

/** Returns theme tokens whose scope or key matches the query. */
export function createSearchThemeTokensTool(
  resolved: ResolvedContext,
): ToolDefinition {
  const { workspace } = resolved
  return defineTool({
    name: "search_theme_tokens",
    label: "Search Theme Tokens",
    description:
      'Return theme tokens whose scope or key matches the query, for example "swatch". Prefer over list_theme_tokens when you need a few tokens.',
    parameters: Type.Object({
      query: Type.String({
        description: "Text to match against token scopes and keys.",
      }),
    }),
    execute: async (_id, params) =>
      textResult(
        joinOrEmpty(
          searchThemeTokensSection(workspace, params.query),
          `No theme tokens match "${params.query}".`,
        ),
      ),
  })
}
