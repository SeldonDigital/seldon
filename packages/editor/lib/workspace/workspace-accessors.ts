import { getBoardVariantRootIds as getComponentVariantRootIdsFromCore } from "@seldon/core/workspace/helpers/components/get-board-variant-root-ids"
import type {
  Board,
  BoardKey,
  ComponentTreeRef,
  EntryNode,
  EntryNodeId,
  Workspace,
} from "@seldon/core/workspace/types"

/** Read root variant node ids from a component row. Never pass `board.variants[i]` to `getNode`. */
export function getBoardVariantRootIds(board: Board): string[] {
  return getComponentVariantRootIdsFromCore(board)
}

export function getComponentTreeRefId(ref: ComponentTreeRef | string): string {
  return typeof ref === "string" ? ref : ref.id
}

export function getWorkspaceNodeMap(
  workspace: Workspace,
): Record<EntryNodeId, EntryNode> {
  return workspace.nodes
}

export function getWorkspaceComponentMap(
  workspace: Workspace,
): Record<BoardKey, Board> {
  return workspace.boards
}

export function getNode(
  workspace: Workspace,
  nodeId: EntryNodeId,
): EntryNode | undefined {
  return workspace.nodes[nodeId]
}

export function hasNode(workspace: Workspace, nodeId: EntryNodeId): boolean {
  return workspace.nodes[nodeId] !== undefined
}

export function getComponent(
  workspace: Workspace,
  boardKey: BoardKey,
): Board | undefined {
  return workspace.boards[boardKey]
}

/** Resolves the `workspace.boards` map key for a catalog row. */
export function resolveComponentKey(
  board: Board,
  workspace: Workspace,
): BoardKey {
  if ("catalogId" in board && board.catalogId) {
    if (workspace.boards[board.catalogId]) {
      return board.catalogId
    }
  }

  const matched = Object.entries(workspace.boards).find(
    ([, entry]) => entry === board,
  )
  if (matched) {
    return matched[0]
  }

  throw new Error(
    "Component entry has no catalogId and could not be found in workspace.boards",
  )
}

export function getComponentKey(board: Board): BoardKey {
  if ("catalogId" in board && board.catalogId) {
    return board.catalogId
  }
  const legacyId = (board as { id?: string }).id
  if (legacyId) {
    return legacyId
  }
  throw new Error("Component entry has no catalogId or id")
}
