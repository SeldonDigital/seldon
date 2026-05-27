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
function getSchemaCompositionChildren(schema: ComponentSchema): SchemaChild[] {
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

function getCompositionChildren(
  component: ComponentSchema | SchemaChild,
): SchemaChild[] {
  if ("id" in component) {
    return getSchemaCompositionChildren(
      getComponentSchema(component.id as ComponentId),
    )
  }

  if (component.children?.length) {
    return component.children
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

    getCompositionChildren(component).forEach((child) => addIdsForComponent(child))

    if (!seenIds.has(id)) {
      componentIds.push(id)
      seenIds.add(id)
    }
  }

  return componentIds.reverse()
}
