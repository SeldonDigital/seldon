import type { ToolDefinition } from "@earendil-works/pi-coding-agent"

import type { ResolvedContext } from "../../editor-context"
import type { PiTurnState } from "../turn-state"
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
import { createSearchFontsTool } from "./search-fonts"
import { createSearchIconsTool } from "./search-icons"
import { createSearchThemeTokensTool } from "./search-theme-tokens"
import { createSuggestActionTool } from "./suggest-action"
import { createWidenScopeTool } from "./widen-scope"

/**
 * Read-only tools that surface Seldon reference data on demand. Keeping the
 * heavier lists (per-component vocabulary, theme tokens, catalog ids) behind
 * tools rather than in every prompt keeps the turn small and the system-prompt
 * cache warm, and the model pulls only what a given edit needs.
 *
 * Node and board tools take the turn state so they read the live working copy,
 * not the turn-start snapshot. That lets the model inspect and target a node it
 * created earlier in the same turn. Selection identity (which node or board is
 * selected, the scope) still comes from `resolved`, since the selection does not
 * change mid-turn.
 */
export function createContextTools(
  state: PiTurnState,
  resolved: ResolvedContext,
): ToolDefinition[] {
  return [
    createGetActiveBoardTool(state, resolved),
    createGetSelectionTool(state, resolved),
    createDescribeNodeTool(state),
    createGetNodePropertiesTool(state),
    createGetSelectionAncestryTool(state, resolved),
    createWidenScopeTool(state, resolved),
    createBoardSummaryTool(state, resolved),
    createGetComponentVocabularyTool(resolved),
    createListThemeTokensTool(resolved),
    createSearchThemeTokensTool(resolved),
    createSearchIconsTool(resolved),
    createSearchFontsTool(resolved),
    createListCatalogIdsTool(),
    createListActionTypesTool(),
    createGetActionSpecTool(),
    createSuggestActionTool(),
    createListBoardsTool(state),
    createFindNodesTool(state),
  ]
}
