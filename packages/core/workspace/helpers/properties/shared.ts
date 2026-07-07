import { Properties, type PropertyKey, ValueType } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId, isComponentId } from "@seldon/core/components/constants"
import { isCompoundProperty } from "@seldon/core/helpers/type-guards/compound/is-compound-property"
import { COMPOUND_FACET_DISPLAY_ORDER } from "@seldon/core/properties/constants"
import { getPropertyCategory } from "@seldon/core/properties/schemas"
import {
  type PropertyKey as CorePropertyKey,
  isLayeredPaintProperty,
} from "@seldon/core/properties/types/property-keys"
import {
  BACKGROUND_KIND_VALUES,
  BackgroundKind,
} from "@seldon/core/properties/values/appearance/background/background-kind"
import {
  type WorkspacePropertySource,
  getEffectiveNodeProperties,
} from "@seldon/core/workspace/compute"
import { getComponentPropertyDefaults } from "@seldon/core/workspace/helpers/components/get-component-property-defaults"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { getNodeById } from "@seldon/core/workspace/helpers/nodes/get-node-by-id"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import {
  NORMAL_STATE,
  type NodeState,
} from "@seldon/core/workspace/model/node-state"
import type { Board, EntryNode, Workspace } from "@seldon/core/workspace/types"

type TypedPropertyValue = {
  type: unknown
  value: unknown
}

export type PropertyPanelSubject = Board | EntryNode

const LAYERED_PAINT_LAYER_INDEX = 0

function isTypedPropertyValue(value: unknown): value is TypedPropertyValue {
  return !!(
    value &&
    typeof value === "object" &&
    "type" in value &&
    "value" in value
  )
}

function storedValueMatches(
  currentValue: unknown,
  expectedValue: unknown,
): boolean {
  if (isTypedPropertyValue(expectedValue)) {
    return storedValueMatches(currentValue, expectedValue.value)
  }
  if (typeof expectedValue === "string" && expectedValue.startsWith("@")) {
    return currentValue === expectedValue
  }
  if (expectedValue && typeof expectedValue === "object") {
    return JSON.stringify(currentValue) === JSON.stringify(expectedValue)
  }
  return currentValue === expectedValue
}

export function propertyValuesMatch(
  currentValue: unknown,
  expectedValue: unknown,
): boolean {
  if (!isTypedPropertyValue(currentValue)) {
    return isValueEmpty(expectedValue)
  }
  return storedValueMatches(currentValue.value, expectedValue)
}

export function compoundFacetMatches(
  parentLayer: Record<string, unknown>,
  subKey: string,
  expectedValue: unknown,
): boolean {
  return propertyValuesMatch(parentLayer[subKey], expectedValue)
}

export function compoundSubPropertyPath(
  propertyKey: string,
  subKey: string,
  layerIndex: number = LAYERED_PAINT_LAYER_INDEX,
): string {
  if (isLayeredPaintProperty(propertyKey as CorePropertyKey)) {
    return `${propertyKey}.${layerIndex}.${subKey}`
  }
  return `${propertyKey}.${subKey}`
}

/** Parent row key for a paint layer: bare root for index 0, `root.index` above it. */
export function layeredParentPropertyPath(
  propertyKey: string,
  layerIndex: number,
): string {
  return layerIndex === 0 ? propertyKey : `${propertyKey}.${layerIndex}`
}

export function getCompoundLayerValue(
  value: unknown,
  layerIndex: number = LAYERED_PAINT_LAYER_INDEX,
): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null
  if (Array.isArray(value)) {
    const layer = value[layerIndex]
    if (!layer || typeof layer !== "object" || Array.isArray(layer)) {
      return null
    }
    return layer as Record<string, unknown>
  }
  return value as Record<string, unknown>
}

/** Number of paint layers carried by a layered paint value, 0 when absent. */
export function getLayeredPaintLayerCount(value: unknown): number {
  if (Array.isArray(value)) return value.length
  if (value && typeof value === "object") return 1
  return 0
}

export function wrapCompoundPropertyValue(
  propertyKey: string,
  facets: Record<string, unknown>,
): Properties {
  if (isLayeredPaintProperty(propertyKey as CorePropertyKey)) {
    return { [propertyKey]: [facets] } as Properties
  }
  return { [propertyKey]: facets } as Properties
}

export function getPropertyOverridesBag(
  subject: PropertyPanelSubject,
  state?: NodeState,
): Properties | undefined {
  if (isBoard(subject)) {
    return subject.componentProperties
  }
  // In a non-Normal state, the authored overrides live in the state bag. The
  // Normal layer keeps using `overrides`.
  if (state && state !== NORMAL_STATE) {
    return subject.states?.[state]
  }
  return subject.overrides
}

function resolveComponentId(
  subject: PropertyPanelSubject,
  workspace: Workspace,
): ComponentId | undefined {
  if (isBoard(subject)) {
    if (subject.type === "component" && isComponentId(subject.catalogId)) {
      return subject.catalogId
    }
    return undefined
  }
  const catalogId = getNodeCatalogId(subject, workspace)
  if (catalogId && isComponentId(catalogId)) {
    return catalogId
  }
  return undefined
}

export function getTypedNode(
  nodeId: string,
  workspace: Workspace,
): PropertyPanelSubject {
  const catalogRow = workspace.boards[nodeId] ?? workspace.playgrounds?.[nodeId]
  if (catalogRow) {
    return catalogRow
  }
  return getNodeById(nodeId, workspace)
}

export function isValueEmpty(value: unknown): boolean {
  return (
    !value ||
    (typeof value === "object" &&
      value !== null &&
      "type" in value &&
      value.type === ValueType.EMPTY)
  )
}

export function isValueSet(value: unknown): boolean {
  return (
    !!value &&
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type !== ValueType.EMPTY
  )
}

export function hasSchemaSubProperty(
  schemaProperties: Properties,
  key: string,
  subKey: string,
): boolean {
  const layer = getCompoundLayerValue(
    (schemaProperties as Record<string, unknown> | null)?.[key],
  )
  return !!(layer && subKey in layer)
}

export function getEffectiveProperties(
  nodeId: string,
  workspace: Workspace,
  state?: NodeState,
): Properties {
  return getEffectiveNodeProperties(
    nodeId,
    workspace as WorkspacePropertySource,
    { state },
  )
}

export function getSchemaProperties(
  node: PropertyPanelSubject,
  workspace?: Workspace,
): Properties | null {
  if (isBoard(node)) {
    return getComponentPropertyDefaults()
  }

  if (!workspace?.nodes) return null

  const componentId = resolveComponentId(node, workspace)
  if (!componentId) return null
  const schema = getComponentSchema(componentId)
  if (!schema) return null
  return schema.properties
}

export function isShorthandProperty(propertyKey: string): boolean {
  return getPropertyCategory(propertyKey) === "shorthand"
}

function getSubPropertyKeysFromObject(propertyValue: unknown): string[] {
  const layer = getCompoundLayerValue(propertyValue)
  if (!layer) return []
  return Object.keys(layer)
}

export function getSubPropertyKeysFromSchema(
  propertyKey: string,
  node: PropertyPanelSubject,
  workspace: Workspace,
): string[] {
  const schemaProps = getSchemaProperties(node, workspace)
  const schemaProp = (schemaProps as Record<string, unknown> | null)?.[
    propertyKey
  ]
  const layer = getCompoundLayerValue(schemaProp)
  return layer ? Object.keys(layer) : []
}

/**
 * Orders facet keys by `COMPOUND_FACET_DISPLAY_ORDER` for the parent compound.
 * Listed facets come first in their declared order. Facets without an entry keep
 * their incoming relative order after the listed ones.
 */
function orderCompoundFacetKeys(propertyKey: string, keys: string[]): string[] {
  const order = COMPOUND_FACET_DISPLAY_ORDER[propertyKey]
  if (!order) return keys
  const rank = new Map(order.map((facet, index) => [facet, index]))
  return [...keys].sort((a, b) => {
    const rankA = rank.get(a) ?? order.length
    const rankB = rank.get(b) ?? order.length
    if (rankA !== rankB) return rankA - rankB
    return keys.indexOf(a) - keys.indexOf(b)
  })
}

/** Facet keys exposed by a background layer for each kind. `kind` stays first. */
const BACKGROUND_FACETS_BY_KIND: Record<BackgroundKind, readonly string[]> = {
  [BackgroundKind.NONE]: ["kind"],
  [BackgroundKind.COLOR]: ["kind", "color", "brightness", "opacity"],
  [BackgroundKind.IMAGE]: [
    "kind",
    "image",
    "blendMode",
    "opacity",
    "position",
    "size",
    "repeat",
    "filter",
  ],
  [BackgroundKind.LINEAR_GRADIENT]: [
    "kind",
    "preset",
    "angle",
    "startPosition",
    "startColor",
    "startBrightness",
    "startOpacity",
    "endPosition",
    "endColor",
    "endBrightness",
    "endOpacity",
  ],
  [BackgroundKind.RADIAL_GRADIENT]: [
    "kind",
    "preset",
    "positionX",
    "positionY",
    "shape",
    "radialSize",
    "startPosition",
    "startColor",
    "startBrightness",
    "startOpacity",
    "endPosition",
    "endColor",
    "endBrightness",
    "endOpacity",
  ],
  [BackgroundKind.CONIC_GRADIENT]: [
    "kind",
    "preset",
    "angle",
    "conicRepeat",
    "startPosition",
    "startColor",
    "startBrightness",
    "startOpacity",
    "endPosition",
    "endColor",
    "endBrightness",
    "endOpacity",
  ],
}

/** Reads the `kind` option from a background layer value, when present. */
function readBackgroundKind(
  propertyValue: unknown,
): BackgroundKind | undefined {
  const layer = getCompoundLayerValue(propertyValue)
  const kindCell = layer?.["kind"] as
    | { type?: unknown; value?: unknown }
    | undefined
  if (
    kindCell &&
    kindCell.type === ValueType.OPTION &&
    typeof kindCell.value === "string" &&
    (BACKGROUND_KIND_VALUES as string[]).includes(kindCell.value)
  ) {
    return kindCell.value as BackgroundKind
  }
  return undefined
}

/**
 * Facets a background layer exposes for its kind. An unset kind shows only the
 * `kind` selector, so a Default background renders no facet rows.
 */
export function getBackgroundFacetsForKind(
  kind: BackgroundKind | undefined,
): string[] {
  return [...(kind ? BACKGROUND_FACETS_BY_KIND[kind] : ["kind"])]
}

export function getCompoundPropertyStructure(
  propertyKey: string,
  propertyValue: unknown,
  node: PropertyPanelSubject,
  workspace: Workspace,
): string[] {
  if (propertyKey === "background") {
    return getBackgroundFacetsForKind(readBackgroundKind(propertyValue))
  }

  const actualKeys = getSubPropertyKeysFromObject(propertyValue)
  const schemaKeys = getSubPropertyKeysFromSchema(propertyKey, node, workspace)
  if (isCompoundProperty(propertyKey as PropertyKey)) {
    const merged = [...new Set([...actualKeys, ...schemaKeys])]
    return orderCompoundFacetKeys(propertyKey, merged)
  }
  return schemaKeys
}
