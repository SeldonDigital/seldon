import { getComponentSchema } from "../../../components/catalog"
import { ComponentLevel, isComponentId } from "../../../components/constants"
import { rules } from "../../../rules/config/rules.config"
import { getBoardByNodeId } from "../../helpers/components/get-board-by-node-id"
import { getChildrenIds } from "../../helpers/components/get-children-ids"
import { getVariantTree } from "../../helpers/components/get-variant-tree"
import { getWorkspaceNodes } from "../../helpers/general/get-workspace-nodes"
import { getNodeCatalogId } from "../../helpers/nodes/get-node-catalog-id"
import type {
  ComponentTreeRef,
  EntryNodeId,
  InstanceId,
  VariantId,
  Workspace,
} from "../../types"
import { typeCheckingService } from "../type-checking/type-checking.service"
import { nodeRelationshipService } from "./node-relationship.service"
import { nodeTraversalService } from "./node-traversal.service"

/**
 * Directional moves for an instance, expressed as steps through a document-order
 * list of insertion slots across the whole root-variant tree. Forward and
 * backward step one slot; front and back jump to the extremes. The traversal is
 * pure so the editor and a headless agent resolve the same target.
 */
export type MoveDirection = "forward" | "backward" | "front" | "back"

/** A concrete placement: the destination parent and the post-removal child index. */
export interface MoveTarget {
  parentId: VariantId | InstanceId
  index: number
}

/** Resolves a node's component level through `node:` links, or `null`. */
function getNodeLevel(
  workspace: Workspace,
  nodeId: EntryNodeId,
): ComponentLevel | null {
  const node = getWorkspaceNodes(workspace)[nodeId]
  if (!node) return null
  const catalogId = getNodeCatalogId(node, workspace)
  if (!catalogId || !isComponentId(catalogId)) return null
  return getComponentSchema(catalogId).level
}

/** Whether a parent of `parentLevel` may contain a child of `childLevel`. */
function levelAccepts(
  parentLevel: ComponentLevel,
  childLevel: ComponentLevel,
): boolean {
  return rules.componentLevels[parentLevel].mayContain.includes(childLevel)
}

/** Whether a level can hold any children at all (so traversal descends into it). */
function isContainerLevel(level: ComponentLevel): boolean {
  return rules.componentLevels[level].mayContain.length > 0
}

/**
 * Builds the document-order list of insertion slots for `selectedLevel`, with the
 * selected node conceptually removed so indices match what the move and reorder
 * reducers expect. A slot is emitted for every gap in a container that accepts
 * the level; traversal descends into any container to reach viable slots deeper.
 */
function buildSlots(
  workspace: Workspace,
  rootRef: ComponentTreeRef,
  selectedId: EntryNodeId,
  selectedLevel: ComponentLevel,
): MoveTarget[] {
  const slots: MoveTarget[] = []

  function walk(ref: ComponentTreeRef): void {
    const level = getNodeLevel(workspace, ref.id)
    if (level === null) return

    const accepts = levelAccepts(level, selectedLevel)
    const children = (ref.children ?? []).filter(
      (child) => child.id !== selectedId,
    )

    for (let index = 0; index <= children.length; index++) {
      if (accepts) slots.push({ parentId: ref.id, index })
      if (index < children.length) {
        const child = children[index]
        const childLevel = getNodeLevel(workspace, child.id)
        if (childLevel !== null && isContainerLevel(childLevel)) {
          walk(child)
        }
      }
    }
  }

  walk(rootRef)
  return slots
}

/**
 * Resolves the target placement for moving `instanceId` in `direction`, or `null`
 * when the move does not apply (not an instance, inside a default variant, or
 * already at the relevant extreme). The returned index is a post-removal index,
 * so it feeds `reorder_instance_in_parent` (same parent) or `move_instance`
 * (different parent) directly.
 */
export function resolveInstanceMoveTarget(
  workspace: Workspace,
  instanceId: EntryNodeId,
  direction: MoveDirection,
): MoveTarget | null {
  const node = getWorkspaceNodes(workspace)[instanceId]
  if (!node || !typeCheckingService.isInstance(node)) return null

  const rootVariant = nodeRelationshipService.getRootVariant(node, workspace)
  if (typeCheckingService.isDefaultVariant(rootVariant)) return null

  const board = getBoardByNodeId(workspace, instanceId)
  if (!board) return null

  const rootRef = getVariantTree(board, rootVariant.id)
  if (!rootRef) return null

  const selectedLevel = getNodeLevel(workspace, instanceId)
  if (selectedLevel === null) return null

  const parent = nodeTraversalService.findParentNode(instanceId, workspace)
  if (!parent) return null
  const currentIndex = getChildrenIds(board, parent.id).indexOf(instanceId)
  if (currentIndex === -1) return null

  const slots = buildSlots(workspace, rootRef, instanceId, selectedLevel)
  const currentPos = slots.findIndex(
    (slot) => slot.parentId === parent.id && slot.index === currentIndex,
  )
  if (currentPos === -1) return null

  switch (direction) {
    case "forward":
      return slots[currentPos + 1] ?? null
    case "backward":
      return slots[currentPos - 1] ?? null
    case "front":
      return currentPos > 0 ? slots[0] : null
    case "back":
      return currentPos < slots.length - 1 ? slots[slots.length - 1] : null
  }
}

/** Whether a directional move would change the instance's placement. */
export function canMoveInstance(
  workspace: Workspace,
  instanceId: EntryNodeId,
  direction: MoveDirection,
): boolean {
  return resolveInstanceMoveTarget(workspace, instanceId, direction) !== null
}
