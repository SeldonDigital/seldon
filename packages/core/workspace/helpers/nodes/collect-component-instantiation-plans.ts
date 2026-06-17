import { ComponentId } from "../../../components/constants"
import type { ComponentInstantiationPlan } from "./component-add-plan"

export type { ComponentInstantiationPlan } from "./component-add-plan"

export function getInstantiationOptionsForComponent(
  componentId: ComponentId,
  plans: Map<ComponentId, ComponentInstantiationPlan>,
): {
  restrictedVariantIds?: string[]
} {
  const plan = plans.get(componentId)
  if (!plan || plan.fullCatalog || plan.variantIds.size === 0) {
    return {}
  }

  return { restrictedVariantIds: [...plan.variantIds] }
}
