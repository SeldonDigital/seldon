/**
 * Properties Data
 *
 * Orchestrates the node-inspector property tree. It reads a subject's effective
 * properties and status, then emits `FlatProperty` rows for every inspector
 * root key: layered paint expands per layer, compounds and shorthands expand
 * into facet children, and shown border sides render right after `border`.
 *
 * Value formatting, status, preset matching, and schema lookups delegate to
 * core. Row shape and UI metadata come from the factory and the per-concern
 * row builders in this folder.
 *
 * This file also re-exports the shared `FlatProperty` model and its accessors,
 * so existing consumers keep a single import path.
 */
import type {
  Board,
  BorderSideKey,
  Instance,
  Properties,
  Theme,
  Variant,
  Workspace,
} from "@seldon/core"
import {
  getEffectiveProperties as coreGetEffectiveProperties,
  getPropertyStatus as coreGetPropertyStatus,
} from "@seldon/core/helpers/properties/properties-bridge"
import { EMPTY_VALUE } from "@seldon/core/properties"
import { getInspectorRootPropertyKeys } from "@seldon/core/properties/schemas/helpers"
import { isLayeredPaintProperty } from "@seldon/core/properties/types/property-keys"
import type {
  PropertyKey as CorePropertyKey,
  LayeredPaintKey,
} from "@seldon/core/properties/types/property-keys"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { isPlaygroundBoard } from "@seldon/core/workspace/model/components"
import type { NodeState } from "@seldon/core/workspace/model/node-state"
import { flattenShownBorderSides } from "./border-side-rows"
import { getPropertiesSubjectId } from "./flat-property"
import type { FlatProperty, PropertyStatus } from "./flat-property"
import {
  createFlatProperty,
  getShorthandSubProperties,
  getSubProperties,
} from "./flat-property-factory"
import { flattenLayeredPaintProperty } from "./layered-paint-rows"
import { resolveMatchSiblingLock } from "./match-color-lock"
import {
  getSchemaPropertyKeysForSubject,
  resolvePropertyValueForDisplay,
} from "./properties-read"

export type { FlatProperty, PropertyStatus } from "./flat-property"
export { getCompoundChildRows, getPropertiesSubjectId } from "./flat-property"
export { getAllowedBorderSides } from "./border-side-rows"

/**
 * Gets node properties with status information
 * @param node - The node to get properties for
 * @param workspace - Current workspace
 * @returns Object containing properties and property status
 */
export function getNodePropertiesWithStatus(
  node: Variant | Instance | Board,
  workspace: Workspace,
  state?: NodeState,
): { properties: Properties; propertyStatus: Record<string, PropertyStatus> } {
  const subjectId = getPropertiesSubjectId(node)
  const properties = coreGetEffectiveProperties(subjectId, workspace, state)
  const propertyStatus = coreGetPropertyStatus(
    subjectId,
    workspace,
    state,
  ) as Record<string, PropertyStatus>

  return { properties, propertyStatus }
}

export function flattenNodeProperties(
  node: Variant | Instance | Board,
  workspace: Workspace,
  theme?: Theme,
  shownBorderSides: Set<BorderSideKey> = new Set(),
  state?: NodeState,
): FlatProperty[] {
  // A playground container is a sidebar-only grouping with no editable component
  // properties. Only the theme selector applies, and that row is added
  // separately, so emit no property rows here.
  if (isBoard(node) && isPlaygroundBoard(node)) {
    return []
  }

  const properties: FlatProperty[] = []
  const { properties: mergedProperties, propertyStatus } =
    getNodePropertiesWithStatus(node, workspace, state)

  const schemaPropertyKeys = getSchemaPropertyKeysForSubject(node, workspace)

  // Iterate the full catalog of top-level inspector rows. Keys not on the subject's
  // schema get status "not used" and are filtered out unless unused rows are shown.
  const allPropertyKeys = getInspectorRootPropertyKeys()

  for (const propertyKey of allPropertyKeys) {
    // Layered paint keys in the subject schema render one row per layer. Index 0
    // is the bottom layer; rows are emitted highest index first.
    if (
      isLayeredPaintProperty(propertyKey as CorePropertyKey) &&
      schemaPropertyKeys.includes(propertyKey)
    ) {
      properties.push(
        ...flattenLayeredPaintProperty(
          propertyKey as LayeredPaintKey,
          mergedProperties,
          propertyStatus,
          node,
          workspace,
          theme,
          state,
        ),
      )
      continue
    }

    const propertyValue = resolvePropertyValueForDisplay(
      mergedProperties,
      propertyKey,
    )
    // If property is not in schema, it should have status "not used"
    // Otherwise use the status from propertyStatus
    const isInSchema = schemaPropertyKeys.includes(propertyKey)
    const status = isInSchema
      ? propertyStatus[propertyKey] || "unset"
      : "not used"
    const finalPropertyValue = propertyValue || EMPTY_VALUE

    // Lock a top-level `brightness`/`opacity` whose sibling `color` is Match Color,
    // the same rule used for compound and layer facets.
    const matchLock = resolveMatchSiblingLock(
      propertyKey,
      propertyKey,
      mergedProperties,
      node,
      workspace,
      theme,
    )

    const flatProperty = createFlatProperty(
      propertyKey,
      finalPropertyValue,
      status,
      node,
      workspace,
      theme,
      state,
      matchLock,
    )

    properties.push(flatProperty)

    if (flatProperty.isCompound) {
      const subProperties = getSubProperties(
        propertyKey,
        finalPropertyValue,
        workspace,
        node,
        propertyStatus,
        theme,
        mergedProperties,
      )
      properties.push(...subProperties)

      // Shown border sides render as their own compound rows right after the
      // `border` row. Visibility is editor UI state, gated by the schema.
      if (propertyKey === "border") {
        properties.push(
          ...flattenShownBorderSides(
            node,
            workspace,
            mergedProperties,
            propertyStatus,
            shownBorderSides,
            theme,
            state,
          ),
        )
      }
    } else if (flatProperty.isShorthand) {
      const subProperties = getShorthandSubProperties(
        propertyKey,
        workspace,
        node,
        propertyStatus,
        mergedProperties,
        theme,
      )
      properties.push(...subProperties)
    }
  }

  return properties
}
