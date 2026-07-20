import { ComponentId } from "@seldon/core/components/constants"
import { InstanceId, VariantId, Workspace } from "@seldon/core/index"
import { findParentNode } from "@seldon/core/workspace/helpers/nodes/find-parent-node"
import {
  nodeRelationshipService,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import type { BoardKey, EntryNode } from "@seldon/core/workspace/types"
import { getNodeCatalogComponentId, getNodeChildIds } from "./node-tree"
import { getComponentKey, getNode } from "./workspace-accessors"

/**
 * Where a paste should land, resolved from the clipboard subject and the current
 * selection. The subject-kind branch (variant vs instance) is deliberately not
 * decided here; it lives only in `duplicateNodeInto` so paste and option-drag
 * share one implementation.
 */
export type PasteTargetResult =
  | {
      action: "duplicate-into"
      parentId: VariantId | InstanceId
      index: number
    }
  | { action: "duplicate-variant"; variantId: VariantId }
  | { action: "error"; message: string }

/** Level rule plus cycle guard, matching the drag validator but variant-agnostic. */
function canPasteInto(
  targetComponentId: ComponentId,
  subjectComponentId: ComponentId,
  targetNode: EntryNode,
  workspace: Workspace,
): boolean {
  return (
    typeCheckingService.canComponentBeParentOf(
      targetComponentId,
      subjectComponentId,
    ) &&
    !nodeRelationshipService.hasAncestorWithComponentId(
      subjectComponentId,
      targetNode,
      workspace,
    )
  )
}

function isDefaultVariantTarget(node: EntryNode): boolean {
  return (
    typeCheckingService.isVariant(node) &&
    typeCheckingService.isDefaultVariant(node)
  )
}

export function resolvePasteTarget({
  subjectId,
  selectedNode,
  selectedBoardId,
  workspace,
}: {
  subjectId: VariantId | InstanceId
  selectedNode: EntryNode | null
  selectedBoardId: BoardKey | null
  workspace: Workspace
}): PasteTargetResult {
  const subject = getNode(workspace, subjectId)
  if (!subject) {
    return { action: "error", message: "The copied object no longer exists" }
  }

  const subjectComponentId = getNodeCatalogComponentId(subject, workspace)
  if (!subjectComponentId) {
    return { action: "error", message: "This object cannot be pasted" }
  }

  // A node is selected: try to paste inside it, otherwise below it as a sibling.
  if (selectedNode) {
    const targetComponentId = getNodeCatalogComponentId(selectedNode, workspace)
    if (
      targetComponentId &&
      !isDefaultVariantTarget(selectedNode) &&
      canPasteInto(
        targetComponentId,
        subjectComponentId,
        selectedNode,
        workspace,
      )
    ) {
      const index = getNodeChildIds(selectedNode, workspace).length
      return { action: "duplicate-into", parentId: selectedNode.id, index }
    }

    const parent = findParentNode(selectedNode.id, workspace)
    if (parent) {
      const parentComponentId = getNodeCatalogComponentId(parent, workspace)
      if (
        parentComponentId &&
        !isDefaultVariantTarget(parent) &&
        canPasteInto(parentComponentId, subjectComponentId, parent, workspace)
      ) {
        const childIds = getNodeChildIds(parent, workspace)
        const targetIndex = childIds.indexOf(selectedNode.id)
        const index = targetIndex === -1 ? childIds.length : targetIndex + 1
        return { action: "duplicate-into", parentId: parent.id, index }
      }
    }

    return { action: "error", message: "This object cannot be pasted here" }
  }

  // A board is selected with no node: only a variant of that board may paste.
  if (selectedBoardId) {
    if (!typeCheckingService.isVariant(subject)) {
      return {
        action: "error",
        message: "Only variants can be pasted onto a board",
      }
    }

    const board = nodeRelationshipService.findBoardForVariant(
      subject,
      workspace,
    )
    if (!board || getComponentKey(board) !== selectedBoardId) {
      return {
        action: "error",
        message: "A variant can only be pasted onto its own board",
      }
    }

    return { action: "duplicate-variant", variantId: subject.id }
  }

  return { action: "error", message: "Select where to paste" }
}
