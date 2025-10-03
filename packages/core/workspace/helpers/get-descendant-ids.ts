import { getComponentSchema } from "../../components/catalog"
import { ComponentId } from "../../components/constants"
import { Component, ComponentSchema } from "../../components/types"

/**
 * Recursively collects all descendant component IDs from a component's schema.
 * Ensures parent components appear before their children in the returned array.
 * @param componentId - The root component ID to traverse
 * @returns Array of component IDs with parents before children
 */
export function getComponentDescendantIds(
  componentId: ComponentId,
): ComponentId[] {
  const componentIds: ComponentId[] = []
  const seenIds = new Set<ComponentId>()
  const schema = getComponentSchema(componentId)

  addIdsForComponent(schema)

  function addIdsForComponent(component: ComponentSchema | Component) {
    const id = "id" in component ? component.id : component.component

    if (seenIds.has(id)) {
      const index = componentIds.indexOf(id)
      if (index > -1) {
        componentIds.splice(index, 1)
      }
    }

    componentIds.push(id)
    seenIds.add(id)

    let children: Component[] | undefined = []

    const schema = getComponentSchema(id)
    if ("children" in schema && schema.children) {
      children = schema.children
    }
    if ("children" in component && component.children) {
      children = component.children
    }
    if (children) {
      children.forEach((child) => addIdsForComponent(child))
    }
  }

  return componentIds
}
