import { rules } from "@seldon/core/rules/config/rules.config"
import { nodeRelationshipService, typeCheckingService } from "@seldon/core/workspace/services"
import { getNodeCatalogComponentId, getNodeChildIds } from "./node-tree"

import type { Placement } from "../types"
import type { Instance, Variant, Workspace } from "@seldon/core"
import type { EntryNode } from "@seldon/core/workspace/types"

/**
 * Whether `subject` can be dropped at `placement` relative to `target`. Pure and
 * view-neutral so both editors validate a sidebar drop identically. Covers
 * same-variant instance reparent/reorder, variant-into-container instantiation,
 * and same-component variant reorder. Ported from the React objects-sidebar
 * dropzone.
 */
export function isValidDropTarget(
  target: Variant | Instance | EntryNode,
  subject: Variant | Instance | EntryNode,
  placement: Placement,
  workspace: Workspace,
): boolean {
  if (!target || !subject) return false

  if (workspace.nodes[target.id] === undefined) return false

  if (placement === "inside") {
    const targetEntityType = typeCheckingService.getEntityType(target)

    if (!rules.mutations.insertInto[targetEntityType].allowed) return false
  }

  const subjectComponentId = getNodeCatalogComponentId(subject, workspace)
  const targetComponentId = getNodeCatalogComponentId(target, workspace)

  if (
    typeCheckingService.isInstance(subject) &&
    typeCheckingService.isInstance(target) &&
    subjectComponentId &&
    targetComponentId &&
    nodeRelationshipService.areWithinSameVariant(target, subject, workspace)
  ) {
    if (placement === "inside") {
      return (
        typeCheckingService.canComponentBeParentOf(targetComponentId, subjectComponentId) &&
        !nodeRelationshipService.hasAncestorWithComponentId(subjectComponentId, target, workspace)
      )
    }

    return true
  }

  // A variant dropped inside a container instantiates a new child instance. The
  // insertInto allowance was checked above; confirm the variant can instantiate
  // and the container accepts its level.
  if (
    typeCheckingService.isVariant(subject) &&
    placement === "inside" &&
    subjectComponentId &&
    targetComponentId
  ) {
    const subjectEntityType = typeCheckingService.getEntityType(subject)

    if (!rules.mutations.instantiate[subjectEntityType].allowed) return false

    return (
      typeCheckingService.canComponentBeParentOf(targetComponentId, subjectComponentId) &&
      !nodeRelationshipService.hasAncestorWithComponentId(subjectComponentId, target, workspace)
    )
  }

  if (
    typeCheckingService.isVariant(subject) &&
    typeCheckingService.isVariant(target) &&
    subjectComponentId &&
    targetComponentId &&
    subjectComponentId === targetComponentId &&
    placement !== "inside"
  ) {
    return true
  }

  return false
}

/**
 * Whether the drop would leave the order unchanged. A reorder removes the subject
 * and re-inserts it, so a slot the subject already occupies changes nothing. The
 * sidebars withhold drop feedback for these, since offering a target that does
 * nothing reads as a failed move.
 *
 * A duplicate is never a no-op, so callers skip this while Alt is held.
 */
export function isNoOpDrop(
  target: Variant | Instance | EntryNode,
  subject: Variant | Instance | EntryNode,
  placement: Placement,
  workspace: Workspace,
): boolean {
  if (target.id === subject.id) return true

  // `inside` appends after the target's existing children, so a subject that is
  // already the last of them stays put.
  if (placement === "inside") {
    const childIds = getNodeChildIds(target, workspace)

    return childIds[childIds.length - 1] === subject.id
  }

  // The gap above a node is the gap below the node before it. Either way round,
  // a slot beside an adjacent sibling is the slot the subject is already in.
  const direction = placement === "before" ? "after" : "before"

  if (typeCheckingService.isInstance(subject) && typeCheckingService.isInstance(target)) {
    return nodeRelationshipService.findAdjacent(subject, direction, workspace)?.id === target.id
  }

  if (typeCheckingService.isVariant(subject) && typeCheckingService.isVariant(target)) {
    return nodeRelationshipService.findAdjacent(subject, direction, workspace)?.id === target.id
  }

  return false
}
