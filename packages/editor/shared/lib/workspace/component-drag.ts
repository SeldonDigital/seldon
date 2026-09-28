import { rules } from "@seldon/core/rules/config/rules.config"
import { validateComponentInsertionForUI } from "@seldon/core/workspace/reducers/helpers/validation"
import { nodeTraversalService, typeCheckingService } from "@seldon/core/workspace/services"
import { isValidDropTarget } from "./drop-validity"

import type { Instance, Variant, Workspace } from "@seldon/core"
import type { ComponentId } from "@seldon/core/components/constants"
import type { InstanceId, VariantId } from "@seldon/core/workspace/types"

export type ComponentDragPayload =
  | {
      componentId: ComponentId
      kind: "catalog"
      variantId?: VariantId
    }
  | {
      kind: "authored"
      variantId: VariantId
    }

export interface ComponentDropTarget {
  index: number
  nodeId: InstanceId | VariantId
}

export type ComponentDropReason = "defaultVariant" | "hierarchy" | "mutation" | "missingTarget"

export interface ComponentDropResolution {
  isValid: boolean
  reason?: ComponentDropReason
  target: ComponentDropTarget
}

export function resolveComponentDrop(
  payload: ComponentDragPayload,
  target: ComponentDropTarget,
  workspace: Workspace,
): ComponentDropResolution {
  const targetNode = workspace.nodes[target.nodeId]

  if (!targetNode) {
    return { isValid: false, reason: "missingTarget", target }
  }

  if (hasDefaultVariantAncestor(targetNode, workspace)) {
    return { isValid: false, reason: "defaultVariant", target }
  }

  if (!isInsertionMutationAllowed(targetNode)) {
    return { isValid: false, reason: "mutation", target }
  }

  if (payload.kind === "catalog") {
    const validation = validateComponentInsertionForUI(
      payload.componentId,
      target.nodeId,
      workspace,
    )
    return {
      isValid: validation.isValid,
      reason: validation.isValid ? undefined : "hierarchy",
      target,
    }
  }

  const subject = workspace.nodes[payload.variantId]
  const isValid = Boolean(subject && isValidDropTarget(targetNode, subject, "inside", workspace))

  return {
    isValid,
    reason: isValid ? undefined : "hierarchy",
    target,
  }
}

function hasDefaultVariantAncestor(node: Instance | Variant, workspace: Workspace): boolean {
  let current: Instance | Variant | null = node

  while (current) {
    if (typeCheckingService.isVariant(current) && typeCheckingService.isDefaultVariant(current)) {
      return true
    }

    current = nodeTraversalService.findParentNode(current.id, workspace)
  }

  return false
}

function isInsertionMutationAllowed(node: Instance | Variant): boolean {
  if (!typeCheckingService.isVariant(node)) return true

  return rules.mutations.insertInto[typeCheckingService.getEntityType(node)].allowed
}
