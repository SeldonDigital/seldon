import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type { Board, BoardKey, Workspace } from "@seldon/core/workspace/types"

import {
  activeBoardSection,
  activeVariantSection,
} from "../prompt/context-sections/active-board"
import { componentValuesSection } from "../prompt/context-sections/component-values"
import { selectionSection } from "../prompt/context-sections/selection"

/** The editor state the agent needs to target the right board and node. */
export interface EditorContextInput {
  workspace: Workspace
  activeBoardKey?: BoardKey
  selectedNodeId?: string
  selectedNodeRootId?: string
  selectedBoardId?: BoardKey
}

/** The active board resolved from the request, plus the passthrough selection. */
export interface ResolvedContext {
  workspace: Workspace
  resolvedKey?: BoardKey
  activeBoard?: Board
  selectedNodeId?: string
  selectedNodeRootId?: string
  selectedBoardId?: BoardKey
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
 * volatile parts the model must see fresh every turn, scoped to the narrowest
 * tier that fits: the active variant subtree when the user has a selection
 * (tier 1), otherwise every variant on the active board (tier 2). The whole
 * workspace (tier 3) stays behind the find_nodes and list_boards tools. Static
 * rules live in the cached system prompt, and the heavier reference lists are
 * fetched on demand, so this stays small and the prefix cache stays warm.
 */
export function buildTurnContext(resolved: ResolvedContext): string {
  const {
    workspace,
    resolvedKey,
    activeBoard,
    selectedNodeId,
    selectedNodeRootId,
  } = resolved
  const lines: string[] = [
    `Workspace: "${workspace.metadata.label ?? "Untitled"}"`,
  ]

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
      lines.push(
        "",
        "Scope: the active variant above (tier 1 of 3). Widen only if it lacks the target: call get_active_board for every variant on this board (tier 2), then find_nodes or list_boards to search the whole workspace (tier 3).",
      )
    } else {
      lines.push(
        ...activeBoardSection(workspace, resolvedKey, activeBoard).lines,
      )
      lines.push(
        "",
        "Scope: every variant on the active board above (tier 2 of 3). Widen only if it lacks the target: call find_nodes or list_boards to search the whole workspace (tier 3).",
      )
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
