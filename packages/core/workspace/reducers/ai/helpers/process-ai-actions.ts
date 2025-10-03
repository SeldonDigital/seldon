import { produce } from "immer"
import { ComponentId } from "../../../../components/constants"
import { getNodeIdAddedByAction } from "../../../helpers/get-node-id-added-by-action"
import { Action, ReferenceId, Workspace } from "../../../types"
import { aiReducer } from "../reducer"
import { AIAction } from "../types"
import {
  ReferenceMap,
  getReferenceMap,
  getSchemaAwareReferenceMap,
} from "./get-reference-map"
import {
  ComponentStructure,
  analyzeRequiredStructures,
  createMissingVariants,
} from "./schema-workspace-reconciliation"

/**
 * This function processes the AI actions and returns the updated workspace
 * Please check the detailed description in the getReferenceMap function
 *
 * @param workspace - The current workspace
 * @param actions - The actions to process
 * @returns The updated workspace
 */
export function processAiActions(
  workspace: Workspace,
  actions: Action[],
): Workspace {
  // Preprocess actions to handle schema-workspace mismatches
  const aiActions = filterAiActions(actions)
  const { workspace: preprocessedWorkspace, createdVariants } =
    preprocessAiActions(aiActions, workspace)

  // Reset referenceMap for each new call
  let referenceMap: ReferenceMap = {}

  // Loop through each action to build a new workspace
  return aiActions.reduce((workspace, baseAction, index) => {
    // Replace the referenceId with the actual id
    const action = replaceReferenceId(referenceMap, baseAction)

    // Skip ai_add_component actions for components that already exist
    if (action.type === "ai_add_component") {
      const componentId = action.payload.componentId
      if (workspace.boards[componentId]) {
        // Board already exists, skip this action but update reference map
        const variants = workspace.boards[componentId]!.variants
        if (variants.length > 0) {
          const existingVariantId = variants[0]
          // Update reference map if we have a variant ID, even if it's falsy
          // This ensures proper reference mapping for subsequent AI actions
          if (existingVariantId !== undefined) {
            const newReferenceMap = getSchemaAwareReferenceMap(
              action.payload.ref,
              existingVariantId,
              workspace,
            )
            referenceMap = {
              ...referenceMap,
              ...newReferenceMap,
            }
          }
        }
        return workspace
      }
    }

    // Handle ai_add_variant actions - always create new user variants
    if (action.type === "ai_add_variant") {
      const componentId = action.payload.componentId

      // First check if we created a custom variant in preprocessing
      if (createdVariants.has(componentId)) {
        const customVariantId = createdVariants.get(componentId)!
        const newReferenceMap = getSchemaAwareReferenceMap(
          action.payload.ref,
          customVariantId as any,
          workspace,
        )
        referenceMap = {
          ...referenceMap,
          ...newReferenceMap,
        }
        return workspace
      }

      // Always allow ai_add_variant to create new user variants
      // This ensures we don't modify existing default variants
    }

    // Skip actions that reference non-existent nodes (workspace-aware filtering)
    // Note: This check happens AFTER reference ID replacement, so we check the resolved ID
    if (isActionReferencingNonExistentNode(action, workspace)) {
      return workspace
    }

    let result = aiReducer(workspace, action)
    /**
     * If the action creates a new node we need to build a reference map
     * so that follow-up actions can target the newly created node
     *
     * E.g. the AI could say nodeId $ref.0.0.1, which actually points to child-title-xx
     * using replaceReferenceId we swap $ref.0.0.1 in the action with the actual id
     *
     */
    // If the action creates a new node, we need to update the reference map
    if (actionCreatesNewNode(action)) {
      const addedNodeId = getNodeIdAddedByAction(action, result)
      const ref = getRefFromAction(action)
      if (ref) {
        const newReferenceMap = getSchemaAwareReferenceMap(
          ref,
          addedNodeId,
          result,
        )
        referenceMap = {
          ...referenceMap,
          ...newReferenceMap,
        }
      }
    }

    return result
  }, preprocessedWorkspace)
}

/**
 * Preprocess AI actions to handle schema-workspace mismatches
 */
function preprocessAiActions(
  actions: AIAction[],
  workspace: Workspace,
): {
  workspace: Workspace
  createdVariants: Map<string, string> // Maps componentId to created variant ID
} {
  // Analyze what component structures are needed
  const requiredStructures = analyzeRequiredStructures(actions)

  // Filter out components that will be handled by ai_add_component actions
  // These should use default variants created by handleAddBoard, not custom variants
  const filteredStructures = new Map<ComponentId, ComponentStructure>()
  const aiAddComponentIds = new Set<ComponentId>()

  // Collect component IDs that will be handled by ai_add_component actions
  for (const action of actions) {
    if (action.type === "ai_add_component") {
      aiAddComponentIds.add(action.payload.componentId)
    }
  }

  // Only create custom variants for components that won't be handled by ai_add_component
  for (const [componentId, structure] of requiredStructures) {
    if (!aiAddComponentIds.has(componentId)) {
      filteredStructures.set(componentId, structure)
    }
  }

  // Create missing variants if needed (only for non-ai_add_component components)
  const { workspace: updatedWorkspace, createdVariants } =
    createMissingVariants(filteredStructures, workspace)

  return { workspace: updatedWorkspace, createdVariants }
}

/**
 * Check if an action references a node that doesn't exist in the workspace
 */
function isActionReferencingNonExistentNode(
  action: AIAction,
  workspace: Workspace,
): boolean {
  // Check actions that reference specific nodes
  const nodeReferencingActions = [
    "ai_remove_node",
    "ai_set_node_properties",
    "ai_set_node_label",
    "ai_set_node_theme",
    "ai_reset_node_property",
    "ai_move_node",
    "ai_reorder_node",
    "ai_duplicate_node",
    "ai_insert_node",
  ]

  if (nodeReferencingActions.includes(action.type)) {
    const nodeId = getNodeIdFromAction(action)
    if (nodeId) {
      // Skip actions that reference "missing-" nodes (schema-expected but not in workspace)
      if (nodeId.startsWith("missing-")) {
        return true
      }

      // Skip actions that reference nodes that truly don't exist
      if (!workspace.byId[nodeId]) {
        return true
      }
    }
  }

  // Check actions that reference target nodes (move, insert)
  if (action.type === "ai_move_node" || action.type === "ai_insert_node") {
    const targetParentId = getTargetParentIdFromAction(action)
    if (targetParentId) {
      if (
        targetParentId.startsWith("missing-") ||
        !workspace.byId[targetParentId]
      ) {
        return true
      }
    }
  }

  return false
}

function replaceReferenceId(referenceMap: ReferenceMap, action: AIAction) {
  return produce(action, (draft) => {
    if (draft.type === "ai_transcript_add_message") {
      return draft
    }

    // If this is the ai_add_component action, we need to replace check if the target parentId is a referenceId
    // If it is, we need to replace it with the actual id
    if ("target" in draft.payload && draft.payload.target) {
      if (isReferenceId(draft.payload.target.parentId)) {
        const id = referenceMap[draft.payload.target.parentId]
        if (id) {
          draft.payload.target.parentId = id
        }
      }
    }

    if ("nodeId" in draft.payload && isReferenceId(draft.payload.nodeId)) {
      const id = referenceMap[draft.payload.nodeId]

      if (id) {
        draft.payload.nodeId = id
      }
    }

    return draft
  })
}

function isReferenceId(id: string): id is ReferenceId {
  if (id.startsWith("$")) {
    return true
  }
  return false
}

/**
 * Type guard to safely extract nodeId from action payload
 */
function getNodeIdFromAction(action: AIAction): string | undefined {
  if ("nodeId" in action.payload) {
    return action.payload.nodeId
  }
  return undefined
}

/**
 * Type guard to safely extract target parentId from action payload
 */
function getTargetParentIdFromAction(action: AIAction): string | undefined {
  if (
    "target" in action.payload &&
    action.payload.target &&
    "parentId" in action.payload.target
  ) {
    return action.payload.target.parentId
  }
  return undefined
}

/**
 * Type guard to safely extract ref from action payload
 */
function getRefFromAction(action: AIAction): ReferenceId | undefined {
  if ("ref" in action.payload) {
    return action.payload.ref
  }
  return undefined
}

/**
 * Check if an action creates a new node that needs reference mapping
 */
function actionCreatesNewNode(action: AIAction): boolean {
  switch (action.type) {
    case "ai_insert_node":
    case "ai_duplicate_node":
    case "ai_add_variant":
    case "ai_add_component":
      return true
    default:
      return false
  }
}

// Filter a list of actions to just ai actions (this is a typegaurd)
function filterAiActions(actions: Action[]): AIAction[] {
  return actions.filter((action) => action.type.startsWith("ai_")) as AIAction[]
}
