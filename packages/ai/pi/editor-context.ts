import type { Board, BoardKey, Workspace } from "@seldon/core/workspace/types"

import { activeBoardSection } from "../prompt/context-sections/active-board"
import { selectionSection } from "../prompt/context-sections/selection"

/** The editor state the agent needs to target the right board and node. */
export interface EditorContextInput {
  workspace: Workspace
  activeBoardKey?: BoardKey
  selectedNodeId?: string
  selectedNodeRootId?: string
}

/** The active board resolved from the request, plus the passthrough selection. */
export interface ResolvedContext {
  workspace: Workspace
  resolvedKey?: BoardKey
  activeBoard?: Board
  selectedNodeId?: string
  selectedNodeRootId?: string
}

/**
 * Resolves the board the agent should act on. Mirrors the Ollama context
 * builder: the requested board when it exists, otherwise the first component
 * board, so the agent is always scoped to one board on screen.
 */
export function resolveContext(input: EditorContextInput): ResolvedContext {
  const { workspace, activeBoardKey, selectedNodeId, selectedNodeRootId } =
    input
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
  }
}

/**
 * The compact per-turn context injected with each prompt. It carries only the
 * volatile parts the model must see fresh every turn: the active board tree and
 * the selection. Static rules live in the cached system prompt, and the heavier
 * reference lists, including theme ids and tokens, are fetched on demand through
 * the read tools, so this stays small and the system-prompt prefix cache stays
 * warm.
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
    lines.push(...activeBoardSection(workspace, resolvedKey, activeBoard).lines)
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

  return lines.join("\n")
}
