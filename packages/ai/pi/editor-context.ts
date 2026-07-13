import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type { Board, BoardKey, Workspace } from "@seldon/core/workspace/types"

import {
  activeBoardSection,
  activeVariantSection,
} from "../prompt/context-sections/active-board"
import { componentValuesSection } from "../prompt/context-sections/component-values"
import { fontCollectionValuesSection } from "../prompt/context-sections/font-collection-values"
import { iconSetValuesSection } from "../prompt/context-sections/icon-set-values"
import { selectionSection } from "../prompt/context-sections/selection"
import { themeIdsSection } from "../prompt/context-sections/theme-ids"
import { workspaceBoardsSection } from "../prompt/context-sections/workspace-index"
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
    scope,
    resourceTargetId,
  } = resolved
  const lines: string[] = [
    `Workspace: "${workspace.metadata.label ?? "Untitled"}"`,
  ]

  if (scope === "theme" && resourceTargetId) {
    lines.push(...themeIdsSection(workspace))
    lines.push(
      "",
      `Scope: theme. Edit token values on theme "${resourceTargetId}" with set_theme_override (path like swatch.primary or fontSize.medium). This is a workspace-level token edit, so the active board does not matter. Call list_theme_tokens or search_theme_tokens for token paths and ids. Do not edit component nodes.`,
    )
    return lines.join("\n")
  }

  if (scope === "fontCollection" && resourceTargetId) {
    lines.push(...fontCollectionValuesSection(resourceTargetId, workspace))
    lines.push(
      "",
      `Scope: font collection. Toggle families and weights on "${resourceTargetId}" with set_font_collection_family_preset (all or none) or set_font_collection_family_variant (one weight on or off). Do not edit component nodes.`,
    )
    return lines.join("\n")
  }

  if (scope === "iconSet" && resourceTargetId) {
    lines.push(...iconSetValuesSection(resourceTargetId, workspace))
    lines.push(
      "",
      `Scope: icon set. Toggle a whole subcategory on "${resourceTargetId}" with set_icon_set_subcategory_preset (all or none), or a single icon with set_icon_set_override at path includedIcons.<iconId>. Do not edit component nodes.`,
    )
    return lines.join("\n")
  }

  if (scope === "workspace") {
    lines.push(...workspaceBoardsSection(workspace))
    lines.push(...themeIdsSection(workspace))
    lines.push(
      "",
      "Scope: the whole workspace (tier 3). The request may span many boards, variants, and themes. Reason broadly and edit wherever the target lives. The user selected the workspace, so you may edit across boards without asking first. Use find_nodes, list_boards, and get_active_board to locate targets and their values before editing.",
    )
    return lines.join("\n")
  }

  if (
    activeBoard &&
    activeBoard.type === "component" &&
    resolvedKey !== undefined
  ) {
    const variantId =
      selectedNodeId !== undefined
        ? resolveActiveVariantId(
            activeBoard,
            selectedNodeId,
            selectedNodeRootId,
          )
        : undefined
    const tier1 =
      variantId !== undefined
        ? activeVariantSection(workspace, resolvedKey, activeBoard, variantId)
        : undefined

    if (tier1 && tier1.lines.length > 0) {
      lines.push(...tier1.lines)
      lines.push("", variantScopeDirective(scope))
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
    lines.push(
      ...componentValuesSection(
        new Set([selectedCatalogId]),
        workspace,
        "Settable values for the selected component (pick a listed choice; omit a key to leave it unchanged):",
      ),
    )
  }

  return lines.join("\n")
}

/**
 * The directive for a tier-1 context (a node is selected). Instance scope edits
 * a local override on the node; variant scope edits the component source inside
 * the variant so every instance of it follows. Both keep the tier ladder note.
 */
function variantScopeDirective(scope?: SelectionScope): string {
  if (scope === "instance") {
    return "Scope: instance (the selected node). Keep edits local: set_properties defaults to scope 'instance' and writes an override on this node only. Do not widen or edit the component source. Widen only if the target is missing here: call get_active_board (tier 2), then find_nodes or list_boards (tier 3)."
  }
  return "Scope: the active variant above and its subtree (tier 1 of 3). Edits are global within this variant: editing a component changes its source here, so every instance of it in the variant follows. set_properties defaults to scope 'all'. Widen only if the variant lacks the target: call get_active_board for every variant on this board (tier 2), then find_nodes or list_boards (tier 3)."
}

/**
 * The directive for a tier-2 context (a board is selected, no node). Board scope
 * should cascade, so prefer editing the default variant or component source.
 */
function boardScopeDirective(scope?: SelectionScope): string {
  if (scope === "board") {
    return "Scope: the active board above (tier 2 of 3). Make the change cascade: prefer editing the default variant (listed first) or the component source so every variant and instance follows. set_properties defaults to scope 'all'. Widen only if the board lacks the target: call find_nodes or list_boards (tier 3)."
  }
  return "Scope: every variant on the active board above (tier 2 of 3). Widen only if it lacks the target: call find_nodes or list_boards to search the whole workspace (tier 3)."
}
