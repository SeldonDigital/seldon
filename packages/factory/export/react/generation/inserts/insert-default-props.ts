import { TransformStrategy, transformSource } from "../../utils/transform-source"
import { generateDefaultProps } from "../shared/generate-default-props"
import { getSubtreeBoundaryPropNames } from "../shared/get-subtree-boundaries"

import type { ComponentToExport } from "../../../types"
import type { CSSProperties } from "react"

/** Matches a top-level key of the serialized `sdn` object, at indent two. */
const TOP_LEVEL_KEY = /^ {2}"([^"]+)":/

/**
 * We build a defaultProps object to make sure nested children have
 * the correct overrides, In the function body the are merged together
 * with the props that are passed from the parent.
 *
 * Only includes props that have default values in function signature (valid props).
 * Grandchildren props are included regardless of parent being conditional.
 *
 * @param source
 * @param component
 * @param nodeIdToClass - Mapping of node IDs to CSS class names for themed components
 * @param propNames - Map of node paths to prop names
 * @returns Updated source content with default props
 */
export function insertDefaultProps(
  source: string,
  component: ComponentToExport,
  nodeIdToClass: Record<string, string> | undefined,
  propNames: Map<string, string>,
) {
  const defaultProps: Record<
    string,
    Record<string, string | CSSProperties | boolean | number | object | string[] | number[]>
  > = generateDefaultProps(component, nodeIdToClass, propNames)

  if (Object.keys(defaultProps).length === 0) {
    return source
  }

  const serialized = groupBySubtree(
    JSON.stringify(defaultProps, null, 2),
    getSubtreeBoundaryPropNames(component, propNames),
  )

  source = transformSource({
    source,
    strategy: TransformStrategy.APPEND,
    content: `
//
// Default property values
//
const sdn: ${component.tree.dataBinding.interfaceName} = ${serialized}`,
  })

  return source
}

/**
 * Opens a new cluster in the serialized object at each top-level subtree
 * boundary, so the `sdn` block breaks at the same places as the interface, the
 * signature, and the declaration list.
 */
function groupBySubtree(serialized: string, boundaries: Set<string>): string {
  const lines: string[] = []

  serialized.split("\n").forEach((line, index) => {
    const key = line.match(TOP_LEVEL_KEY)?.[1]

    if (index > 0 && key !== undefined && boundaries.has(key)) {
      lines.push("")
    }

    lines.push(line)
  })

  return lines.join("\n")
}
