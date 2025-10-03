import { getComponentSchema } from "../../components/catalog"
import { Component } from "../../components/types"

/**
 * Retrieves the children components from a component schema, checking the component first
 * and falling back to the original schema if no children are defined.
 * @param childComponent - The component to get children from
 * @returns Array of child components, or empty array if none found
 */
export function getChildrenFromSchema(childComponent: Component): Component[] {
  if ("children" in childComponent && childComponent.children) {
    return childComponent.children
  }

  const originalSchema = getComponentSchema(childComponent.component)
  if ("children" in originalSchema && originalSchema.children) {
    return originalSchema.children
  }
  return []
}
