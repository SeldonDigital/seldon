import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import { Properties, PropertyKey, SubPropertyKey } from "../../../properties"
import { mergeProperties } from "../../../properties/helpers/merge-properties"
import { isLayeredPaintProperty } from "../../../properties/types/property-keys"
import {
  getEffectiveNodeProperties,
  getInheritedNodeProperties,
} from "../../compute/compute-node-properties"
import { getComponentPropertyDefaults } from "../../helpers/components/get-component-property-defaults"
import { getWorkspaceNodes } from "../../helpers/general/get-workspace-nodes"
import { getNodeSubtreeIds } from "../../helpers/nodes/get-node-subtree-ids"
import {
  pruneRedundantOverrides,
  stripPatchFacets,
} from "../../helpers/nodes/prune-redundant-overrides"
import { resolveNodePropertyResetPatch } from "../../helpers/nodes/resolve-node-property-reset"
import { isEntryNodeForRules } from "../../helpers/rules/rules-node-subject"
import {
  BoardKey,
  InstanceId,
  NodeState,
  VariantId,
  Workspace,
} from "../../types"
import { nodeRetrievalService } from "../nodes/node-retrieval.service"
import { mutateWorkspace } from "../shared/workspace-mutation.helper"
import {
  withBoardMutation,
  withNodeMutation,
} from "../shared/workspace-operation-helpers"

interface PropertyResetTarget {
  propertyKey: PropertyKey
  subpropertyKey?: SubPropertyKey
  /** Paint-layer slot for layered properties; defaults to layer 0. */
  layerIndex?: number
}

/** Merges properties into a node's overrides. */
export function setNodeProperties(
  nodeId: VariantId | InstanceId,
  properties: Properties,
  workspace: Workspace,
  options?: { mergeSubProperties?: boolean },
): Workspace {
  return withNodeMutation(nodeId, workspace, (node) => {
    if (!isEntryNodeForRules(node)) return
    node.overrides = mergeProperties(node.overrides, properties, options)
    // Drop any written facet that equals the value the node inherits, so setting
    // a property to its catalog or upstream value stays a no-op rather than a
    // stored override that would shadow later changes to that value.
    pruneRedundantOverrides(
      node.overrides,
      properties,
      getInheritedNodeProperties(node.id, workspace),
    )
  })
}

/** Resets one property (or sub-property facet) on a node to its default. */
export function resetNodeProperty(
  nodeId: VariantId | InstanceId,
  target: PropertyResetTarget,
  workspace: Workspace,
): Workspace {
  return resetObjectProperty(nodeId, target, workspace)
}

/** Merges properties into a node's override bag for a given interaction state. */
export function setNodeStateProperties(
  nodeId: VariantId | InstanceId,
  state: NodeState,
  properties: Properties,
  workspace: Workspace,
  options?: { mergeSubProperties?: boolean },
): Workspace {
  return withNodeMutation(nodeId, workspace, (node, draft) => {
    if (!isEntryNodeForRules(node)) return
    const states = node.states ?? {}
    const mergedBag = mergeProperties(states[state] ?? {}, properties, options)
    states[state] = mergedBag
    node.states = states
    // A state override facet carries no delta when it equals the value the state
    // resolves to without that facet, so drop it. The baseline strips only the
    // written facets from the state bag, leaving sibling facets such as a preset
    // in play, so a facet the preset would re-derive is not pruned just because
    // it equals the Normal value. The state bag itself stays registered even when
    // empty, matching a bare state write.
    states[state] = stripPatchFacets(mergedBag, properties)
    const baseline = getEffectiveNodeProperties(node.id, draft, { state })
    states[state] = mergedBag
    pruneRedundantOverrides(states[state], properties, baseline)
  })
}

/**
 * Drops one property (or sub-property facet) from a node's state bag. Removes
 * the state key entirely when its bag becomes empty.
 */
export function resetNodeStateProperty(
  nodeId: VariantId | InstanceId,
  state: NodeState,
  { propertyKey, subpropertyKey, layerIndex }: PropertyResetTarget,
  workspace: Workspace,
): Workspace {
  return withNodeMutation(nodeId, workspace, (node) => {
    if (!isEntryNodeForRules(node)) return
    const bag = node.states?.[state]
    if (!bag) return

    if (subpropertyKey) {
      deleteSubProperty(bag, propertyKey, subpropertyKey, layerIndex)
    } else if (isLayerSlotReset(propertyKey, layerIndex)) {
      resetLayerSlot(bag, propertyKey, layerIndex!)
    } else {
      delete bag[propertyKey]
    }

    if (Object.keys(bag).length === 0) {
      delete node.states![state]
    }
  })
}

/** Clears a node's entire override bag for a given interaction state. */
export function resetNodeState(
  nodeId: VariantId | InstanceId,
  state: NodeState,
  workspace: Workspace,
): Workspace {
  return withNodeMutation(nodeId, workspace, (node) => {
    if (!isEntryNodeForRules(node)) return
    if (node.states) delete node.states[state]
  })
}

/**
 * Clears every override on a node and all descendants in its variant tree,
 * reverting the subtree to its template baseline.
 */
export function resetNodeOverrides(
  nodeId: VariantId | InstanceId,
  workspace: Workspace,
): Workspace {
  const subtreeIds = getNodeSubtreeIds(nodeId, workspace)
  return mutateWorkspace(workspace, (draft) => {
    const nodes = getWorkspaceNodes(draft)
    for (const id of subtreeIds) {
      const node = nodes[id]
      if (node && isEntryNodeForRules(node)) {
        node.overrides = {}
      }
    }
  })
}

/** Merges properties into a board's component properties. */
export function setComponentProperties(
  boardKey: BoardKey,
  properties: Properties,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(boardKey, workspace, (board) => {
    board.componentProperties = mergeProperties(
      board.componentProperties,
      properties,
      { mergeSubProperties: true },
    )
  })
}

/**
 * Copies a source board's component properties onto every other component
 * board. Each target only receives keys it exposes, so the merge stays valid
 * for boards whose schemas differ from the source.
 */
export function applyComponentPropertiesToAllBoards(
  sourceBoardKey: BoardKey,
  workspace: Workspace,
): Workspace {
  const source = workspace.boards[sourceBoardKey]
  if (!source || source.type !== "component") return workspace

  const sourceProperties = source.componentProperties
  if (!sourceProperties || Object.keys(sourceProperties).length === 0) {
    return workspace
  }

  const sharedDefaultKeys = Object.keys(getComponentPropertyDefaults())

  return mutateWorkspace(workspace, (draft) => {
    for (const [boardKey, board] of Object.entries(draft.boards)) {
      if (boardKey === sourceBoardKey || board.type !== "component") continue

      const allowedKeys = new Set([
        ...Object.keys(getComponentSchema(boardKey as ComponentId).properties),
        ...sharedDefaultKeys,
      ])
      const filtered = filterPropertiesToAllowedKeys(
        sourceProperties,
        allowedKeys,
      )
      if (Object.keys(filtered).length === 0) continue

      board.componentProperties = mergeProperties(
        board.componentProperties,
        filtered,
        { mergeSubProperties: true },
      )
    }
  })
}

/** Keeps only the properties whose top-level key is in the allowed set. */
function filterPropertiesToAllowedKeys(
  properties: Properties,
  allowedKeys: ReadonlySet<string>,
): Properties {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(properties)) {
    if (allowedKeys.has(key.split(".")[0])) {
      result[key] = value
    }
  }
  return result as Properties
}

/** Resets one property (or sub-property facet) on a board to its default. */
export function resetComponentProperty(
  boardKey: BoardKey,
  target: PropertyResetTarget,
  workspace: Workspace,
): Workspace {
  return resetObjectProperty(boardKey, target, workspace)
}

/**
 * Resets a property on either a board (by key) or a node (by id). Boards delete
 * the override outright; nodes resolve a reset patch that may delete or restore
 * an inherited value.
 */
function resetObjectProperty(
  objectId: VariantId | InstanceId | BoardKey,
  { propertyKey, subpropertyKey, layerIndex }: PropertyResetTarget,
  workspace: Workspace,
): Workspace {
  return mutateWorkspace(workspace, (draft) => {
    const board = draft.boards[objectId as BoardKey]
    if (board) {
      if (subpropertyKey) {
        deleteSubProperty(
          board.componentProperties,
          propertyKey,
          subpropertyKey,
          layerIndex,
        )
      } else if (isLayerSlotReset(propertyKey, layerIndex)) {
        resetLayerSlot(board.componentProperties, propertyKey, layerIndex!)
      } else {
        delete board.componentProperties[propertyKey]
      }
      return
    }

    const node = nodeRetrievalService.getNode(
      objectId as VariantId | InstanceId,
      draft,
    )
    if (!isEntryNodeForRules(node)) return

    if (!subpropertyKey && isLayerSlotReset(propertyKey, layerIndex)) {
      resetLayerSlot(node.overrides, propertyKey, layerIndex!)
      return
    }

    const patch = resolveNodePropertyResetPatch(
      node,
      draft,
      propertyKey,
      subpropertyKey,
      layerIndex,
    )

    if (patch.action === "delete") {
      delete node.overrides[propertyKey]
      return
    }
    if (patch.action === "delete-sub" && subpropertyKey) {
      deleteSubProperty(node.overrides, propertyKey, subpropertyKey, layerIndex)
      return
    }
    if (patch.action === "set") {
      node.overrides = mergeProperties(node.overrides, patch.properties, {
        mergeSubProperties: true,
      })
    }
  })
}

/**
 * Resetting a whole upper paint layer (index >= 1) clears that one slot rather
 * than deleting the entire property. Layer 0 and non-layered compounds fall back
 * to the regular whole-property reset.
 */
function isLayerSlotReset(
  propertyKey: PropertyKey,
  layerIndex: number | undefined,
): boolean {
  return (
    layerIndex != null && layerIndex > 0 && isLayeredPaintProperty(propertyKey)
  )
}

/**
 * Clears one paint-layer slot back to an empty bag so inherited/baseline values
 * show through again. The array length is preserved, so the layer stays present
 * and sibling layers are untouched.
 */
function resetLayerSlot(
  bag: Properties,
  propertyKey: PropertyKey,
  layerIndex: number,
): void {
  const overrideBag = bag[propertyKey]
  if (Array.isArray(overrideBag) && layerIndex < overrideBag.length) {
    overrideBag[layerIndex] = {}
  }
}

/** Deletes one sub-property facet from a compound or layered-paint property bag. */
function deleteSubProperty(
  bag: Properties,
  propertyKey: PropertyKey,
  subpropertyKey: SubPropertyKey,
  layerIndex: number = 0,
): void {
  const overrideBag = bag[propertyKey]
  if (Array.isArray(overrideBag)) {
    const layer = overrideBag[layerIndex]
    if (layer && typeof layer === "object") {
      delete (layer as Record<string, unknown>)[subpropertyKey]
    }
  } else if (
    overrideBag &&
    typeof overrideBag === "object" &&
    !Array.isArray(overrideBag)
  ) {
    delete (overrideBag as Record<string, unknown>)[subpropertyKey]
  }
}
