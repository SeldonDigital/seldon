import { getPropertyRegistryEntry } from "@lib/icons/icons-registry"
import { Board, Instance, ValueType, Variant } from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { FlatProperty } from "./properties-data"

/**
 * Synthetic Reference row for the properties sidebar. Reads the node's `ref`
 * field as a free-text value. Boards do not carry a ref.
 */
export function buildReferenceProperty(
  node: Variant | Instance | Board,
): FlatProperty {
  const ref = isBoard(node) ? undefined : node.ref

  return {
    key: "reference",
    propertyType: "atomic",
    label: "Reference",
    icon: getPropertyRegistryEntry("reference")?.icon ?? "seldon-component",
    value: ref
      ? { type: ValueType.EXACT, value: ref }
      : { type: ValueType.EMPTY, value: null },
    actualValue: ref ?? "",
    valueType: ref ? ValueType.EXACT : ValueType.EMPTY,
    controlType: "text",
    isCompound: false,
    isShorthand: false,
    isSubProperty: false,
    status: ref ? "set" : "unset",
  }
}
