import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import { ComponentSchema, SchemaChild, isComplexSchema } from "../../../components/types"
import { collectComponentInstantiationPlans } from "./collect-component-instantiation-plans"
import {
  applyVariantFallbackToSlot,
  getCompositionChildren,
  getSchemaCompositionChildren,
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
  const instantiationPlans = collectComponentInstantiationPlans(
    componentId,
    variantFallbacks,
  )
  const expandingCatalog = new Set<ComponentId>()

  addIdsForComponent(schema)

  function registerComponentId(id: ComponentId) {
    if (seenIds.has(id) || expandingCatalog.has(id)) {
      return
    }

    const plan = instantiationPlans.get(id)
    if (plan?.fullCatalog) {
      expandingCatalog.add(id)
      const catalogSchema = getComponentSchema(id)
      if (isComplexSchema(catalogSchema)) {
        for (const catalogSlot of getSchemaCompositionChildren(catalogSchema)) {
          const slot = applyVariantFallbackToSlot(catalogSlot, variantFallbacks)
          addIdsForComponent(slot)
          registerComponentId(slot.component as ComponentId)
        }
      }
      expandingCatalog.delete(id)
    }

    componentIds.push(id)
    seenIds.add(id)
  }

  function addIdsForComponent(component: ComponentSchema | SchemaChild) {
    const compositionChildren = getCompositionChildren(component).map(
      (childSlot) => applyVariantFallbackToSlot(childSlot, variantFallbacks),
    )

    compositionChildren.forEach((slot) => {
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

    for (const slot of compositionChildren) {
      registerComponentId(slot.component as ComponentId)
    }

    if ("id" in component) {
      registerComponentId(component.id as ComponentId)
    }
  }

  return componentIds.reverse()
}
