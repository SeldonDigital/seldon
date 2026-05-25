import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import {
  Component,
  ComponentSchema,
  isComplexSchema,
} from "../../../components/types"

/**
 * Recursively collects all descendant component IDs from a component's schema.
 * Ensures parent components appear before their children in the returned array.
 * @param componentId - The root component ID to traverse
 * @returns Array of component IDs with parents before children
 */
function getCompositionChildren(
  component: ComponentSchema | Component,
): Component[] {
  const slots: Component[] = []

  if ("children" in component && component.children?.length) {
    slots.push(...component.children)
  }

  const componentKey = (
    "id" in component ? component.id : component.component
  ) as ComponentId
  const schema = getComponentSchema(componentKey)

  if ("id" in component && isComplexSchema(schema)) {
    if (schema.default.children?.length) {
      slots.push(...schema.default.children)
    }
    for (const variant of schema.variants ?? []) {
      if (variant.children?.length) {
        slots.push(...variant.children)
      }
    }
    return slots
  }

  if (isComplexSchema(schema) && schema.default.children?.length) {
    const seen = new Set(slots.map((slot) => slot.component))
    for (const defaultSlot of schema.default.children) {
      if (!seen.has(defaultSlot.component)) {
        slots.push(defaultSlot)
        seen.add(defaultSlot.component)
      }
    }
  }

  return slots
}

export function getComponentDescendantIds(
  componentId: ComponentId,
): ComponentId[] {
  const componentIds: ComponentId[] = []
  const seenIds = new Set<ComponentId>()
  const schema = getComponentSchema(componentId)

  addIdsForComponent(schema)

  function addIdsForComponent(component: ComponentSchema | Component) {
    const id = ("id" in component ? component.id : component.component) as ComponentId

    if (seenIds.has(id)) {
      const index = componentIds.indexOf(id)
      if (index > -1) {
        componentIds.splice(index, 1)
      }
    }

    componentIds.push(id)
    seenIds.add(id)

    getCompositionChildren(component).forEach((child) =>
      addIdsForComponent(child),
    )
  }

  return componentIds
}
