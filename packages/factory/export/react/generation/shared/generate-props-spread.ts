import { ComponentToExport, JSONTreeNode } from "../../../types"
import { isAttributeKey } from "./attribute-props"
import { getConditionalPropPaths } from "./get-conditional-prop-paths"

/**
 * Generates the function signature props spread.
 *
 * Root-level props and non-conditional children get a default value sourced
 * from `sdn`. Conditional children (inline extras) are destructured without a
 * default, so they only render when the caller passes them.
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
  const props = [`className = ""`]
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
      props.push(`${propKey} = sdn.${propKey}`)
    }
  }

  const conditionalPaths = getConditionalPropPaths(component)

  function traverse(node: JSONTreeNode) {
    const propName = propNames.get(node.dataBinding.path)
    if (propName && !used.has(propName)) {
      used.add(propName)
      if (conditionalPaths.has(node.dataBinding.path)) {
        props.push(propName)
      } else {
        props.push(`${propName} = sdn.${propName}`)
      }
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(traverse)
    }
  }

  if (Array.isArray(component.tree.children)) {
    component.tree.children.forEach(traverse)
  }

  if (options?.includeChildren && !used.has("children")) {
    used.add("children")
    props.push("children")
  }

  // Pull the ref override channel out of the rest so it is never spread onto a
  // DOM element. Only components that compose children read it through
  // `applyRef`, so leaf primitives omit it to avoid an unused binding.
  const hasChildren =
    Array.isArray(component.tree.children) &&
    component.tree.children.length > 0
  if (hasChildren) {
    props.push("seldonRefs")
  }

  props.push("...props")
  return `{${props.join(",")}}`
}
