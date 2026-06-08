import { ComponentId } from "../../../components/constants"
import {
  buildComponentAddPlan,
  type ComponentInstantiationPlan,
} from "./component-add-plan"

export type { ComponentInstantiationPlan } from "./component-add-plan"

/**
 * Derives how each referenced component board should be instantiated for an add.
 * Thin wrapper over the unified planner so plans and the descendant board set
 * always agree.
 */
export function collectComponentInstantiationPlans(
  rootComponentId: ComponentId,
  variantFallbacks?: ReadonlySet<string>,
): Map<ComponentId, ComponentInstantiationPlan> {
  return buildComponentAddPlan(rootComponentId, variantFallbacks).plans
}

export function getInstantiationOptionsForComponent(
  componentId: ComponentId,
  plans: Map<ComponentId, ComponentInstantiationPlan>,
): {
  embeddedVariantId?: string
  restrictedCatalogVariantIds?: string[]
} {
  const plan = plans.get(componentId)
  if (!plan || plan.fullCatalog) {
    return {}
  }

  if (plan.variantIds.size === 1) {
    return { embeddedVariantId: [...plan.variantIds][0] }
  }

  if (plan.variantIds.size > 1) {
    return { restrictedCatalogVariantIds: [...plan.variantIds] }
  }

  return {}
}
