import { getComponentSchema } from "../../../components/catalog"
import { isComponentId } from "../../../components/constants"
import { mergeProperties } from "../../../properties/helpers/merge-properties"
import { isLayeredPaintProperty } from "../../../properties/types/property-keys"
import {
  getEffectiveNodeProperties,
  getInheritedNodeProperties,
} from "../../compute/compute-node-properties"
import { DEFAULT_THEME_ID } from "../../constants"
import { getBoardThemeRef } from "../../helpers/components/get-board-theme-ref"
import { getComponentPropertyDefaults } from "../../helpers/components/get-component-property-defaults"
import { getWorkspaceNodes } from "../../helpers/general/get-workspace-nodes"
import { getNodeCatalogId } from "../../helpers/nodes/get-node-catalog-id"
import { getNodeSubtreeIds } from "../../helpers/nodes/get-node-subtree-ids"
import {
  cleanupRedundantOverrides,
  stripPatchFacets,
} from "../../helpers/nodes/cleanup-redundant-overrides"
import {
  getBaselineLayerCount,
  resolveNodePropertyResetPatch,
} from "../../helpers/nodes/resolve-node-property-reset"
import { isEntryNodeForRules } from "../../helpers/rules/rules-node-subject"
import { nodeRetrievalService } from "../nodes/node-retrieval.service"
import { mutateWorkspace } from "../shared/workspace-mutation.helper"
import { withBoardMutation, withNodeMutation } from "../shared/workspace-operation-helpers"
import { setComponentTheme } from "./theme-mutations"

import type { ComponentId } from "../../../components/constants"
import type { Properties, PropertyKey, SubPropertyKey } from "../../../properties"
import type { LayeredPaintKey } from "../../../properties/types/property-keys"
import type { BoardKey, EntryNode, InstanceId, NodeState, VariantId, Workspace } from "../../types"

/** Property, optional sub-facet, and paint-layer slot to reset. `layerIndex` defaults to layer 0. */
interface PropertyResetTarget {
  propertyKey: PropertyKey
  subpropertyKey?: SubPropertyKey
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
    cleanupRedundantOverrides(
      node.overrides,
      properties,
      getInheritedNodeProperties(node.id, workspace),
    )
  })
}

/**
 * Pastes a copied effective look onto a node, keeping only the properties the
 * node's schema exposes. Non-layered keys adopt the pasted value wholesale and
 * then drop facets equal to the node's inherited baseline. Layered paint keys
 * (`background`, `shadow`) adopt the pasted concrete stack exactly: the array
 * is written straight into overrides so the count, order, and per-layer kind
 * match the source and extra target layers drop. Cleanup is skipped for layered
 * keys so a shorter adopted stack is not re-expanded back to the baseline.
 */
export function pasteNodeProperties(
  nodeId: VariantId | InstanceId,
  properties: Properties,
  workspace: Workspace,
): Workspace {
  return withNodeMutation(nodeId, workspace, (node) => {
    if (!isEntryNodeForRules(node)) return

    const catalogId = getNodeCatalogId(node, workspace)

    if (!catalogId || !isComponentId(catalogId)) return

    const allowedKeys = new Set(Object.keys(getComponentSchema(catalogId).properties))
    const filtered = filterPropertiesToAllowedKeys(properties, allowedKeys)

    const layered: Record<string, unknown> = {}
    const rest: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(filtered)) {
      if (isLayeredPaintProperty(key as PropertyKey)) {
        layered[key] = value
      } else {
        rest[key] = value
      }
    }

    if (Object.keys(rest).length > 0) {
      node.overrides = mergeProperties(node.overrides, rest, {
        mergeSubProperties: false,
      })
      cleanupRedundantOverrides(node.overrides, rest, getInheritedNodeProperties(node.id, workspace))
    }

    for (const [key, value] of Object.entries(layered)) {
      ;(node.overrides as Record<string, unknown>)[key] = value
    }
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
    // in play, so a facet the preset would re-derive is not cleaned up just
    // because it equals the Normal value. The state bag stays registered even when
    // empty, matching a bare state write.
    states[state] = stripPatchFacets(mergedBag, properties)
    const baseline = getEffectiveNodeProperties(node.id, draft, { state })

    states[state] = mergedBag
    cleanupRedundantOverrides(states[state], properties, baseline)
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
    board.componentProperties = mergeProperties(board.componentProperties, properties, {
      mergeSubProperties: true,
    })
  })
}

/**
 * Copies a source board's component properties and theme onto every other
 * component board. Each target only receives property keys it exposes, so the
 * merge stays valid for boards whose schemas differ from the source. The theme
 * applies through the same path as `set_component_theme`, so variants that
 * inherit the board theme keep valid token references.
 */
export function applyComponentPropertiesToAllBoards(
  sourceBoardKey: BoardKey,
  workspace: Workspace,
): Workspace {
  const source = workspace.boards[sourceBoardKey]

  if (!source || source.type !== "component") return workspace

  const sourceProperties = source.componentProperties
  const sharedDefaultKeys = Object.keys(getComponentPropertyDefaults())

  let result = workspace

  if (sourceProperties && Object.keys(sourceProperties).length > 0) {
    result = mutateWorkspace(workspace, (draft) => {
      for (const [boardKey, board] of Object.entries(draft.boards)) {
        if (boardKey === sourceBoardKey || board.type !== "component") continue

        const allowedKeys = new Set([
          ...Object.keys(getComponentSchema(boardKey as ComponentId).properties),
          ...sharedDefaultKeys,
        ])
        const filtered = filterPropertiesToAllowedKeys(sourceProperties, allowedKeys)

        if (Object.keys(filtered).length === 0) continue

        board.componentProperties = mergeProperties(board.componentProperties, filtered, {
          mergeSubProperties: true,
        })
      }
    })
  }

  const sourceTheme = getBoardThemeRef(source) ?? DEFAULT_THEME_ID

  for (const [boardKey, board] of Object.entries(result.boards)) {
    if (boardKey === sourceBoardKey || board.type !== "component") continue
    const targetTheme = getBoardThemeRef(board) ?? DEFAULT_THEME_ID

    if (targetTheme === sourceTheme) continue
    result = setComponentTheme(boardKey as BoardKey, sourceTheme, result)
  }

  return result
}

/**
 * Resets a component board to its defaults: clears every component property
 * override and returns the board theme to the workspace default, remapping
 * tokens on variants that inherit the board theme.
 */
export function resetComponentBoard(boardKey: BoardKey, workspace: Workspace): Workspace {
  const board = workspace.boards[boardKey]

  if (!board || board.type !== "component") return workspace

  const result = mutateWorkspace(workspace, (draft) => {
    const draftBoard = draft.boards[boardKey]

    if (!draftBoard || draftBoard.type !== "component") return
    draftBoard.componentProperties = {}
  })

  const currentTheme = getBoardThemeRef(board) ?? DEFAULT_THEME_ID

  if (currentTheme === DEFAULT_THEME_ID) return result

  return setComponentTheme(boardKey, DEFAULT_THEME_ID, result)
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
        deleteSubProperty(board.componentProperties, propertyKey, subpropertyKey, layerIndex)
      } else if (isLayerSlotReset(propertyKey, layerIndex)) {
        resetLayerSlot(board.componentProperties, propertyKey, layerIndex!)
      } else {
        delete board.componentProperties[propertyKey]
      }

      return
    }

    const node = nodeRetrievalService.getNode(objectId as VariantId | InstanceId, draft)

    if (!isEntryNodeForRules(node)) return

    if (!subpropertyKey && isLayerSlotReset(propertyKey, layerIndex)) {
      resetNodeLayer(node, draft, propertyKey as LayeredPaintKey, layerIndex!)

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
      // A whole-property reset replaces the property outright so no owned facet
      // lingers under the restored baseline. This covers layered paint stacks
      // and compound or shorthand bags alike. A single-facet reset merges by
      // facet so sibling facets stay in place.
      if (!subpropertyKey) {
        ;(node.overrides as Record<string, unknown>)[propertyKey] = patch.properties[propertyKey]

        return
      }

      node.overrides = mergeProperties(node.overrides, patch.properties, {
        mergeSubProperties: true,
      })
    }
  })
}

function toLayerBags(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value as Record<string, unknown>[]

  if (value && typeof value === "object") {
    return [value as Record<string, unknown>]
  }

  return []
}

function cloneLayer(slot: unknown): Record<string, unknown> {
  return slot && typeof slot === "object" && !Array.isArray(slot)
    ? { ...(slot as Record<string, unknown>) }
    : {}
}

function isEmptyLayer(layer: unknown): boolean {
  return (
    !layer ||
    (typeof layer === "object" && Object.keys(layer as Record<string, unknown>).length === 0)
  )
}

/** Serializes with sorted object keys so key order never affects equality. */
function stableLayers(layers: Record<string, unknown>[]): string {
  return JSON.stringify(layers, (_key, val) => {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const record = val as Record<string, unknown>

      return Object.keys(record)
        .sort()
        .reduce<Record<string, unknown>>((sorted, key) => {
          sorted[key] = record[key]

          return sorted
        }, {})
    }

    return val
  })
}

/**
 * Resets one upper paint layer. A layer beyond the baseline count was added by
 * the node, so it is removed from the owned stack. A layer within the baseline
 * is reverted to an empty bag so it inherits the aligned baseline slot again.
 * When the resulting stack matches the inherited stack, the whole override is
 * dropped so the node fully inherits again.
 */
function resetNodeLayer(
  node: EntryNode,
  workspace: Workspace,
  propertyKey: LayeredPaintKey,
  layerIndex: number,
): void {
  const baselineCount = getBaselineLayerCount(node, workspace, propertyKey)
  const inherited = toLayerBags(getInheritedNodeProperties(node.id, workspace)[propertyKey])

  let layers: Record<string, unknown>[]

  if (layerIndex >= baselineCount) {
    layers = toLayerBags(getEffectiveNodeProperties(node.id, workspace)[propertyKey]).map(
      cloneLayer,
    )
    if (layerIndex >= layers.length) return
    layers.splice(layerIndex, 1)
  } else {
    const own = toLayerBags((node.overrides as Record<string, unknown>)[propertyKey])

    if (layerIndex >= own.length) return
    layers = own.map((slot, index) => (index === layerIndex ? {} : cloneLayer(slot)))
  }

  const overrides = node.overrides as Record<string, unknown>

  if (layers.every(isEmptyLayer) || stableLayers(layers) === stableLayers(inherited)) {
    delete overrides[propertyKey]

    return
  }

  overrides[propertyKey] = layers
}

/**
 * Resetting a whole upper paint layer (index >= 1) clears that one slot rather
 * than deleting the entire property. Layer 0 and non-layered compounds fall back
 * to the regular whole-property reset.
 */
function isLayerSlotReset(propertyKey: PropertyKey, layerIndex: number | undefined): boolean {
  return layerIndex != null && layerIndex > 0 && isLayeredPaintProperty(propertyKey)
}

/**
 * Clears one paint-layer slot back to an empty bag so inherited/baseline values
 * show through again. The array length is preserved, so the layer stays present
 * and sibling layers are untouched.
 */
function resetLayerSlot(bag: Properties, propertyKey: PropertyKey, layerIndex: number): void {
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
  } else if (overrideBag && typeof overrideBag === "object" && !Array.isArray(overrideBag)) {
    delete (overrideBag as Record<string, unknown>)[subpropertyKey]
  }
}
