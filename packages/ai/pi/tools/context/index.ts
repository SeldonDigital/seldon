import type { ToolDefinition } from "@earendil-works/pi-coding-agent"

import type { ResolvedContext } from "../../editor-context"
import { createBoardSummaryTool } from "./board-summary"
import { createDescribeNodeTool } from "./describe-node"
import { createFindNodesTool } from "./find-nodes"
import { createGetActionSpecTool } from "./get-action-spec"
import { createGetActiveBoardTool } from "./get-active-board"
import { createGetComponentVocabularyTool } from "./get-component-vocabulary"
import { createGetNodePropertiesTool } from "./get-node-properties"
import { createGetSelectionTool } from "./get-selection"
import { createGetSelectionAncestryTool } from "./get-selection-ancestry"
import { createListActionTypesTool } from "./list-action-types"
import { createListBoardsTool } from "./list-boards"
import { createListCatalogIdsTool } from "./list-catalog-ids"
import { createListThemeTokensTool } from "./list-theme-tokens"
import { createSearchThemeTokensTool } from "./search-theme-tokens"
import { createSuggestActionTool } from "./suggest-action"
import { createWidenScopeTool } from "./widen-scope"

/**
 * Read-only tools that surface Seldon reference data on demand. Keeping the
 * heavier lists (per-component vocabulary, theme tokens, catalog ids) behind
 * tools rather than in every prompt keeps the turn small and the system-prompt
 * cache warm, and the model pulls only what a given edit needs.
 */
export function createContextTools(
  resolved: ResolvedContext,
): ToolDefinition[] {
  return [
    createGetActiveBoardTool(resolved),
    createGetSelectionTool(resolved),
    createDescribeNodeTool(resolved),
    createGetNodePropertiesTool(resolved),
    createGetSelectionAncestryTool(resolved),
    createWidenScopeTool(resolved),
    createBoardSummaryTool(resolved),
    createGetComponentVocabularyTool(resolved),
    createListThemeTokensTool(resolved),
    createSearchThemeTokensTool(resolved),
    createListCatalogIdsTool(),
    createListActionTypesTool(),
    createGetActionSpecTool(),
    createSuggestActionTool(),
    createListBoardsTool(resolved),
    createFindNodesTool(resolved),
  ]
}
