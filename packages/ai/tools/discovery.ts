import { Type } from "typebox"

import { PropertyDisplayCategory } from "@seldon/core/properties/constants/property-display"
import { computeNodeProperties } from "@seldon/core/workspace/compute/compute-node-properties"
import { getComputedTheme as computeThemeById } from "@seldon/core/workspace/compute/compute-workspace-themes"
import { getImmediateParentIdInWorkspace } from "@seldon/core/workspace/helpers/components/get-node-parent-id"
import { isAuthoredBoard, isComponentBoard } from "@seldon/core/workspace/model/components"
import { validateComponentInsertionForUI } from "@seldon/core/workspace/reducers/helpers/validation"

import {
  activeBoardSection,
  nodeSubtreeSection,
  workspaceShallowSection,
} from "../prompt/context-sections/active-board"
import { ancestrySection } from "../prompt/context-sections/ancestry"
import { boardSummarySection } from "../prompt/context-sections/board-summary"
import { catalogComponentsSection } from "../prompt/context-sections/catalog-components"
import { componentCompositionSection } from "../prompt/context-sections/component-composition"
import { componentValuesSection } from "../prompt/context-sections/component-values"
import { describeNodeSection } from "../prompt/context-sections/describe-node"
import { searchFontsSection } from "../prompt/context-sections/fonts"
import { searchIconsSection } from "../prompt/context-sections/icons"
import { nodePropertiesSection } from "../prompt/context-sections/node-properties"
import { propertyShapeSection } from "../prompt/context-sections/property-shape"
import { propertyVocabularySection } from "../prompt/context-sections/property-vocabulary"
import {
  findResourceBoardForEntry,
  resourceBoardEntriesSection,
} from "../prompt/context-sections/resource-board"
import { selectionSection } from "../prompt/context-sections/selection"
import { themeIdsSection } from "../prompt/context-sections/theme-ids"
import {
  searchThemeTokensSection,
  themeTokensSection,
} from "../prompt/context-sections/theme-tokens"
import {
  findNodesSection,
  workspaceBoardsSection,
} from "../prompt/context-sections/workspace-index"
import {
  buildActionPayloadSpecs,
  buildActionReference,
  searchActions,
} from "../schema/action-schema"
import { resolveCatalogId } from "./catalog-ids"
import { defineSeldonTool, joinOrEmpty } from "./context"
import { dryRun } from "./session"

import type { SeldonTool } from "./context"
import type { ComponentId } from "@seldon/core/components/types/component-id"
import type { InstanceId, VariantId, WorkspaceAction } from "@seldon/core/workspace/types"

const PROPERTY_CATEGORY_VALUES = Object.values(PropertyDisplayCategory)

/** Coerces a free-text category into a known display category, or undefined. */
function toPropertyCategory(value: string | undefined): PropertyDisplayCategory | undefined {
  if (value === undefined) return undefined

  return PROPERTY_CATEGORY_VALUES.includes(value as PropertyDisplayCategory)
    ? (value as PropertyDisplayCategory)
    : undefined
}

const getActiveBoard = defineSeldonTool({
  name: "get_active_board",
  label: "Get Active Board",
  description:
    "Return the active board's variant node trees: each node's id, level, and catalog id.",
  kind: "read",
  parameters: Type.Object({}),
  run: (ctx) => {
    const workspace = ctx.getWorkspace()
    const { resolvedKey } = ctx.selection
    const activeBoard = resolvedKey !== undefined ? workspace.boards[resolvedKey] : undefined

    if (
      !activeBoard ||
      (!isComponentBoard(activeBoard) && !isAuthoredBoard(activeBoard)) ||
      resolvedKey === undefined
    ) {
      return "No active component board is selected."
    }

    return activeBoardSection(workspace, resolvedKey, activeBoard).lines.join("\n")
  },
})

const getSelection = defineSeldonTool({
  name: "get_selection",
  label: "Get Selection",
  description:
    "Return the node the user has selected on the canvas, with its id, level, parent, children, and set properties.",
  kind: "read",
  parameters: Type.Object({}),
  run: (ctx) => {
    const workspace = ctx.getWorkspace()
    const { resolvedKey, selectedNodeId, selectedNodeRootId } = ctx.selection
    const activeBoard = resolvedKey !== undefined ? workspace.boards[resolvedKey] : undefined

    return joinOrEmpty(
      selectionSection(workspace, activeBoard, selectedNodeId, selectedNodeRootId),
      "No node is selected.",
    )
  },
})

const describeNode = defineSeldonTool({
  name: "describe_node",
  label: "Describe Node",
  description:
    "Return a shallow view of one node: identity, parent, immediate children, and set properties. Call on a child id to expand only that branch.",
  kind: "read",
  parameters: Type.Object({
    nodeId: Type.String({
      description: "Node id to describe, from the context or a read tool.",
    }),
  }),
  run: (ctx, params) => {
    const nodeId = params.nodeId as string

    return joinOrEmpty(
      describeNodeSection(ctx.getWorkspace(), nodeId),
      `No node found for id "${nodeId}".`,
    )
  },
})

const getSelectionAncestry = defineSeldonTool({
  name: "get_selection_ancestry",
  label: "Get Selection Ancestry",
  description:
    "Return a node's parent chain to its variant root, with each ancestor's set color, background, and opacity. Use it for inherited color or high contrast. Defaults to the selected node.",
  kind: "read",
  parameters: Type.Object({
    nodeId: Type.Optional(
      Type.String({
        description: "Node id to trace. Omit to use the node selected on the canvas.",
      }),
    ),
  }),
  run: (ctx, params) => {
    const targetId = (params.nodeId as string | undefined) ?? ctx.selection.selectedNodeId

    if (targetId === undefined) {
      return "No node selected. Pass a nodeId to trace its ancestry."
    }

    return joinOrEmpty(
      ancestrySection(ctx.getWorkspace(), targetId),
      `No node found for id "${targetId}".`,
    )
  },
})

const widenScope = defineSeldonTool({
  name: "widen_scope",
  label: "Widen Scope",
  description:
    "Climb exactly one level up. For a node: parent, then variant, then board, then a shallow workspace view. For a theme, font collection, or icon set: the board's other entries, then the workspace. Call it when the target is not in the current scope. Defaults to the selection. In Isolation Mode, the terminal workspace view is limited to the boards in scope.",
  kind: "read",
  parameters: Type.Object({
    nodeId: Type.Optional(
      Type.String({
        description: "Node to widen from. Omit to use the selection.",
      }),
    ),
  }),
  run: (ctx, params) => {
    const workspace = ctx.getWorkspace()
    const { resolvedKey, selectedNodeId, selectedBoardId, scope, resourceTargetId, isolation } =
      ctx.selection
    const allowedBoardKeys = isolation?.allowedBoardKeys
    const activeBoard = resolvedKey !== undefined ? workspace.boards[resolvedKey] : undefined
    const emptyWorkspace = "No workspace boards available."
    const workspaceResult = () =>
      joinOrEmpty(
        workspaceShallowSection(workspace, undefined, allowedBoardKeys).lines,
        emptyWorkspace,
      )

    if (scope === "theme" || scope === "fontCollection" || scope === "iconSet") {
      if (selectedBoardId !== undefined) return workspaceResult()
      const entryId = (params.nodeId as string | undefined) ?? resourceTargetId
      const owner = entryId ? findResourceBoardForEntry(workspace, entryId) : undefined

      if (!owner) return workspaceResult()

      return joinOrEmpty(resourceBoardEntriesSection(owner.board, owner.boardKey), emptyWorkspace)
    }

    if (
      !activeBoard ||
      (!isComponentBoard(activeBoard) && !isAuthoredBoard(activeBoard)) ||
      resolvedKey === undefined
    ) {
      return workspaceResult()
    }

    const fromId = (params.nodeId as string | undefined) ?? selectedNodeId

    if (fromId === undefined) return workspaceResult()
    const parentId = getImmediateParentIdInWorkspace(workspace, fromId)

    if (parentId) {
      return joinOrEmpty(
        nodeSubtreeSection(workspace, resolvedKey, activeBoard, parentId).lines,
        `No node found for id "${parentId}".`,
      )
    }

    const isVariantRoot = activeBoard.variants.some((ref) => ref.id === fromId)

    if (isVariantRoot) {
      return joinOrEmpty(
        activeBoardSection(workspace, resolvedKey, activeBoard).lines,
        "No board available.",
      )
    }

    return workspaceResult()
  },
})

const boardSummary = defineSeldonTool({
  name: "board_summary",
  label: "Board Summary",
  description:
    "Return a cheap summary of the active board: each variant's name, node count, and catalog ids, with no ids. Use it to locate a target before pulling the full tree.",
  kind: "read",
  parameters: Type.Object({}),
  run: (ctx) => {
    const workspace = ctx.getWorkspace()
    const { resolvedKey } = ctx.selection
    const activeBoard = resolvedKey !== undefined ? workspace.boards[resolvedKey] : undefined

    if (
      !activeBoard ||
      (!isComponentBoard(activeBoard) && !isAuthoredBoard(activeBoard)) ||
      resolvedKey === undefined
    ) {
      return "No active component board is selected."
    }

    return joinOrEmpty(
      boardSummarySection(workspace, resolvedKey, activeBoard),
      "No board summary available.",
    )
  },
})

const getComponentVocabulary = defineSeldonTool({
  name: "get_component_vocabulary",
  label: "Get Component Vocabulary",
  description:
    "Return a component's settable keys, value shapes, and the choices each accepts (options, theme tokens, units). Only set keys it reports. Pass category to list one group.",
  kind: "read",
  parameters: Type.Object({
    catalogId: Type.String({ description: "Catalog id, for example button or text." }),
    category: Type.Optional(
      Type.String({
        description:
          "One group: attributes, layout, appearance, typography, effects, accessibility.",
      }),
    ),
  }),
  run: (ctx, params) => {
    const catalogId = params.catalogId as string
    const ids = new Set([catalogId])
    const category = toPropertyCategory(params.category as string | undefined)
    const workspace = ctx.getWorkspace()
    const lines = [
      ...propertyVocabularySection(ids, category),
      ...propertyShapeSection(ids),
      ...themeTokensSection(workspace),
      ...componentValuesSection(ids, workspace),
    ]

    return joinOrEmpty(
      lines,
      `No component vocabulary found for "${catalogId}". Use list_catalog_ids for valid ids.`,
    )
  },
})

const describeCatalogComponent = defineSeldonTool({
  name: "describe_catalog_component",
  label: "Describe Catalog Component",
  description:
    "Return a catalog component's composition: its default child tree, named variants, and the overrides each child bakes in. Preview it before insert_component; inserting the component yields this whole tree in one step.",
  kind: "read",
  parameters: Type.Object({
    catalogId: Type.String({ description: "Catalog id, for example menu or button." }),
  }),
  run: (_ctx, params) => {
    const resolved = resolveCatalogId(params.catalogId as string)

    if (!resolved.id) return resolved.message ?? "Unknown catalog id."
    const lines = componentCompositionSection(resolved.id)
    const body = joinOrEmpty(
      lines,
      `No composition found for "${resolved.id}". Use list_catalog_ids for valid ids.`,
    )

    return resolved.note ? `${resolved.note}\n${body}` : body
  },
})

const listThemeTokens = defineSeldonTool({
  name: "list_theme_tokens",
  label: "List Theme Tokens",
  description:
    "Return the theme ids for set_theme_override and the token ids referenced as @scope.key, for example @swatch.primary.",
  kind: "read",
  parameters: Type.Object({}),
  run: (ctx) => {
    const workspace = ctx.getWorkspace()

    return joinOrEmpty(
      [...themeIdsSection(workspace), ...themeTokensSection(workspace)],
      "No theme tokens available.",
    )
  },
})

const searchThemeTokens = defineSeldonTool({
  name: "search_theme_tokens",
  label: "Search Theme Tokens",
  description:
    'Return theme tokens whose scope or key matches the query, for example "swatch". Prefer over list_theme_tokens when you need a few tokens.',
  kind: "read",
  parameters: Type.Object({
    query: Type.String({ description: "Text to match against token scopes and keys." }),
  }),
  run: (ctx, params) => {
    const query = params.query as string

    return joinOrEmpty(
      searchThemeTokensSection(ctx.getWorkspace(), query),
      `No theme tokens match "${query}".`,
    )
  },
})

const searchIcons = defineSeldonTool({
  name: "search_icons",
  label: "Search Icons",
  description:
    'Return enabled icon ids whose id or label matches the query, for example "plus". Use it to find the id for the symbol property, which takes an id like "seldon-plus", never a display name.',
  kind: "read",
  parameters: Type.Object({
    query: Type.String({ description: "Text to match against icon ids and labels." }),
  }),
  run: (ctx, params) => {
    const query = params.query as string

    return joinOrEmpty(
      searchIconsSection(ctx.getWorkspace(), query),
      `No enabled icons match "${query}".`,
    )
  },
})

const searchFonts = defineSeldonTool({
  name: "search_fonts",
  label: "Search Fonts",
  description:
    'Return enabled font family values whose name matches the query, for example "Merri" or "serif". Use it to find the value for the font.family facet, which takes an enabled family value or a custom name, never a family the workspace has not enabled.',
  kind: "read",
  parameters: Type.Object({
    query: Type.String({ description: "Text to match against enabled font family names." }),
  }),
  run: (ctx, params) => {
    const query = params.query as string

    return joinOrEmpty(
      searchFontsSection(ctx.getWorkspace(), query),
      `No enabled fonts match "${query}".`,
    )
  },
})

const listCatalogIds = defineSeldonTool({
  name: "list_catalog_ids",
  label: "List Catalog Ids",
  description: "Return every component catalog id that can be added with add_component.",
  kind: "read",
  parameters: Type.Object({}),
  run: () => joinOrEmpty(catalogComponentsSection(), "No catalog ids available."),
})

const listActionTypes = defineSeldonTool({
  name: "list_action_types",
  label: "List Action Types",
  description:
    "Return every workspace action type name, grouped by domain. Use to discover an action for apply_actions, then get_action_spec for its payload.",
  kind: "read",
  parameters: Type.Object({}),
  run: () => joinOrEmpty([buildActionReference()], "No action types available."),
})

const getActionSpec = defineSeldonTool({
  name: "get_action_spec",
  label: "Get Action Spec",
  description:
    "Return the payload spec (required and optional keys) for one or more action types. Call before apply_actions when unsure of a payload shape.",
  kind: "read",
  parameters: Type.Object({
    types: Type.Array(Type.String(), {
      description: "Action type names, for example set_node_properties.",
    }),
  }),
  run: (_ctx, params) =>
    joinOrEmpty(
      buildActionPayloadSpecs(params.types as string[]),
      "No matching action types. Call list_action_types for valid names.",
    ),
})

const suggestAction = defineSeldonTool({
  name: "suggest_action",
  label: "Suggest Action",
  description:
    'Return action types matching an intent, each with its payload spec. Prefer over list_action_types + get_action_spec when you know the intent, for example "align".',
  kind: "read",
  parameters: Type.Object({
    query: Type.String({ description: "Intent text to match against action type names." }),
  }),
  run: (_ctx, params) => {
    const query = params.query as string

    return joinOrEmpty(
      searchActions(query),
      `No action types match "${query}". Call list_action_types for the full set.`,
    )
  },
})

const listBoards = defineSeldonTool({
  name: "list_boards",
  label: "List Boards",
  description:
    "Return every component board as board key -> catalog id -> label, to locate a board other than the active one. A node on a board the user is not viewing needs the user's permission before you edit it. In Isolation Mode, each board is marked as the isolated anchor, in scope, or out of scope.",
  kind: "read",
  parameters: Type.Object({}),
  run: (ctx) => {
    const { isolation } = ctx.selection

    return joinOrEmpty(
      workspaceBoardsSection(
        ctx.getWorkspace(),
        isolation
          ? {
              isolatedBoardKey: isolation.isolatedBoardKey,
              allowedBoardKeys: isolation.allowedBoardKeys,
            }
          : undefined,
      ),
      "No boards available.",
    )
  },
})

const findNodes = defineSeldonTool({
  name: "find_nodes",
  label: "Find Nodes",
  description:
    "Tier 3. Search every board for nodes whose label or catalog id contains the query, returning each match's node id, board, and variant. Use only when the target is on no on-screen board. A node reached only through tier 3 needs the user's permission before you edit it. In Isolation Mode, the search is limited to the boards in scope.",
  kind: "read",
  parameters: Type.Object({
    query: Type.String({ description: "Text to match against node labels and catalog ids." }),
  }),
  run: (ctx, params) => {
    const query = params.query as string

    return joinOrEmpty(
      findNodesSection(ctx.getWorkspace(), query, ctx.selection.isolation?.allowedBoardKeys),
      `No nodes match "${query}".`,
    )
  },
})

const getNodeProperties = defineSeldonTool({
  name: "get_node_properties",
  label: "Get Node Properties",
  description:
    "Return the effective, merged property values for one node. Use it to read what a value resolves to before editing.",
  kind: "read",
  parameters: Type.Object({
    nodeId: Type.String({ description: "Node id whose effective properties you need." }),
  }),
  run: (ctx, params) => {
    const nodeId = params.nodeId as string

    return joinOrEmpty(
      nodePropertiesSection(ctx.getWorkspace(), nodeId),
      `No properties found for node "${nodeId}".`,
    )
  },
})

const getComputedNode = defineSeldonTool({
  name: "get_computed_node",
  label: "Get Computed Node",
  description:
    "Return the fully computed, effective property values for one node as JSON, with COMPUTED values resolved. Use it to read exactly what will render or export before editing.",
  kind: "read",
  parameters: Type.Object({
    nodeId: Type.String({ description: "Node id to compute." }),
  }),
  run: (ctx, params) => {
    const nodeId = params.nodeId as string
    const workspace = ctx.getWorkspace()

    if (!workspace.nodes[nodeId]) return `No node found for id "${nodeId}".`

    try {
      const computed = computeNodeProperties(nodeId, workspace, { stage: "computed" })

      return JSON.stringify(computed, null, 2)
    } catch (caught) {
      return caught instanceof Error ? caught.message : `Could not compute node "${nodeId}".`
    }
  },
})

const getComputedTheme = defineSeldonTool({
  name: "get_computed_theme",
  label: "Get Computed Theme",
  description:
    "Return a theme's fully computed token values as JSON, with dynamic swatches resolved from the color harmony. Use it to read the real color and scale values a token resolves to.",
  kind: "read",
  parameters: Type.Object({
    themeId: Type.String({ description: "Theme id to compute." }),
  }),
  run: (ctx, params) => {
    const themeId = params.themeId as string

    try {
      return JSON.stringify(computeThemeById(themeId, ctx.getWorkspace()), null, 2)
    } catch (caught) {
      return caught instanceof Error ? caught.message : `Could not compute theme "${themeId}".`
    }
  },
})

const dryRunActions = defineSeldonTool({
  name: "dry_run_actions",
  label: "Dry Run Actions",
  description:
    "Validate a batch of workspace actions through the full enforcement stack (shape repair, design lint, reducer) without applying anything. Returns which actions would apply, which would change nothing, and which would be rejected with the exact reason. Use it to check an edit before apply_actions.",
  kind: "read",
  parameters: Type.Object({
    actions: Type.Array(
      Type.Object({
        type: Type.String({ description: "One of the allowed action types." }),
        payload: Type.Record(Type.String(), Type.Unknown()),
      }),
      { description: "Actions to validate, in order." },
    ),
  }),
  run: (ctx, params) => {
    const actions = params.actions as WorkspaceAction[]

    if (actions.length === 0) return "No actions provided."
    const result = dryRun(ctx.getWorkspace(), actions)
    const lines = [
      `Would change: ${result.wouldChange ? "yes" : "no"}.`,
      result.ineffective.length > 0 ? `No-op: ${result.ineffective.join(", ")}.` : "",
      ...result.rejected.map((r) => `Rejected ${r.type}: ${r.reason}`),
    ]

    return joinOrEmpty(lines, "All actions would apply cleanly.")
  },
})

const canInsert = defineSeldonTool({
  name: "can_insert",
  label: "Can Insert",
  description:
    "Check whether a catalog component may be inserted under a parent node, respecting hierarchy rules, before you try. Returns valid plus any errors.",
  kind: "read",
  parameters: Type.Object({
    catalogId: Type.String({ description: "Catalog id of the component to insert." }),
    parentId: Type.String({ description: "Existing parent node id." }),
  }),
  run: (ctx, params) => {
    const resolved = resolveCatalogId(params.catalogId as string)

    if (!resolved.id) return resolved.message ?? "Unknown catalog id."
    const result = validateComponentInsertionForUI(
      resolved.id as ComponentId,
      params.parentId as VariantId | InstanceId,
      ctx.getWorkspace(),
    )
    const note = resolved.note ? `${resolved.note}\n` : ""

    if (result.isValid)
      return `${note}Valid: ${resolved.id} may be inserted under ${String(params.parentId)}.`

    return `${note}Cannot insert ${resolved.id} under ${String(params.parentId)}: ${result.errors.join(" ")}`
  },
})

/** Every read tool, shared by Pi and MCP. */
export const DISCOVERY_TOOLS: SeldonTool[] = [
  getActiveBoard,
  getSelection,
  describeNode,
  getSelectionAncestry,
  widenScope,
  boardSummary,
  getComponentVocabulary,
  describeCatalogComponent,
  listThemeTokens,
  searchThemeTokens,
  searchIcons,
  searchFonts,
  listCatalogIds,
  listActionTypes,
  getActionSpec,
  suggestAction,
  listBoards,
  findNodes,
  getNodeProperties,
  getComputedNode,
  getComputedTheme,
  dryRunActions,
  canInsert,
]
