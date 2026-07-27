import { isAttributeKey } from "./attribute-props"
import { getSubtreeBoundaryPropNames, joinWithSubtreeBreaks } from "./get-subtree-boundaries"

import type { ComponentToExport, JSONTreeNode } from "../../../types"

interface SpreadEntry {
  line: string
  name?: string
}

/**
 * Generates the function signature props spread.
 *
 * Root-level props get a default value sourced from `sdn` because they are read
 * straight from the signature. Child slots take no default: the merge helpers
 * layer `sdn` in themselves, and an absent slot prop is what tells
 * `mergeOptionalSlot` the caller opted out.
 *
 * A component with slots emits one name per line, with a blank line at each
 * top-level subtree boundary and before the trailing `children` / `seldonRefs` /
 * rest group, so the signature breaks at the same places as the interface, the
 * `sdn` block, and the declaration list. A leaf primitive has no slots, so its
 * signature stays on one line.
 *
 * When `options.includeChildren` is set, `children` is destructured without a
 * default so the component body can render caller-provided children in place
 * of its default slot tree.
 */
export function generatePropsSpread(
  component: ComponentToExport,
  propNames: Map<string, string>,
  options?: { includeChildren?: boolean },
): string {
  const slots: SpreadEntry[] = [{ line: `className = ""` }]
  const used = new Set<string>(["className"])

  const rootProps = component.tree.dataBinding.props

  for (const [propKey] of Object.entries(rootProps)) {
    // Attribute-style keys (role, aria-*) are emitted on the element from `sdn`
    // and ride `...props` when passed, so they are never destructured by name.
    if (isAttributeKey(propKey)) {
      continue
    }

    if (!used.has(propKey)) {
      used.add(propKey)
      slots.push({ line: `${propKey} = sdn.${propKey}` })
    }
  }

  function traverse(node: JSONTreeNode) {
    const propName = propNames.get(node.dataBinding.path)

    if (propName && !used.has(propName)) {
      used.add(propName)
      slots.push({ line: propName, name: propName })
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(traverse)
    }
  }

  if (Array.isArray(component.tree.children)) {
    component.tree.children.forEach(traverse)
  }

  const tail: string[] = []

  if (options?.includeChildren && !used.has("children")) {
    used.add("children")
    tail.push("children")
  }

  // Pull the ref override channel out of the rest so it is never spread onto a
  // DOM element. Only components that compose children pass it to the merge
  // helpers, so leaf primitives omit it to avoid an unused binding.
  const hasChildren = Array.isArray(component.tree.children) && component.tree.children.length > 0

  if (hasChildren) {
    tail.push("seldonRefs")
  }

  if (!hasChildren) {
    return `{${[...slots.map((entry) => entry.line), ...tail, "...props"].join(",")}}`
  }

  const boundaries = getSubtreeBoundaryPropNames(component, propNames)
  const slotLines = joinWithSubtreeBreaks(
    slots.map((entry) => ({ ...entry, line: `${entry.line},` })),
    boundaries,
  )

  // The rest element must stay last, so no trailing comma follows it.
  const tailLines = [...tail.map((name) => `${name},`), "...props"].join("\n")

  return `{\n${slotLines}\n\n${tailLines}\n}`
}
