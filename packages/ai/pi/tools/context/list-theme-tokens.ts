import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { themeIdsSection } from "../../../prompt/context-sections/theme-ids"
import { themeTokensSection } from "../../../prompt/context-sections/theme-tokens"
import type { ResolvedContext } from "../../editor-context"
import { joinOrEmpty, textResult } from "./shared"

/** Returns the theme ids for set_theme_override and the referenceable token ids. */
export function createListThemeTokensTool(
  resolved: ResolvedContext,
): ToolDefinition {
  const { workspace } = resolved
  return defineTool({
    name: "list_theme_tokens",
    label: "List Theme Tokens",
    description:
      "Return the theme ids for set_theme_override and the token ids referenced as @scope.key, for example @swatch.primary.",
    parameters: Type.Object({}),
    execute: async () =>
      textResult(
        joinOrEmpty(
          [...themeIdsSection(workspace), ...themeTokensSection(workspace)],
          "No theme tokens available.",
        ),
      ),
  })
}
