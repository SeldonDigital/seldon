import type { ComponentToExport } from "../../../types"

/**
 * Collects the prop names that open a new top-level subtree.
 *
 * Every walker over a component's tree visits nodes in depth-first pre-order, so
 * the prop lists in the interface, the signature, the `sdn` block, and the
 * declaration list all run in the same order. A name in this set marks the point
 * where the walk returned to depth one, which is where a blank line groups the
 * lists into one cluster per top-level child. The first child is excluded
 * because nothing precedes it.
 */
export function getSubtreeBoundaryPropNames(
  component: ComponentToExport,
  propNames: Map<string, string>,
): Set<string> {
  const boundaries = new Set<string>()

  if (!Array.isArray(component.tree.children)) return boundaries

  component.tree.children.slice(1).forEach((child) => {
    const propName = propNames.get(child.dataBinding.path)

    if (propName) boundaries.add(propName)
  })

  return boundaries
}

/**
 * Joins lines with a blank line inserted before each name in `boundaries`. Each
 * entry pairs the emitted line with the prop name it belongs to, so a line that
 * carries no prop name (a scalar prop or the trailing rest element) never opens
 * a cluster.
 */
export function joinWithSubtreeBreaks(
  entries: Array<{ line: string; name?: string }>,
  boundaries: Set<string>,
): string {
  const lines: string[] = []

  entries.forEach((entry, index) => {
    if (index > 0 && entry.name !== undefined && boundaries.has(entry.name)) {
      lines.push("")
    }

    lines.push(entry.line)
  })

  return lines.join("\n")
}
