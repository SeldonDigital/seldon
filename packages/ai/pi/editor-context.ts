import { boardKey } from "@seldon/core/workspace/helpers/components/board-ref-resolver"
import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import {
  isAuthoredBoard,
  isComponentBoard,
} from "@seldon/core/workspace/model/components"
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
import type { IsolationScope, SelectionScope } from "../types"
import { type IsolationClosure, buildIsolationClosure } from "./isolation"

/** The editor state the agent needs to target the right board and node. */
export interface EditorContextInput {
  workspace: Workspace
  activeBoardKey?: BoardKey
  selectedNodeId?: string
  selectedNodeRootId?: string
  selectedBoardId?: BoardKey
  scope?: SelectionScope
  isolation?: IsolationScope
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
  /** Present when Isolation Mode is on and its anchor board resolved. */
  isolation?: IsolationClosure
}

/**
 * Boards the agent edits as component trees: catalog-backed component boards and
 * authored component boards. Both own a variant tree and are targeted the same
 * way, so every board-facing path treats them alike.
 */
function isEditableComponentBoard(board: Board | undefined): board is Board {
  return (
    board !== undefined && (isComponentBoard(board) || isAuthoredBoard(board))
  )
}

/**
 * Resolves the board the agent should act on: the requested board when it
 * exists, otherwise the first component or authored board, so the agent is
 * always scoped to one board on screen. The rest of the selection passes
 * through unchanged.
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

  // Isolation Mode pins the anchor: the isolated board is the active board and
  // its frozen variant column is the active variant, regardless of a stray
  // active-board hint. The closure bounds discovery and the commit-time gate.
  const isolation =
    input.isolation && workspace.boards[input.isolation.boardKey]
      ? buildIsolationClosure(workspace, input.isolation)
      : null

  const editableBoards = Object.entries(workspace.boards).filter(([, board]) =>
    isEditableComponentBoard(board),
  )
  const resolvedKey = isolation
    ? isolation.isolatedBoardKey
    : activeBoardKey && workspace.boards[activeBoardKey]
      ? activeBoardKey
      : editableBoards[0]?.[0]
  const activeBoard =
    resolvedKey !== undefined ? workspace.boards[resolvedKey] : undefined

  // In isolation, pin the variant column to the frozen root so the per-turn
  // view narrows to that variant even when the selection sits elsewhere.
  const resolvedRootId =
    isolation && isolation.isolatedVariantRootId
      ? isolation.isolatedVariantRootId
      : selectedNodeRootId

  return {
    workspace,
    resolvedKey,
    activeBoard,
    selectedNodeId,
    selectedNodeRootId: resolvedRootId,
    selectedBoardId,
    scope,
    resourceTargetId,
    isolation: isolation ?? undefined,
  }
}

/**
 * Resolves the variant column the selection sits in. The selection's root id is
 * a slash path whose first segment is the variant root, so that segment is tried
 * first. When it is absent or not a root on the board, the selected node is
 * located by walking each variant tree. Returns undefined when no selection
 * resolves to a variant, so the caller falls back to the whole board.
 */
function resolveActiveVariantId(
  board: Board,
  selectedNodeId?: string,
  selectedNodeRootId?: string,
): string | undefined {
  if (!isEditableComponentBoard(board)) return undefined
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
 * scope. A resource scope (theme, font collection, icon set) describes the
 * selected entry, or its board's entries when a board is selected, with the edit
 * tools for it. Workspace scope lists every board shallow plus the theme ids for
 * broad work. A component scope narrows to the selection: the selected node's
 * own subtree for an instance, the variant subtree for a variant, and every
 * variant on the board otherwise, then appends the selected node and its
 * settable values. One-level widening stays behind widen_scope. Static rules
 * live in the cached system prompt, so this stays small and the prefix cache
 * stays warm.
 */
export function buildTurnContext(resolved: ResolvedContext): string {
  const header = `Workspace: "${resolved.workspace.metadata.label ?? "Untitled"}"`

  // Isolation Mode overrides every other scope: the boundary directive and the
  // closure-only listing replace the whole-workspace view, and the anchor is
  // already pinned in resolveContext.
  if (resolved.isolation) {
    return [header, ...isolationScopeContext(resolved)].join("\n")
  }

  const resource = resourceScopeContext(resolved)
  if (resource) return [header, ...resource].join("\n")

  if (resolved.scope === "workspace") {
    return [header, ...workspaceScopeContext(resolved)].join("\n")
  }

  return [header, ...componentScopeContext(resolved)].join("\n")
}

/**
 * The context for an isolation turn: a boundary directive naming the isolated
 * board, its variant, and the dependency components in scope, then the normal
 * component view for the selection so the depth directive (instance, variant,
 * board) still drives the edit cascade. The whole-workspace listing is withheld,
 * so the model cannot drift to a board outside the closure.
 */
function isolationScopeContext(resolved: ResolvedContext): string[] {
  return [
    ...isolationBoundaryLines(resolved),
    ...componentScopeContext(resolved),
  ]
}

/** The isolation boundary directive plus the in-scope dependency listing. */
function isolationBoundaryLines(resolved: ResolvedContext): string[] {
  const { workspace, isolation } = resolved
  if (!isolation) return []

  const isolatedBoard = workspace.boards[isolation.isolatedBoardKey]
  const isolatedLabel = isolatedBoard?.label ?? isolation.isolatedBoardKey
  const variantNode = isolation.isolatedVariantRootId
    ? workspace.nodes[isolation.isolatedVariantRootId]
    : undefined
  const variantName =
    variantNode?.label ?? isolation.isolatedVariantRootId ?? "all variants"

  const lines: string[] = [
    "",
    `Isolation Mode is ON. The user froze board ${isolation.isolatedBoardKey} "${isolatedLabel}" on variant "${variantName}". You are hard-scoped to this board and the components its variant uses, listed below. Editing any board or node outside this set is rejected at commit, so do not target one. If the request needs a board outside the set, say it is outside Isolation Mode and ask the user to exit Isolation Mode; do not attempt the edit.`,
  ]

  const depLines: string[] = []
  for (const [key, board] of Object.entries(workspace.boards)) {
    if (key === isolation.isolatedBoardKey) continue
    if (!isolation.allowedBoardKeys.has(key)) continue
    const usedRoots = isolation.usage.get(boardKey(board) ?? key)
    const rootNames = usedRoots
      ? [...usedRoots].map((rootId) => workspace.nodes[rootId]?.label ?? rootId)
      : []
    const variantText =
      rootNames.length > 0 ? ` variants: ${rootNames.join(", ")}` : ""
    depLines.push(`- ${key} "${board.label}"${variantText}`)
  }
  if (depLines.length > 0) {
    lines.push(
      "Dependency components in scope (edit only these boards and variants):",
      ...depLines,
    )
  }

  lines.push(
    "",
    "Editing a dependency component's source cascades to every instance of it across the workspace, not just inside this board. Prefer a local instance override (set_properties scope 'instance') unless the user asked to change the component everywhere.",
  )
  return lines
}

/** The value lines and directives for one resource scope. */
interface ResourceScopeSpec {
  valueLines: string[]
  boardDirective: (boardKey: BoardKey) => string
  variantDirective: () => string
}

/**
 * The per-scope wording for a theme, font collection, or icon set. Returns null
 * when the scope is not a resource scope, so the caller falls through to the
 * component path. The board directive names the board and its default entry; the
 * variant directive names the single selected entry.
 */
function resourceScopeSpec(
  scope: SelectionScope | undefined,
  entryId: string,
  workspace: Workspace,
): ResourceScopeSpec | null {
  if (scope === "theme") {
    return {
      valueLines: [],
      boardDirective: (boardKey) =>
        `Scope: theme board "${boardKey}". Edit token values on its default theme "${entryId}" with set_theme_override (path like swatch.primary or fontSize.medium), or target one of the entries above. Call list_theme_tokens or search_theme_tokens for token paths. Call widen_scope for the workspace. Do not edit component nodes.`,
      variantDirective: () =>
        `Scope: theme variant "${entryId}". Edit its token values with set_theme_override (themeId "${entryId}", path like swatch.primary or fontSize.medium). Call list_theme_tokens or search_theme_tokens for token paths. If this is the wrong theme, call widen_scope to see the board's other themes. Do not edit component nodes.`,
    }
  }
  if (scope === "fontCollection") {
    return {
      valueLines: fontCollectionValuesSection(entryId, workspace),
      boardDirective: (boardKey) =>
        `Scope: font collection board "${boardKey}". Toggle families and weights on its default collection "${entryId}" with set_font_collection_family_preset (all or none) or set_font_collection_family_variant (one weight on or off), or target an entry above. Call widen_scope for the workspace. Do not edit component nodes.`,
      variantDirective: () =>
        `Scope: font collection variant "${entryId}". Toggle families and weights with set_font_collection_family_preset (all or none) or set_font_collection_family_variant (one weight on or off). If this is the wrong collection, call widen_scope to see the board's other collections. Do not edit component nodes.`,
    }
  }
  if (scope === "iconSet") {
    return {
      valueLines: iconSetValuesSection(entryId, workspace),
      boardDirective: (boardKey) =>
        `Scope: icon set board "${boardKey}". Toggle a subcategory on its default set "${entryId}" with set_icon_set_subcategory_preset (all or none), or a single icon with set_icon_set_override at path includedIcons.<iconId>, or target an entry above. Call widen_scope for the workspace. Do not edit component nodes.`,
      variantDirective: () =>
        `Scope: icon set variant "${entryId}". Toggle a subcategory with set_icon_set_subcategory_preset (all or none), or a single icon with set_icon_set_override at path includedIcons.<iconId>. If this is the wrong set, call widen_scope to see the board's other sets. Do not edit component nodes.`,
    }
  }
  return null
}

/**
 * The context for a resource scope. A board selection lists the board's entries
 * and points at the default; a variant selection scopes to the one entry. Both
 * lead value lines with the entry values. Returns null when the scope is not a
 * resource scope or no entry is selected.
 */
function resourceScopeContext(resolved: ResolvedContext): string[] | null {
  const { workspace, scope, resourceTargetId, selectedBoardId } = resolved
  if (resourceTargetId === undefined) return null
  const spec = resourceScopeSpec(scope, resourceTargetId, workspace)
  if (!spec) return null

  const lines = [...spec.valueLines]
  const owner = findResourceBoardForEntry(workspace, resourceTargetId)
  if (selectedBoardId !== undefined && owner) {
    lines.push(...resourceBoardEntriesSection(owner.board, owner.boardKey))
    lines.push("", spec.boardDirective(owner.boardKey))
  } else {
    lines.push("", spec.variantDirective())
  }
  return lines
}

/** The context for the workspace scope: every board shallow, plus theme ids. */
function workspaceScopeContext(resolved: ResolvedContext): string[] {
  const { workspace } = resolved
  return [
    ...workspaceShallowSection(workspace).lines,
    ...themeIdsSection(workspace),
    "",
    "Scope: the whole workspace. The request may span many boards, variants, and themes. The boards above are shown shallow, so drill down where the target lives: call get_active_board, describe_node, or widen_scope to expand a board, and find_nodes or list_boards to search. The user selected the workspace, so you may edit across boards without asking first.",
  ]
}

/**
 * The context for a component scope: the tree narrowed to the selection plus its
 * scope directive, then the selected node and, when a node is selected, its
 * settable values. Instance scope shows the selected node's own subtree, variant
 * scope the variant subtree, and every other case the whole board.
 */
function componentScopeContext(resolved: ResolvedContext): string[] {
  const {
    workspace,
    resolvedKey,
    activeBoard,
    selectedNodeId,
    selectedNodeRootId,
    scope,
  } = resolved
  const lines: string[] = []

  if (isEditableComponentBoard(activeBoard) && resolvedKey !== undefined) {
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
  lines.push(...selectedComponentValues(resolved))
  return lines
}

/**
 * The settable values for the selected node's component. The values reference
 * theme scopes as `@scope.*`, so the shared token block is emitted alongside them
 * for the model to resolve the ids.
 *
 * The token block carries the friendly names of ordinal scales, such as fontSize
 * "xxlarge (Big)", which the model needs to map a spoken size like "big" to the
 * right reference instead of guessing "huge". Those names are small and universal,
 * so the block is emitted whenever a component board is active, even before a node
 * is picked. Returns [] only when no component board is active.
 */
function selectedComponentValues(resolved: ResolvedContext): string[] {
  const { workspace, activeBoard, selectedNodeId } = resolved
  const selectedNode = selectedNodeId
    ? workspace.nodes[selectedNodeId]
    : undefined
  const selectedCatalogId = selectedNode
    ? getNodeCatalogId(selectedNode, workspace)
    : undefined
  if (!selectedCatalogId) {
    return isEditableComponentBoard(activeBoard)
      ? themeTokensSection(workspace)
      : []
  }

  const catalogIds = new Set([selectedCatalogId])
  return [
    ...propertyShapeSection(catalogIds),
    ...themeTokensSection(workspace),
    ...componentValuesSection(
      catalogIds,
      workspace,
      "Settable values for the selected component (pick a listed choice; omit a key to leave it unchanged):",
    ),
  ]
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
