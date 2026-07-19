/**
 * Flattens a layered paint property (`background`/`gradient`/`shadow`) into one
 * parent row plus facet children per layer. Rows come out in reverse index
 * order, so the highest index renders at the top and index 0 renders last.
 */
import type { Board, Instance, Properties, Theme, Variant, Workspace } from "@seldon/core"
import { EMPTY_VALUE } from "@seldon/core/properties"
import type { LayeredPaintKey } from "@seldon/core/properties/types/property-keys"
import type { NodeState } from "@seldon/core/workspace/model/node-state"
import { getPropertyRegistryEntry } from "@seldon/editor/lib/icons/icons-registry"
import {
  getCompoundLayerValue,
  layeredParentPath,
} from "@seldon/editor/lib/properties/property-paths"
import { formatPropertyLabel } from "@seldon/editor/lib/properties/shared-utils"
import type { FlatProperty, PropertyStatus } from "./flat-property"
import { createFlatProperty, getSubProperties } from "./flat-property-factory"

/**
 * Emits one parent row plus facet children for every paint layer of a layered
 * property. Rows come out in reverse index order, so the highest index renders
 * at the top and index 0 (the bottom layer) renders last. Labels are positional
 * when more than one layer exists.
 */
export function flattenLayeredPaintProperty(
  propertyKey: LayeredPaintKey,
  mergedProperties: Properties,
  propertyStatus: Record<string, PropertyStatus>,
  node: Variant | Instance | Board,
  workspace: Workspace,
  theme?: Theme,
  state?: NodeState,
): FlatProperty[] {
  const out: FlatProperty[] = []
  const rawArray = mergedProperties[propertyKey as keyof Properties]
  const layerCount = Array.isArray(rawArray)
    ? rawArray.length
    : rawArray
      ? 1
      : 0
  const count = Math.max(layerCount, 1)
  const baseLabel =
    getPropertyRegistryEntry(propertyKey)?.label ||
    formatPropertyLabel(propertyKey)

  for (let i = count - 1; i >= 0; i--) {
    if (i === 0) {
      const layer0 = getCompoundLayerValue(rawArray, 0) || EMPTY_VALUE
      const status = propertyStatus[propertyKey] || "unset"
      const parent = createFlatProperty(
        propertyKey,
        layer0,
        status,
        node,
        workspace,
        theme,
        state,
      )
      parent.layerIndex = 0
      if (count > 1) {
        parent.label = `${baseLabel} 1`
      }
      out.push(parent)
      out.push(
        ...getSubProperties(
          propertyKey,
          layer0,
          workspace,
          node,
          propertyStatus,
          theme,
          mergedProperties,
        ),
      )
    } else {
      // An upper paint layer (index >= 1) mirrors the index-0 compound row: a
      // preset combo plus expandable facet children. Its key and `layerIndex`
      // address the slot so the commit leaves the other layers intact.
      const layerValue = getCompoundLayerValue(rawArray, i) || EMPTY_VALUE
      const parent = createFlatProperty(
        propertyKey,
        layerValue,
        propertyStatus[layeredParentPath(propertyKey, i)] ?? "unset",
        node,
        workspace,
        theme,
        state,
        null,
        i,
      )
      parent.key = layeredParentPath(propertyKey, i)
      parent.label = `${baseLabel} ${i + 1}`
      parent.layerIndex = i
      out.push(parent)
      out.push(
        ...getSubProperties(
          propertyKey,
          EMPTY_VALUE,
          workspace,
          node,
          propertyStatus,
          theme,
          undefined,
          i,
          rawArray,
        ),
      )
    }
  }

  return out
}
