import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type { BoardKey, Workspace } from "@seldon/core/workspace/types"

import { activeBoardSection } from "../../prompt/context-sections/active-board"
import { componentValuesSection } from "../../prompt/context-sections/component-values"
import type { SelectionScope } from "../../types"

/** How the model names a node to edit: the current selection or an explicit id. */
export type TargetSpec = "selection" | { nodeId: string }

/**
 * Outcome of resolving a target. `resolved` carries the node id to write.
 * `message` is a terminal directive the tool returns verbatim: a clarification,
 * a candidate list, a permission ask, or a not-found. The tool makes no edit on
 * a `message`, so a scope miss ends in one deterministic step instead of a
 * re-search loop.
 */
export type TargetResolution =
  | { kind: "resolved"; nodeId: string }
  | { kind: "message"; text: string }

interface NodeMatch {
  id: string
  boardKey: string
  boardLabel: string
  catalogId: string
  label: string
  inActiveBoard: boolean
}

const MATCH_LIMIT = 10

/** Collects every node id listed in a board's variant trees. */
function boardNodeIds(workspace: Workspace, boardKey: BoardKey): Set<string> {
  const ids = new Set<string>()
  const board = workspace.boards[boardKey]
  if (!board || board.type !== "component") return ids
  walkBoardTreeRefs(board.variants, (ref) => {
    ids.add(ref.id)
  })
  return ids
}

/** The distinct component catalog ids present in a board's variant trees. */
function boardCatalogIds(
  workspace: Workspace,
  boardKey: BoardKey,
): Set<string> {
  const ids = new Set<string>()
  const board = workspace.boards[boardKey]
  if (!board || board.type !== "component") return ids
  walkBoardTreeRefs(board.variants, (ref) => {
    const node = workspace.nodes[ref.id]
    if (!node) return
    const catalogId = getNodeCatalogId(node, workspace)
    if (catalogId) ids.add(catalogId)
  })
  return ids
}

/**
 * The tier-2 fallback appended to a selection miss: the active board's node
 * trees plus the settable values of the components on it. When the selection
 * can't be resolved, the model walks up to the board and picks a target with the
 * values already in hand, instead of a blind re-search. Returns "" when no
 * active component board exists, so the caller adds nothing.
 */
function tierTwoBlock(
  workspace: Workspace,
  activeKey: BoardKey | undefined,
): string {
  if (activeKey === undefined) return ""
  const board = workspace.boards[activeKey]
  if (!board || board.type !== "component") return ""
  const block = [
    ...activeBoardSection(workspace, activeKey, board).lines,
    ...componentValuesSection(boardCatalogIds(workspace, activeKey), workspace),
  ]
    .join("\n")
    .trim()
  return block ? `\n\nActive board (tier 2) and its settable values:\n${block}` : ""
}

/** The settable values of one node's component, appended when a match is found off-board. */
function nodeValuesBlock(workspace: Workspace, nodeId: string): string {
  const node = workspace.nodes[nodeId]
  if (!node) return ""
  const catalogId = getNodeCatalogId(node, workspace)
  if (!catalogId) return ""
  const block = componentValuesSection(new Set([catalogId]), workspace)
    .join("\n")
    .trim()
  return block ? `\n\nSettable values for ${catalogId}:\n${block}` : ""
}

/** Searches every component board for nodes whose label or catalog id matches. */
function searchWorkspace(
  workspace: Workspace,
  query: string,
  activeKey: BoardKey | undefined,
): NodeMatch[] {
  const needle = query.trim().toLowerCase()
  if (needle === "") return []
  const activeIds =
    activeKey !== undefined ? boardNodeIds(workspace, activeKey) : new Set()

  const matches: NodeMatch[] = []
  for (const [key, board] of Object.entries(workspace.boards)) {
    if (board.type !== "component") continue
    walkBoardTreeRefs(board.variants, (ref) => {
      const node = workspace.nodes[ref.id]
      if (!node) return
      const catalogId = getNodeCatalogId(node, workspace) ?? ""
      const label = node.label ?? ""
      const hit =
        label.toLowerCase().includes(needle) ||
        catalogId.toLowerCase().includes(needle)
      if (!hit) return
      matches.push({
        id: ref.id,
        boardKey: key,
        boardLabel: board.label,
        catalogId,
        label,
        inActiveBoard: activeIds.has(ref.id),
      })
    })
  }
  return matches
}

function describe(match: NodeMatch): string {
  const name = match.label || match.catalogId || match.id
  return `${match.id} ("${name}"${match.catalogId ? ` ${match.catalogId}` : ""}) on board ${match.boardKey} "${match.boardLabel}"`
}

/**
 * Widens once to a workspace lookup and reports one outcome. A single match in
 * the active board resolves; a single match elsewhere returns a permission ask,
 * upholding the tier-3 gate; several matches return a short pick list; none
 * returns a not-found. Never resolves silently to an off-screen node. Workspace
 * scope relaxes the gate: the user selected the whole workspace, so a single
 * off-board match resolves directly instead of returning the permission ask.
 */
function widen(
  workspace: Workspace,
  query: string,
  activeKey: BoardKey | undefined,
  scope: SelectionScope | undefined,
): TargetResolution {
  const matches = searchWorkspace(workspace, query, activeKey)
  if (matches.length === 0) {
    return {
      kind: "message",
      text: `No node matches "${query}". Ask the user which node to change, or call find_nodes with a different term.`,
    }
  }
  if (matches.length === 1) {
    const match = matches[0]
    if (match.inActiveBoard || scope === "workspace") {
      return { kind: "resolved", nodeId: match.id }
    }
    return {
      kind: "message",
      text: `Found ${describe(match)}, outside the active board. Ask the user to confirm before editing it, then call again with target { "nodeId": "${match.id}" }.${nodeValuesBlock(workspace, match.id)}`,
    }
  }
  const list = matches
    .slice(0, MATCH_LIMIT)
    .map((match) => `- ${describe(match)}`)
    .join("\n")
  return {
    kind: "message",
    text: `Several nodes match "${query}":\n${list}\nAsk the user which one, then call again with its nodeId.`,
  }
}

/**
 * Resolves a node target for a mutation tool. The selection sentinel resolves
 * only when a node is selected, so a board-only or empty selection is reported
 * as ambiguous rather than guessed. An unknown explicit id and an unresolved
 * sentinel with a `match` hint escalate once through {@link widen}.
 */
export function resolveNodeTarget(
  workspace: Workspace,
  activeKey: BoardKey | undefined,
  selectedNodeId: string | undefined,
  selectedBoardId: BoardKey | undefined,
  target: TargetSpec,
  match: string | undefined,
  scope: SelectionScope | undefined,
): TargetResolution {
  if (target === "selection") {
    if (selectedNodeId && workspace.nodes[selectedNodeId]) {
      return { kind: "resolved", nodeId: selectedNodeId }
    }
    if (match) return widen(workspace, match, activeKey, scope)
    const selectionNote = selectedBoardId
      ? `A board (${selectedBoardId}) is selected, not a node`
      : "Nothing is selected"
    return {
      kind: "message",
      text: `${selectionNote}, so 'this' is ambiguous. Pick the target from the active board below, or pass an explicit target { nodeId }, or ask the user which node to change.${tierTwoBlock(workspace, activeKey)}`,
    }
  }

  if (workspace.nodes[target.nodeId]) {
    return { kind: "resolved", nodeId: target.nodeId }
  }
  return widen(workspace, match ?? target.nodeId, activeKey, scope)
}
