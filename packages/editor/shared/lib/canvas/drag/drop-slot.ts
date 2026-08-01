import { nodeRelationshipService, nodeTraversalService } from "@seldon/core/workspace/services"
import { getNodeChildIds } from "../../workspace/node-tree"
import {
  getBoardVariantRootIds,
  getComponent,
  getComponentKey,
} from "../../workspace/workspace-accessors"

import type { Placement } from "../../types"
import type { Instance, Variant, Workspace } from "@seldon/core"
import type { BoardKey, EntryNodeId } from "@seldon/core/workspace/types"

export interface SlotContainer {
  id: string
  type: "node" | "board"
}

/**
 * Where a child would land on the canvas, in workspace terms rather than pixels,
 * so the pointer and a sidebar row can express the same slot and both surfaces
 * draw the same mark for it.
 *
 * The mark sits after `boundaryChildId`. With no boundary child it sits on the
 * container's own edge, which `placement` picks: `before` and `inside` mean its
 * leading edge, `after` means its trailing edge.
 */
export interface CanvasDropSlot {
  containerId: string
  containerType: "node" | "board"
  boundaryChildId: string | null
  placement: Placement
}

/** The container a slot beside `node` belongs to: its parent node, or its board. */
export function findSlotContainer(
  node: Variant | Instance,
  workspace: Workspace,
): SlotContainer | null {
  try {
    const parent = nodeTraversalService.findParentNode(node.id, workspace)

    if (parent) return { id: parent.id, type: "node" }
  } catch {
    // A node with no parent is a variant, which sits on a board.
  }

  try {
    const board = nodeRelationshipService.findBoardForNode(node, workspace)

    return board ? { id: getComponentKey(board), type: "board" } : null
  } catch {
    return null
  }
}

/** The children the container lays out, in order. */
export function getSlotContainerChildIds(container: SlotContainer, workspace: Workspace): string[] {
  if (container.type === "board") {
    const board = getComponent(workspace, container.id as BoardKey)

    return board ? getBoardVariantRootIds(board) : []
  }

  const node = workspace.nodes[container.id as EntryNodeId]

  return node ? getNodeChildIds(node, workspace) : []
}

/** The index the dropped child takes among the container's children. */
export function getSlotIndex(slot: CanvasDropSlot, workspace: Workspace): number {
  if (!slot.boundaryChildId) return 0

  const children = getSlotContainerChildIds(
    { id: slot.containerId, type: slot.containerType },
    workspace,
  )
  const boundary = children.indexOf(slot.boundaryChildId)

  return boundary === -1 ? children.length : boundary + 1
}

/**
 * The node a move or duplicate action aims at for this slot, and the side it
 * lands on. A slot on a container's leading edge becomes `before` its first
 * child, so the same slot reads the same way to every action.
 */
export function getSlotMoveTarget(
  slot: CanvasDropSlot,
  workspace: Workspace,
): { targetId: string; placement: Placement } | null {
  if (slot.boundaryChildId) {
    return { targetId: slot.boundaryChildId, placement: "after" }
  }

  const container: SlotContainer = { id: slot.containerId, type: slot.containerType }
  const children = getSlotContainerChildIds(container, workspace)

  if (children.length > 0) {
    return { targetId: children[0], placement: "before" }
  }

  if (container.type === "board") return null

  return { targetId: container.id, placement: "inside" }
}
