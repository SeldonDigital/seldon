import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type { Board, BoardKey, Workspace } from "@seldon/core/workspace/types"

import {
  activeBoardSection,
  activeVariantSection,
  nodeSubtreeSection,
  workspaceShallowSection,
} from "../prompt/context-sections/active-board"
import { componentValuesSection } from "../prompt/context-sections/component-values"
import { fontCollectionValuesSection } from "../prompt/context-sections/font-collection-values"
import { iconSetValuesSection } from "../prompt/context-sections/icon-set-values"
import { propertyShapeSection } from "../prompt/context-sections/property-shape"
import {
  findResourceBoardForEntry,
  resourceBoardEntriesSection,
} from "../prompt/context-sections/resource-board"
import { selectionSection } from "../prompt/context-sections/selection"
import { themeIdsSection } from "../prompt/context-sections/theme-ids"
import { themeTokensSection } from "../prompt/context-sections/theme-tokens"
import type { SelectionScope } from "../types"

/** The editor state the agent needs to target the right board and node. */
export interface EditorContextInput {
  workspace: Workspace
  activeBoardKey?: BoardKey
  selectedNodeId?: string
  selectedNodeRootId?: string
  selectedBoardId?: BoardKey
  scope?: SelectionScope
  resourceTargetId?: string
}

/** The active board resolved from the request, plus the passthrough selection. */
export interface ResolvedContext {
  workspace: Workspace
  resolvedKey?: BoardKey
  activeBoard?: Board
  selectedNodeId?: string
  selectedNodeRootId?: string
  selectedBoardId?: BoardKey
  scope?: SelectionScope
  resourceTargetId?: string
}

/**
 * Resolves the board the agent should act on. Mirrors the Ollama context
 * builder: the requested board when it exists, otherwise the first component
 * board, so the agent is always scoped to one board on screen.
 */
export function resolveContext(input: EditorContextInput): ResolvedContext {
  const {
    workspace,
    activeBoardKey,
    selectedNodeId,
    selectedNodeRootId,
    selectedBoardId,
    scope,
    resourceTargetId,
  } = input
  const componentBoards = Object.entries(workspace.boards).filter(
    ([, board]) => board.type === "component",
  )
  const resolvedKey =
    activeBoardKey && workspace.boards[activeBoardKey]
      ? activeBoardKey
      : componentBoards[0]?.[0]
  const activeBoard =
    resolvedKey !== undefined ? workspace.boards[resolvedKey] : undefined
  return {
    workspace,
    resolvedKey,
    activeBoard,
    selectedNodeId,
    selectedNodeRootId,
    selectedBoardId,
    scope,
    resourceTargetId,
  }
}

/**
 * Resolves the variant column the selection sits in, the tier-1 scope. The
 * selection's root id is a slash path whose first segment is the variant root,
 * so that segment is tried first. When it is absent or not a root on the board,
 * the selected node is located by walking each variant tree. Returns undefined
 * when no selection resolves to a variant, so the caller falls back to tier 2.
 */
function resolveActiveVariantId(
  board: Board,
  selectedNodeId?: string,
  selectedNodeRootId?: string,
): string | undefined {
  if (board.type !== "component") return undefined
  const rootIds = new Set(board.variants.map((ref) => ref.id))

  if (selectedNodeRootId) {
    const first = selectedNodeRootId.split("/")[0]
    if (first && rootIds.has(first)) return first
  }

  if (selectedNodeId) {
    for (const variantRef of board.variants) {
      let found = false
      walkBoardTreeRefs([variantRef], (ref) => {
        if (ref.id !== selectedNodeId) return
        found = true
        return true
      })
      if (found) return variantRef.id
    }
  }

  return undefined
}

/**
 * The compact per-turn context injected with each prompt. It carries only the
 * volatile parts the model must see fresh every turn, driven by the selection
 * scope the editor classified. Resource scopes (theme, font collection, icon
 * set) describe the selected entry and its edit tools. Workspace scope lists the
 * boards and themes for broad, cross-board work. Component scopes (board,
 * variant, instance) scope to the narrowest tier that fits: the active variant
 * subtree when a node is selected (tier 1), otherwise every variant on the
 * active board (tier 2). The whole workspace (tier 3) stays behind the
 * find_nodes and list_boards tools. Static rules live in the cached system
 * prompt, so this stays small and the prefix cache stays warm.
 */
export function buildTurnContext(resolved: ResolvedContext): string {
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
  const lines: string[] = [
    `Workspace: "${workspace.metadata.label ?? "Untitled"}"`,
  ]

  if (scope === "theme" && resourceTargetId) {
    const owner = findResourceBoardForEntry(workspace, resourceTargetId)
    if (selectedBoardId !== undefined && owner) {
      lines.push(...resourceBoardEntriesSection(owner.board, owner.boardKey))
      lines.push(
        "",
        `Scope: theme board "${owner.boardKey}". Edit token values on its default theme "${resourceTargetId}" with set_theme_override (path like swatch.primary or fontSize.medium), or target one of the entries above. Call list_theme_tokens or search_theme_tokens for token paths. Call widen_scope for the workspace. Do not edit component nodes.`,
      )
    } else {
      lines.push(
        "",
        `Scope: theme variant "${resourceTargetId}". Edit its token values with set_theme_override (themeId "${resourceTargetId}", path like swatch.primary or fontSize.medium). Call list_theme_tokens or search_theme_tokens for token paths. If this is the wrong theme, call widen_scope to see the board's other themes. Do not edit component nodes.`,
      )
    }
    return lines.join("\n")
  }

  if (scope === "fontCollection" && resourceTargetId) {
    const owner = findResourceBoardForEntry(workspace, resourceTargetId)
    lines.push(...fontCollectionValuesSection(resourceTargetId, workspace))
    if (selectedBoardId !== undefined && owner) {
      lines.push(...resourceBoardEntriesSection(owner.board, owner.boardKey))
      lines.push(
        "",
        `Scope: font collection board "${owner.boardKey}". Toggle families and weights on its default collection "${resourceTargetId}" with set_font_collection_family_preset (all or none) or set_font_collection_family_variant (one weight on or off), or target an entry above. Call widen_scope for the workspace. Do not edit component nodes.`,
      )
    } else {
      lines.push(
        "",
        `Scope: font collection variant "${resourceTargetId}". Toggle families and weights with set_font_collection_family_preset (all or none) or set_font_collection_family_variant (one weight on or off). If this is the wrong collection, call widen_scope to see the board's other collections. Do not edit component nodes.`,
      )
    }
    return lines.join("\n")
  }

  if (scope === "iconSet" && resourceTargetId) {
    const owner = findResourceBoardForEntry(workspace, resourceTargetId)
    lines.push(...iconSetValuesSection(resourceTargetId, workspace))
    if (selectedBoardId !== undefined && owner) {
      lines.push(...resourceBoardEntriesSection(owner.board, owner.boardKey))
      lines.push(
        "",
        `Scope: icon set board "${owner.boardKey}". Toggle a subcategory on its default set "${resourceTargetId}" with set_icon_set_subcategory_preset (all or none), or a single icon with set_icon_set_override at path includedIcons.<iconId>, or target an entry above. Call widen_scope for the workspace. Do not edit component nodes.`,
      )
    } else {
      lines.push(
        "",
        `Scope: icon set variant "${resourceTargetId}". Toggle a subcategory with set_icon_set_subcategory_preset (all or none), or a single icon with set_icon_set_override at path includedIcons.<iconId>. If this is the wrong set, call widen_scope to see the board's other sets. Do not edit component nodes.`,
      )
    }
    return lines.join("\n")
  }

  if (scope === "workspace") {
    lines.push(...workspaceShallowSection(workspace).lines)
    lines.push(...themeIdsSection(workspace))
    lines.push(
      "",
      "Scope: the whole workspace. The request may span many boards, variants, and themes. The boards above are shown shallow, so drill down where the target lives: call get_active_board, describe_node, or widen_scope to expand a board, and find_nodes or list_boards to search. The user selected the workspace, so you may edit across boards without asking first.",
    )
    return lines.join("\n")
  }

  if (
    activeBoard &&
    activeBoard.type === "component" &&
    resolvedKey !== undefined
  ) {
    // Instance scope hands the model only the selected node's own subtree, so a
    // local override edit carries no sibling noise. It falls back to the variant
    // when the node is not on the active board.
    const instanceSubtree =
      scope === "instance" && selectedNodeId !== undefined
        ? nodeSubtreeSection(
            workspace,
            resolvedKey,
            activeBoard,
            selectedNodeId,
          )
        : undefined

    const variantId =
      selectedNodeId !== undefined
        ? resolveActiveVariantId(
            activeBoard,
            selectedNodeId,
            selectedNodeRootId,
          )
        : undefined
    const variant =
      scope !== "board" && variantId !== undefined
        ? activeVariantSection(workspace, resolvedKey, activeBoard, variantId)
        : undefined

    if (instanceSubtree && instanceSubtree.lines.length > 0) {
      lines.push(...instanceSubtree.lines)
      lines.push("", instanceScopeDirective())
    } else if (variant && variant.lines.length > 0) {
      lines.push(...variant.lines)
      lines.push("", variantScopeDirective())
    } else {
      lines.push(
        ...activeBoardSection(workspace, resolvedKey, activeBoard).lines,
      )
      lines.push("", boardScopeDirective(scope))
    }
  } else {
    lines.push(
      "",
      "No active board is selected. Ask the user to open or select a board, and do not edit anything until one is active.",
    )
  }

  lines.push(
    ...selectionSection(
      workspace,
      activeBoard,
      selectedNodeId,
      selectedNodeRootId,
    ),
  )

  const selectedNode = selectedNodeId ? workspace.nodes[selectedNodeId] : undefined
  const selectedCatalogId = selectedNode
    ? getNodeCatalogId(selectedNode, workspace)
    : undefined
  if (selectedCatalogId) {
    const catalogIds = new Set([selectedCatalogId])
    lines.push(...propertyShapeSection(catalogIds))
    // The settable values reference theme scopes as `@scope.*`, so the shared
    // token block must be present for the model to resolve the ids.
    lines.push(...themeTokensSection(workspace))
    lines.push(
      ...componentValuesSection(
        catalogIds,
        workspace,
        "Settable values for the selected component (pick a listed choice; omit a key to leave it unchanged):",
      ),
    )
  }

  return lines.join("\n")
}

/**
 * The directive for an instance scope: only the selected node's subtree is in
 * scope. Edits are local overrides on this node. Widening climbs one level up
 * to the parent, then the variant, through widen_scope.
 */
function instanceScopeDirective(): string {
  return "Scope: instance (the selected node and its descendants above). Keep edits local: set_properties defaults to scope 'instance' and writes an override on this node only. Do not edit the component source. If the target is not above, call widen_scope to climb one level (parent, then variant, then board), or find_nodes / list_boards to search the workspace."
}

/**
 * The directive for a variant scope: the variant subtree is in scope. Editing a
 * component here changes its source in the variant, so every instance follows.
 * Widening climbs one level up to the board through widen_scope.
 */
function variantScopeDirective(): string {
  return "Scope: the active variant above and its subtree. Edits are global within this variant: editing a component changes its source here, so every instance of it in the variant follows. set_properties defaults to scope 'all'. If the variant lacks the target, call widen_scope to climb one level to the board, or find_nodes / list_boards to search the workspace."
}

/**
 * The directive for a board scope: every variant on the board is in scope. Board
 * scope should cascade, so prefer editing the default variant or component
 * source. Widening climbs one level up to the workspace through widen_scope.
 */
function boardScopeDirective(scope?: SelectionScope): string {
  if (scope === "board") {
    return "Scope: the active board above. Make the change cascade: prefer editing the default variant (listed first) or the component source so every variant and instance follows. set_properties defaults to scope 'all'. If the board lacks the target, call widen_scope to climb to the workspace, or find_nodes / list_boards to search."
  }
  return "Scope: every variant on the active board above. If it lacks the target, call widen_scope to climb to the workspace, or find_nodes / list_boards to search."
}
