/**
 * Border-side rows. `getAllowedBorderSides` reports the sides a subject's schema
 * exposes; `flattenShownBorderSides` emits a compound row plus facet children
 * for each side the user has shown. Visibility is editor UI state, so nothing is
 * written to the node and the rows read their inherited schema values.
 */
import {
  BORDER_SIDE_KEYS,
  Board,
  BorderSideKey,
  Instance,
  Properties,
  Theme,
  Variant,
  Workspace,
} from "@seldon/core"
import { EMPTY_VALUE } from "@seldon/core/properties"
import type { NodeState } from "@seldon/core/workspace/model/node-state"
import type { FlatProperty, PropertyStatus } from "./flat-property"
import { createFlatProperty, getSubProperties } from "./flat-property-factory"
import {
  getSchemaPropertyKeysForSubject,
  resolvePropertyValueForDisplay,
} from "./properties-read"

/**
 * The border sides this subject's schema exposes. Only these can be shown; the
 * menu dims the rest. Boards resolve through their component defaults.
 */
export function getAllowedBorderSides(
  node: Variant | Instance | Board,
  workspace: Workspace,
): BorderSideKey[] {
  const schemaKeys = new Set(getSchemaPropertyKeysForSubject(node, workspace))
  return BORDER_SIDE_KEYS.filter((side) => schemaKeys.has(side))
}

/**
 * Emits a compound row plus facet children for each border side the user has
 * shown, limited to sides the schema exposes. Rows render right after `border`
 * in the appearance section. Visibility is editor UI state, so nothing is
 * written to the node and the rows read their inherited schema values.
 */
export function flattenShownBorderSides(
  node: Variant | Instance | Board,
  workspace: Workspace,
  mergedProperties: Properties,
  propertyStatus: Record<string, PropertyStatus>,
  shownSides: Set<BorderSideKey>,
  theme?: Theme,
  state?: NodeState,
): FlatProperty[] {
  const allowed = new Set(getAllowedBorderSides(node, workspace))
  const out: FlatProperty[] = []
  for (const side of BORDER_SIDE_KEYS) {
    if (!allowed.has(side) || !shownSides.has(side)) continue
    const value =
      resolvePropertyValueForDisplay(mergedProperties, side) || EMPTY_VALUE
    const status = propertyStatus[side] || "unset"
    out.push(
      createFlatProperty(side, value, status, node, workspace, theme, state),
    )
    out.push(
      ...getSubProperties(
        side,
        value,
        workspace,
        node,
        propertyStatus,
        theme,
        mergedProperties,
      ),
    )
  }
  return out
}
