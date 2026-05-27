import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import { ComponentSchema, SchemaChild, isComplexSchema } from "../../../components/types"
import {
  applyVariantFallbackToSlot,
  getCompositionChildren,
} from "./schema-composition-children"

/**
 * Recursively collects all descendant component IDs from a component's schema.
 * Ensures parent components appear before their children in the returned array.
 * @param componentId - The root component ID to traverse
 * @returns Array of component IDs with parents before children
 */
export function getComponentDescendantIds(
  componentId: ComponentId,
  variantFallbacks?: ReadonlySet<string>,
): ComponentId[] {
  const componentIds: ComponentId[] = []
  const seenIds = new Set<ComponentId>()
  const schema = getComponentSchema(componentId)

  addIdsForComponent(schema)

  function addIdsForComponent(component: ComponentSchema | SchemaChild) {
    const id = ("id" in component ? component.id : component.component) as ComponentId

    getCompositionChildren(component).forEach((childSlot) => {
      const slot = applyVariantFallbackToSlot(childSlot, variantFallbacks)
      addIdsForComponent(slot)
    })

    if (!("id" in component) && !component.variant) {
      const schema = getComponentSchema(component.component)
      if (isComplexSchema(schema)) {
        const explicitChildComponents = new Set(
          (component.children ?? []).map((child) => child.component),
        )
        for (const catalogSlot of schema.default.children ?? []) {
          if (!explicitChildComponents.has(catalogSlot.component)) {
            addIdsForComponent(catalogSlot)
          }
        }
      }
    }

    if (!seenIds.has(id)) {
      componentIds.push(id)
      seenIds.add(id)
    }
  }

  return componentIds.reverse()
}
