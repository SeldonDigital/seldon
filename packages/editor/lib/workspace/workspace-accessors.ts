import { getComponentVariantRootIds as getComponentVariantRootIdsFromCore } from "@seldon/core/workspace/helpers/components/get-component-variant-root-ids"
import type {
  ComponentEntry,
  ComponentKey,
  ComponentTreeRef,
  EntryNode,
  EntryNodeId,
  Workspace,
} from "@seldon/core/workspace/types"

/** Read root variant node ids from a component row. Never pass `board.variants[i]` to `getNode`. */
export function getComponentVariantRootIds(board: ComponentEntry): string[] {
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
): Record<ComponentKey, ComponentEntry> {
  return workspace.components
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
  componentKey: ComponentKey,
): ComponentEntry | undefined {
  return workspace.components[componentKey]
}

/** Resolves the `workspace.components` map key for a catalog row. */
export function resolveComponentKey(
  board: ComponentEntry,
  workspace: Workspace,
): ComponentKey {
  if ("catalogId" in board && board.catalogId) {
    if (workspace.components[board.catalogId]) {
      return board.catalogId
    }
  }

  const matched = Object.entries(workspace.components).find(
    ([, entry]) => entry === board,
  )
  if (matched) {
    return matched[0]
  }

  throw new Error(
    "Component entry has no catalogId and could not be found in workspace.components",
  )
}

export function getComponentKey(board: ComponentEntry): ComponentKey {
  if ("catalogId" in board && board.catalogId) {
    return board.catalogId
  }
  const legacyId = (board as { id?: string }).id
  if (legacyId) {
    return legacyId
  }
  throw new Error("Component entry has no catalogId or id")
}
