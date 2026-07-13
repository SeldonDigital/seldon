import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { getImmediateParentIdInWorkspace } from "@seldon/core/workspace/helpers/components/get-node-parent-id"

import { PropertyDisplayCategory } from "@seldon/core/properties/constants/property-display"

import {
  activeBoardSection,
  nodeSubtreeSection,
  workspaceShallowSection,
} from "../../prompt/context-sections/active-board"
import { ancestrySection } from "../../prompt/context-sections/ancestry"
import { boardSummarySection } from "../../prompt/context-sections/board-summary"
import { catalogComponentsSection } from "../../prompt/context-sections/catalog-components"
import { componentValuesSection } from "../../prompt/context-sections/component-values"
import { describeNodeSection } from "../../prompt/context-sections/describe-node"
import { nodePropertiesSection } from "../../prompt/context-sections/node-properties"
import { propertyShapeSection } from "../../prompt/context-sections/property-shape"
import { propertyVocabularySection } from "../../prompt/context-sections/property-vocabulary"
import {
  findResourceBoardForEntry,
  resourceBoardEntriesSection,
} from "../../prompt/context-sections/resource-board"
import { selectionSection } from "../../prompt/context-sections/selection"
import { themeIdsSection } from "../../prompt/context-sections/theme-ids"
import {
  searchThemeTokensSection,
  themeTokensSection,
} from "../../prompt/context-sections/theme-tokens"
import {
  findNodesSection,
  workspaceBoardsSection,
} from "../../prompt/context-sections/workspace-index"
import {
  buildActionPayloadSpecs,
  buildActionReference,
  searchActions,
} from "../../schema/action-schema"
import type { ResolvedContext } from "../editor-context"

const PROPERTY_CATEGORY_VALUES = Object.values(PropertyDisplayCategory)

function toPropertyCategory(
  value: string | undefined,
): PropertyDisplayCategory | undefined {
  if (value === undefined) return undefined
  return PROPERTY_CATEGORY_VALUES.includes(value as PropertyDisplayCategory)
    ? (value as PropertyDisplayCategory)
    : undefined
}

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
    selectedBoardId,
    scope,
    resourceTargetId,
  } = resolved

  const getActiveBoard = defineTool({
    name: "get_active_board",
    label: "Get Active Board",
    description:
      "Return the active board's variant node trees: each node's id, level, and catalog id.",
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
      "Return a component's settable keys, value shapes, and the choices each accepts (options, theme tokens, units). Only set keys it reports. Pass category to list one group.",
    parameters: Type.Object({
      catalogId: Type.String({
        description: "Catalog id, for example button or text.",
      }),
      category: Type.Optional(
        Type.String({
          description:
            "One group: attributes, layout, appearance, typography, effects, accessibility.",
        }),
      ),
    }),
    execute: async (_id, params) => {
      const ids = new Set([params.catalogId])
      const category = toPropertyCategory(params.category)
      const lines = [
        ...propertyVocabularySection(ids, category),
        ...propertyShapeSection(ids),
        ...themeTokensSection(workspace),
        ...componentValuesSection(ids, workspace),
      ]
      return textResult(
        joinOrEmpty(
          lines,
          `No component vocabulary found for "${params.catalogId}". Use list_catalog_ids for valid ids.`,
        ),
      )
    },
  })

  const describeNode = defineTool({
    name: "describe_node",
    label: "Describe Node",
    description:
      "Return a shallow view of one node: identity, parent, immediate children, and set properties. Call on a child id to expand only that branch.",
    parameters: Type.Object({
      nodeId: Type.String({
        description: "Node id to describe, from the context or a read tool.",
      }),
    }),
    execute: async (_id, params) =>
      textResult(
        joinOrEmpty(
          describeNodeSection(workspace, params.nodeId),
          `No node found for id "${params.nodeId}".`,
        ),
      ),
  })

  const getNodeProperties = defineTool({
    name: "get_node_properties",
    label: "Get Node Properties",
    description:
      "Return the effective, merged property values for one node. Use it to read what a value resolves to before editing.",
    parameters: Type.Object({
      nodeId: Type.String({
        description: "Node id whose effective properties you need.",
      }),
    }),
    execute: async (_id, params) =>
      textResult(
        joinOrEmpty(
          nodePropertiesSection(workspace, params.nodeId),
          `No properties found for node "${params.nodeId}".`,
        ),
      ),
  })

  const getSelectionAncestry = defineTool({
    name: "get_selection_ancestry",
    label: "Get Selection Ancestry",
    description:
      "Return a node's parent chain to its variant root, with each ancestor's set color, background, and opacity. Use it for inherited color or high contrast. Defaults to the selected node.",
    parameters: Type.Object({
      nodeId: Type.Optional(
        Type.String({
          description:
            "Node id to trace. Omit to use the node selected on the canvas.",
        }),
      ),
    }),
    execute: async (_id, params) => {
      const targetId = params.nodeId ?? selectedNodeId
      if (targetId === undefined) {
        return textResult(
          "No node selected. Pass a nodeId to trace its ancestry.",
        )
      }
      return textResult(
        joinOrEmpty(
          ancestrySection(workspace, targetId),
          `No node found for id "${targetId}".`,
        ),
      )
    },
  })

  const getBoardSummary = defineTool({
    name: "board_summary",
    label: "Board Summary",
    description:
      "Return a cheap summary of the active board: each variant's name, node count, and catalog ids, with no ids. Use it to locate a target before pulling the full tree.",
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
        joinOrEmpty(
          boardSummarySection(workspace, resolvedKey, activeBoard),
          "No board summary available.",
        ),
      )
    },
  })

  const searchThemeTokens = defineTool({
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

  const suggestAction = defineTool({
    name: "suggest_action",
    label: "Suggest Action",
    description:
      'Return action types matching an intent, each with its payload spec. Prefer over list_action_types + get_action_spec when you know the intent, for example "align".',
    parameters: Type.Object({
      query: Type.String({
        description: "Intent text to match against action type names.",
      }),
    }),
    execute: async (_id, params) =>
      textResult(
        joinOrEmpty(
          searchActions(params.query),
          `No action types match "${params.query}". Call list_action_types for the full set.`,
        ),
      ),
  })

  const listThemeTokens = defineTool({
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

  const listActionTypes = defineTool({
    name: "list_action_types",
    label: "List Action Types",
    description:
      "Return every workspace action type name, grouped by domain. Use to discover an action for apply_actions, then get_action_spec for its payload.",
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
      "Return the payload spec (required and optional keys) for one or more action types. Call before apply_actions when unsure of a payload shape.",
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
      "Tier 3. Return every component board as board key -> catalog id -> label, to locate a board other than the active one. A node reached only through tier 3 needs the user's permission before you edit it.",
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

  const widenScope = defineTool({
    name: "widen_scope",
    label: "Widen Scope",
    description:
      "Climb exactly one level up. For a node: parent, then variant, then board, then a shallow workspace view. For a theme, font collection, or icon set: the board's other entries, then the workspace. Call it when the target is not in the current scope. Defaults to the selection.",
    parameters: Type.Object({
      nodeId: Type.Optional(
        Type.String({
          description: "Node to widen from. Omit to use the selection.",
        }),
      ),
    }),
    execute: async (_id, params) => {
      const emptyWorkspace = "No workspace boards available."
      const workspaceResult = () =>
        textResult(
          joinOrEmpty(workspaceShallowSection(workspace).lines, emptyWorkspace),
        )

      // Resource scopes climb the same way: a variant entry rises to its board's
      // entry list, and a board rises to the workspace.
      if (
        scope === "theme" ||
        scope === "fontCollection" ||
        scope === "iconSet"
      ) {
        if (selectedBoardId !== undefined) return workspaceResult()
        const entryId = params.nodeId ?? resourceTargetId
        const owner = entryId
          ? findResourceBoardForEntry(workspace, entryId)
          : undefined
        if (!owner) return workspaceResult()
        return textResult(
          joinOrEmpty(
            resourceBoardEntriesSection(owner.board, owner.boardKey),
            emptyWorkspace,
          ),
        )
      }

      if (
        !activeBoard ||
        activeBoard.type !== "component" ||
        resolvedKey === undefined
      ) {
        return workspaceResult()
      }
      const fromId = params.nodeId ?? selectedNodeId
      if (fromId === undefined) return workspaceResult()
      const parentId = getImmediateParentIdInWorkspace(workspace, fromId)
      if (parentId) {
        return textResult(
          joinOrEmpty(
            nodeSubtreeSection(workspace, resolvedKey, activeBoard, parentId)
              .lines,
            `No node found for id "${parentId}".`,
          ),
        )
      }
      const isVariantRoot = activeBoard.variants.some((ref) => ref.id === fromId)
      if (isVariantRoot) {
        return textResult(
          joinOrEmpty(
            activeBoardSection(workspace, resolvedKey, activeBoard).lines,
            "No board available.",
          ),
        )
      }
      return workspaceResult()
    },
  })

  return [
    getActiveBoard,
    getSelection,
    describeNode,
    getNodeProperties,
    getSelectionAncestry,
    widenScope,
    getBoardSummary,
    getComponentVocabulary,
    listThemeTokens,
    searchThemeTokens,
    listCatalogIds,
    listActionTypes,
    getActionSpec,
    suggestAction,
    listBoards,
    findNodes,
  ]
}
