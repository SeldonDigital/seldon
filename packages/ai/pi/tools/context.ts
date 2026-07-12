import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { activeBoardSection } from "../../prompt/context-sections/active-board"
import { catalogComponentsSection } from "../../prompt/context-sections/catalog-components"
import { propertyShapeSection } from "../../prompt/context-sections/property-shape"
import { propertyVocabularySection } from "../../prompt/context-sections/property-vocabulary"
import { selectionSection } from "../../prompt/context-sections/selection"
import { themeIdsSection } from "../../prompt/context-sections/theme-ids"
import { themeTokensSection } from "../../prompt/context-sections/theme-tokens"
import {
  findNodesSection,
  workspaceBoardsSection,
} from "../../prompt/context-sections/workspace-index"
import {
  buildActionPayloadSpecs,
  buildActionReference,
} from "../../schema/action-schema"
import type { ResolvedContext } from "../editor-context"

function textResult(text: string) {
  return { content: [{ type: "text" as const, text }], details: {} }
}

function joinOrEmpty(lines: string[], empty: string): string {
  const body = lines.filter((line) => line !== "")
  return body.length > 0 ? lines.join("\n").trim() : empty
}

/**
 * Read-only tools that surface Seldon reference data on demand. Keeping the
 * heavier lists (per-component vocabulary, theme tokens, catalog ids) behind
 * tools rather than in every prompt keeps the turn small and the system-prompt
 * cache warm, and the model pulls only what a given edit needs.
 */
export function createContextTools(
  resolved: ResolvedContext,
): ToolDefinition[] {
  const {
    workspace,
    resolvedKey,
    activeBoard,
    selectedNodeId,
    selectedNodeRootId,
  } = resolved

  const getActiveBoard = defineTool({
    name: "get_active_board",
    label: "Get Active Board",
    description:
      "Return the active board's variant node trees with each node's id, level, and catalog id. Use these ids as nodeId, parentId, instanceId, or variantId.",
    parameters: Type.Object({}),
    execute: async () => {
      if (
        !activeBoard ||
        activeBoard.type !== "component" ||
        resolvedKey === undefined
      ) {
        return textResult("No active component board is selected.")
      }
      return textResult(
        activeBoardSection(workspace, resolvedKey, activeBoard).lines.join(
          "\n",
        ),
      )
    },
  })

  const getSelection = defineTool({
    name: "get_selection",
    label: "Get Selection",
    description:
      "Return the node the user has selected on the canvas, with its id, level, parent, children, and set properties.",
    parameters: Type.Object({}),
    execute: async () =>
      textResult(
        joinOrEmpty(
          selectionSection(
            workspace,
            activeBoard,
            selectedNodeId,
            selectedNodeRootId,
          ),
          "No node is selected.",
        ),
      ),
  })

  const getComponentVocabulary = defineTool({
    name: "get_component_vocabulary",
    label: "Get Component Vocabulary",
    description:
      "Return the settable property keys and value shapes for a component catalog id. Only set keys this reports; other keys are not part of the component's vocabulary.",
    parameters: Type.Object({
      catalogId: Type.String({
        description: "Catalog id of the component, for example button or text.",
      }),
    }),
    execute: async (_id, params) => {
      const ids = new Set([params.catalogId])
      const lines = [
        ...propertyVocabularySection(ids),
        ...propertyShapeSection(ids),
      ]
      return textResult(
        joinOrEmpty(
          lines,
          `No component vocabulary found for "${params.catalogId}". Use list_catalog_ids for valid ids.`,
        ),
      )
    },
  })

  const listThemeTokens = defineTool({
    name: "list_theme_tokens",
    label: "List Theme Tokens",
    description:
      "Return the theme ids to target with set_theme_override and the theme token ids that can be referenced as @scope.key, for example @swatch.primary or @fontSize.medium.",
    parameters: Type.Object({}),
    execute: async () =>
      textResult(
        joinOrEmpty(
          [...themeIdsSection(workspace), ...themeTokensSection(workspace)],
          "No theme tokens available.",
        ),
      ),
  })

  const listActionTypes = defineTool({
    name: "list_action_types",
    label: "List Action Types",
    description:
      "Return every workspace action type name, grouped by domain. Call this to discover an action for apply_actions when no dedicated tool covers the request, then call get_action_spec for its payload shape.",
    parameters: Type.Object({}),
    execute: async () =>
      textResult(
        joinOrEmpty([buildActionReference()], "No action types available."),
      ),
  })

  const getActionSpec = defineTool({
    name: "get_action_spec",
    label: "Get Action Spec",
    description:
      "Return the payload spec, its required and optional keys, for one or more workspace action types. Call this before apply_actions when unsure of an action's payload shape.",
    parameters: Type.Object({
      types: Type.Array(Type.String(), {
        description: "Action type names, for example set_node_properties.",
      }),
    }),
    execute: async (_id, params) =>
      textResult(
        joinOrEmpty(
          buildActionPayloadSpecs(params.types),
          "No matching action types. Call list_action_types for valid names.",
        ),
      ),
  })

  const listCatalogIds = defineTool({
    name: "list_catalog_ids",
    label: "List Catalog Ids",
    description:
      "Return every component catalog id that can be added with add_component.",
    parameters: Type.Object({}),
    execute: async () =>
      textResult(
        joinOrEmpty(catalogComponentsSection(), "No catalog ids available."),
      ),
  })

  const listBoards = defineTool({
    name: "list_boards",
    label: "List Boards",
    description:
      "Tier 3. Return every component board in the workspace as board key -> catalog id -> label. Use to locate a board other than the active one. A node reached only through tier 3 needs the user's permission before you edit it.",
    parameters: Type.Object({}),
    execute: async () =>
      textResult(
        joinOrEmpty(workspaceBoardsSection(workspace), "No boards available."),
      ),
  })

  const findNodes = defineTool({
    name: "find_nodes",
    label: "Find Nodes",
    description:
      "Tier 3. Search every board in the workspace for nodes whose label or catalog id contains the query, returning each match's node id, board, and variant. Use only when the target is on no board on screen. A node reached only through tier 3 needs the user's permission before you edit it.",
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

  return [
    getActiveBoard,
    getSelection,
    getComponentVocabulary,
    listThemeTokens,
    listCatalogIds,
    listActionTypes,
    getActionSpec,
    listBoards,
    findNodes,
  ]
}
