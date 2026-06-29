import { childPathsUnderCompoundParent } from "@lib/properties/property-paths"
import { Board, Instance, Variant } from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { RowPropertyProps } from "../hooks/use-row-property"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { FlatProperty } from "./properties-data"

/** The subject id a row renders against: the board key, or the node id. */
function rowSubjectId(node: Variant | Instance | Board): string {
  return isBoard(node) ? getComponentKey(node) : node.id
}

/** Structural equality for plain JSON-like values (FlatProperty fields). */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  if (a === null || b === null) return a === b
  if (typeof a !== "object") return false

  const arrayA = Array.isArray(a)
  if (arrayA !== Array.isArray(b)) return false
  if (arrayA) {
    const listA = a as unknown[]
    const listB = b as unknown[]
    if (listA.length !== listB.length) return false
    return listA.every((item, index) => deepEqual(item, listB[index]))
  }

  const objA = a as Record<string, unknown>
  const objB = b as Record<string, unknown>
  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)
  if (keysA.length !== keysB.length) return false
  return keysA.every((key) => deepEqual(objA[key], objB[key]))
}

/** The sub-property rows a compound or shorthand parent recurses into. */
function rowChildren(props: RowPropertyProps): FlatProperty[] {
  if (!props.property.isCompound && !props.property.isShorthand) return []
  return props.allProperties.filter(
    (candidate) =>
      candidate.isSubProperty &&
      childPathsUnderCompoundParent(props.property.key, candidate.key),
  )
}

/**
 * `React.memo` comparator for a property row. A row's output is a function of
 * its `FlatProperty` (value, status, formatted display), its compound child
 * rows, the subject, the theme, and the editing contexts. The `workspace` prop
 * gets a new reference on every edit but does not change a row's rendered output
 * unless one of those inputs changed, so it is intentionally excluded. Skipping
 * unchanged rows is what cuts the properties-sidebar re-render storm on each edit
 * and keystroke.
 */
export function arePropertyRowPropsEqual(
  prev: RowPropertyProps,
  next: RowPropertyProps,
): boolean {
  if (prev.theme !== next.theme) return false
  if (prev.themeEditingContext !== next.themeEditingContext) return false
  if (prev.fontCollectionEditingContext !== next.fontCollectionEditingContext) {
    return false
  }
  if (prev.iconSetEditingContext !== next.iconSetEditingContext) return false
  if (rowSubjectId(prev.node) !== rowSubjectId(next.node)) return false
  if (!deepEqual(prev.property, next.property)) return false
  if (prev.property.isCompound || prev.property.isShorthand) {
    if (!deepEqual(rowChildren(prev), rowChildren(next))) return false
  }
  return true
}
