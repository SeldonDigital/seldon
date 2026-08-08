/**
 * The normalized property-row model the inspector renders, plus the small pure
 * accessors that read a subject's identity and a compound parent's child rows.
 *
 * This is the shared contract imported across both editors. Keeping it free of
 * the flatten implementation lets consumers import the type without pulling the
 * inspector's compute dependency graph.
 */
import { childPathsUnderCompoundParent } from "@seldon/editor/lib/properties/property-paths"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"

import type { Board, Instance, ValueType, Variant } from "@seldon/core"
import type { ControlType } from "@seldon/editor/lib/icons/icons-registry"
import type { PropertyType } from "@seldon/editor/lib/properties/property-types"

export type PropertyStatus = "set" | "unset" | "override" | "not used" | "error"

export interface FlatProperty {
  key: string
  propertyType: PropertyType
  label: string
  icon: string
  value: unknown
  actualValue: string
  valueType: ValueType
  isCompound: boolean
  isShorthand: boolean
  isSubProperty: boolean
  status: PropertyStatus
  controlType?: ControlType
  /** Render the value cell as a multi-line textarea instead of a single-line field. */
  multiline?: boolean
  /**
   * Allowed unit suffixes for a measured theme value, resolved from the core
   * token schema. Present only on theme rows that declare a unit; absent on node
   * properties, which resolve units through the property schema instead.
   */
  units?: string[]
  /** Theme look parent row: groups facet sub-rows under a disclosure arrow only. */
  isLookParent?: boolean
  pickerVariant?: "themeAssignment"
  isDimmed?: boolean
  /** Theme color-point rows set this for swatch icon preview in the properties tree. */
  iconColorValue?: string
  /** Menu/combo options supplied directly, for rows not backed by the property schema. */
  options?: Array<{ name: string; value: string }>
  /** When set, the value cell renders as a link to this URL (read-only rows). */
  linkHref?: string
  /**
   * Paint-layer slot for a layered paint parent row (`background`/`gradient`/
   * `shadow`). Lets the picker and commit target the right layer while leaving
   * the others intact. Absent on non-layered and facet rows.
   */
  layerIndex?: number
}

export function getPropertiesSubjectId(node: Variant | Instance | Board): string {
  if (isBoard(node)) return getComponentKey(node)

  return node.id
}

/** The sub-property rows a compound or shorthand parent row recurses into. */
export function getCompoundChildRows(
  parentKey: string,
  allProperties: FlatProperty[],
): FlatProperty[] {
  return allProperties.filter(
    (candidate) =>
      candidate.isSubProperty && childPathsUnderCompoundParent(parentKey, candidate.key),
  )
}
