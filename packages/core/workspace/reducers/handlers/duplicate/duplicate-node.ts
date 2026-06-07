import { rules } from "../../../../rules/config/rules.config"
import {
  debugGroup,
  debugGroupEnd,
  debugLog,
} from "../../../../utils/debug-logger"
import {
  nodeRetrievalService,
  nodeOperationsService,
  workspacePropagationService,
  typeCheckingService,
} from "../../../services"
import { ExtractPayload, Workspace } from "../../../types"
import type { ValidationOptions } from "../../helpers/validation"

/**
 * Applies `duplicate_node`: an in-place copy gated by
 * `rules.mutations.duplicate[entityType]`. When allowed, duplicates the subtree
 * with the configured propagation; otherwise returns the workspace unchanged.
 * For `EntryNode` composition boards, duplicating a variant root remaps the board tree and
 * `node:` templates in copied rows; duplicating an instance inserts a new id after the source
 * in the same parent branch.
 *
 * This is distinct from `insert_duplicate_instance`, which copies an instance
 * into a chosen parent and is gated by `instantiate` plus `insertInto`.
 */
export function duplicateNode(
  payload: ExtractPayload<"duplicate_node">,
  workspace: Workspace,
  _options: ValidationOptions = {},
): Workspace {
  const node = nodeRetrievalService.getNode(payload.nodeId, workspace)
  const entityType = typeCheckingService.getEntityType(node)
  const isVariant = typeCheckingService.isVariant(node)
  const isInstance = typeCheckingService.isInstance(node)

  debugGroup("Workspace", "duplicateNode", "Duplicating node")
  debugLog("Workspace", "duplicateNode", "Node details", {
    nodeId: payload.nodeId,
    entityType,
    isVariant,
    isInstance,
  })

  if (rules.mutations.duplicate[entityType].allowed) {
    const propagation = rules.mutations.duplicate[entityType].propagation

    debugLog(
      "Workspace",
      "duplicateNode",
      "Duplication allowed, applying with propagation",
      {
        propagation,
      },
    )

    const result = workspacePropagationService.propagateNodeOperation({
      nodeId: payload.nodeId,
      propagation,
      apply: (node, workspace) => {
        debugLog(
          "Workspace",
          "duplicateNode",
          "Duplicating node in workspace",
          {
            nodeId: node.id,
          },
        )
        return nodeOperationsService.duplicateNode(node.id, workspace)
      },
      workspace,
    })

    debugLog("Workspace", "duplicateNode", "Node duplication complete")
    debugGroupEnd("Workspace", "duplicateNode", "Node duplication complete")
    return result
  }

  debugLog(
    "Workspace",
    "duplicateNode",
    "Duplication not allowed for entity type",
  )
  debugGroupEnd(
    "Workspace",
    "duplicateNode",
    "Duplication not allowed for entity type",
  )
  return workspace
}
