import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import {
  ComponentSchema,
  SchemaChild,
  isComplexSchema,
} from "../../../components/types"
import { resolveSchemaChild } from "./resolve-schema-child"

/**
 * Recursively collects all descendant component IDs from a component's schema.
 * Ensures parent components appear before their children in the returned array.
 * @param componentId - The root component ID to traverse
 * @returns Array of component IDs with parents before children
 */
function getCompositionChildren(
  component: ComponentSchema | SchemaChild,
): SchemaChild[] {
  if (!("id" in component) && component.children?.length) {
    return component.children
  }

  if ("id" in component) {
    const schema = getComponentSchema(component.id as ComponentId)
    const slots: SchemaChild[] = []

    if (!isComplexSchema(schema)) {
      return slots
    }

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

  return resolveSchemaChild(component).fallbackChildren
}

export function getComponentDescendantIds(
  componentId: ComponentId,
): ComponentId[] {
  const componentIds: ComponentId[] = []
  const seenIds = new Set<ComponentId>()
  const schema = getComponentSchema(componentId)

  addIdsForComponent(schema)

  function addIdsForComponent(component: ComponentSchema | SchemaChild) {
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
