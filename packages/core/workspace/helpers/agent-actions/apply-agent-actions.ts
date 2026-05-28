import type { ComponentKey } from "../../types"
import { getComponentVariantRootIds } from "../components/get-component-variant-root-ids"
import { getNodeIdAddedByAction } from "../nodes/get-node-id-added-by-action"
import { workspaceReducer } from "../../reducers/reducer"
import type { WorkspaceAction } from "../../reducers/types"
import type { ReferenceId, Workspace } from "../../types"
import {
  getSchemaAwareReferenceMap,
  type ReferenceMap,
} from "./get-reference-map"
import { normalizeWireActionToWorkspaceAction } from "./normalize-wire-action-to-workspace-action"
import { replaceReferenceIdsInWireAction } from "./replace-reference-ids-in-wire-action"
import type { AgentWireAction } from "./types"

const BOARD_CREATION_WIRE_TYPES = new Set([
  "ai_add_component",
  "ai_add_icon_set_board",
  "ai_add_theme_board",
  "ai_add_assembly_board",
])

const NODE_REF_WIRE_TYPES = new Set([
  "ai_remove_node",
  "ai_set_node_properties",
  "ai_set_node_label",
  "ai_set_node_theme",
  "ai_reset_node_property",
  "ai_move_node",
  "ai_reorder_node",
  "ai_duplicate_node",
  "ai_insert_node",
])

/**
 * Applies a batch of legacy agent wire actions through {@link workspaceReducer}.
 * Maps `ai_*` types to {@link WorkspaceAction}, resolves `$…` reference ids, then folds actions in order.
 */
export function applyAgentActions(
  workspace: Workspace,
  actions: ReadonlyArray<AgentWireAction>,
): Workspace {
  const wireActions = actions.filter((action) => action.type.startsWith("ai_"))
  let referenceMap: ReferenceMap = {}

  return wireActions.reduce((current, baseAction) => {
    const withRefs = replaceReferenceIdsInWireAction(referenceMap, baseAction)

    if (shouldSkipBoardCreation(withRefs, current)) {
      referenceMap = mergeReferenceMapForExistingBoard(withRefs, current, referenceMap)
      return current
    }

    if (isWireActionReferencingMissingNode(withRefs, current)) {
      return current
    }

    const normalized = normalizeWireActionToWorkspaceAction(withRefs)
    if (!normalized) return current

    const next = workspaceReducer(current, normalized)
    referenceMap = mergeReferenceMapAfterAction(
      withRefs,
      normalized,
      next,
      referenceMap,
    )
    return next
  }, workspace)
}

function shouldSkipBoardCreation(action: AgentWireAction, workspace: Workspace): boolean {
  if (!BOARD_CREATION_WIRE_TYPES.has(action.type)) return false
  const componentId = action.payload?.componentId
  if (typeof componentId !== "string") return false
  return Boolean(workspace.components[componentId as ComponentKey])
}

function mergeReferenceMapForExistingBoard(
  action: AgentWireAction,
  workspace: Workspace,
  referenceMap: ReferenceMap,
): ReferenceMap {
  const ref = getRefFromWireAction(action)
  const componentId = action.payload?.componentId
  if (!ref || typeof componentId !== "string") return referenceMap

  const board = workspace.components[componentId as ComponentKey]
  if (!board) return referenceMap

  const rootId = getComponentVariantRootIds(board)[0]
  if (!rootId) return referenceMap

  return { ...referenceMap, ...getSchemaAwareReferenceMap(ref, rootId, workspace) }
}

function isWireActionReferencingMissingNode(
  action: AgentWireAction,
  workspace: Workspace,
): boolean {
  if (!NODE_REF_WIRE_TYPES.has(action.type)) return false

  const nodeId = getNodeIdFromWireAction(action)
  if (nodeId) {
    if (nodeId.startsWith("missing-")) return true
    if (!workspace.nodes[nodeId]) return true
  }

  if (action.type === "ai_move_node" || action.type === "ai_insert_node") {
    const target = action.payload?.target
    if (target && typeof target === "object" && "parentId" in target) {
      const parentId = target.parentId
      if (typeof parentId === "string") {
        if (parentId.startsWith("missing-")) return true
        if (!workspace.nodes[parentId]) return true
      }
    }
  }

  return false
}

function mergeReferenceMapAfterAction(
  wireAction: AgentWireAction,
  normalized: WorkspaceAction,
  workspace: Workspace,
  referenceMap: ReferenceMap,
): ReferenceMap {
  if (!actionCreatesNode(wireAction.type)) return referenceMap

  const addedNodeId = getNodeIdAddedByAction(normalized, workspace)
  const ref = getRefFromWireAction(wireAction)
  if (!ref || addedNodeId === null) return referenceMap

  return {
    ...referenceMap,
    ...getSchemaAwareReferenceMap(ref, addedNodeId, workspace),
  }
}

function actionCreatesNode(wireType: string): boolean {
  switch (wireType) {
    case "ai_insert_node":
    case "ai_duplicate_node":
    case "ai_add_variant":
    case "ai_add_component":
    case "ai_add_icon_set_board":
    case "ai_add_theme_board":
    case "ai_add_assembly_board":
      return true
    default:
      return false
  }
}

function getRefFromWireAction(action: AgentWireAction): ReferenceId | undefined {
  const ref = action.payload?.ref
  return typeof ref === "string" ? ref : undefined
}

function getNodeIdFromWireAction(action: AgentWireAction): string | undefined {
  const nodeId = action.payload?.nodeId
  return typeof nodeId === "string" ? nodeId : undefined
}
