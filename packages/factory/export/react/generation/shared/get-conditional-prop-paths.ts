import { ComponentLevel } from "@seldon/core/components/constants"
import { ComponentToExport, JSONTreeNode } from "../../../types"
import {
  ComponentPropsValidation,
  validateExportedComponentProps,
  validateTreeNodeProps,
} from "../../validation/validate-component-props"

/**
 * Collects the node paths that render conditionally (inline extras).
 *
 * A node is conditional when it is not a schema-valid child of the component it
 * belongs to. Frames are transparent: a frame is structural and never
 * conditional, and its children are validated against the frame's parent, so
 * arbitrary content placed inside a frame becomes a conditional top-level prop.
 *
 * Grandchildren passed as props to a real child component are validated against
 * that child's schema, so canonical children stay non-conditional and keep
 * their defaults.
 */
export function getConditionalPropPaths(
  component: ComponentToExport,
): Set<string> {
  const conditional = new Set<string>()
  const rootValidation = validateExportedComponentProps(component)

  function isValidIn(
    node: JSONTreeNode,
    validation: ComponentPropsValidation,
  ): boolean {
    return validation.validProps.some(
      (valid) => valid.dataBinding.path === node.dataBinding.path,
    )
  }

  function walk(node: JSONTreeNode, parentValidation: ComponentPropsValidation) {
    if (node.level === ComponentLevel.FRAME) {
      // Frame is structural: never conditional, and transparent to its children.
      if (Array.isArray(node.children)) {
        node.children.forEach((child) => walk(child, parentValidation))
      }
      return
    }

    if (!isValidIn(node, parentValidation)) {
      conditional.add(node.dataBinding.path)
    }

    if (Array.isArray(node.children)) {
      const childValidation = validateTreeNodeProps(node)
      node.children.forEach((child) => walk(child, childValidation))
    }
  }

  if (Array.isArray(component.tree.children)) {
    component.tree.children.forEach((child) => walk(child, rootValidation))
  }

  return conditional
}
