import { getPropertyRegistryEntry } from "@seldon/editor/lib/icons/icons-registry"
import { ValueType } from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"

import type { FlatProperty } from "./properties-data"
import type { Board, Instance, Variant } from "@seldon/core"

/**
 * Synthetic Reference row for the properties sidebar. Reads the node's `ref`
 * field as a free-text value. Boards do not carry a ref.
 *
 * `hasBindings` marks the row compound so the inspector's existing disclosure
 * recurses into the binding sub-rows. The row is not a compound property, but
 * `isCompound` is the gate that reveals child rows, and the synthetic Repeat row
 * uses it the same way. It stays editable: the commit path matches the
 * `reference` key and writes the ref before it reaches any compound branch.
 */
export function buildReferenceProperty(
  node: Variant | Instance | Board,
  hasBindings = false,
): FlatProperty {
  const ref = isBoard(node) ? undefined : node.ref

  return {
    key: "reference",
    propertyType: "atomic",
    label: "Reference",
    icon: getPropertyRegistryEntry("reference")?.icon ?? "seldon-component",
    value: ref ? { type: ValueType.EXACT, value: ref } : { type: ValueType.EMPTY, value: null },
    actualValue: ref ?? "",
    valueType: ref ? ValueType.EXACT : ValueType.EMPTY,
    controlType: "text",
    isCompound: hasBindings,
    isShorthand: false,
    isSubProperty: false,
    status: ref ? "set" : "unset",
  }
}
