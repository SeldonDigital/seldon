import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import { hasVariants } from "../../../components/types"
import {
  applyVariantFallbackToSlot,
  walkSchemaComposition,
} from "./schema-composition-children"

export type ComponentInstantiationPlan = {
  /** When true, create every catalog variant on the component board. */
  fullCatalog: boolean
  /** Catalog variant ids required by composition slots when not fullCatalog. */
  variantIds: Set<string>
}

function createPlan(): ComponentInstantiationPlan {
  return {
    fullCatalog: false,
    variantIds: new Set(),
  }
}

/**
 * Derives how each referenced component board should be instantiated for an add.
 * Slots that name a catalog variant restrict the board to default plus those variants.
 * Any slot without a variant reference requires the full catalog variant set.
 */
export function collectComponentInstantiationPlans(
  rootComponentId: ComponentId,
  variantFallbacks?: ReadonlySet<string>,
): Map<ComponentId, ComponentInstantiationPlan> {
  const plans = new Map<ComponentId, ComponentInstantiationPlan>()

  function getPlan(componentId: ComponentId): ComponentInstantiationPlan {
    const existing = plans.get(componentId)
    if (existing) {
      return existing
    }
    const plan = createPlan()
    plans.set(componentId, plan)
    return plan
  }

  walkSchemaComposition(
    rootComponentId,
    (slot) => {
      const plan = getPlan(slot.component)
      if (!slot.variant) {
        plan.fullCatalog = true
        return
      }

      const childSchema = getComponentSchema(slot.component)
      if (!hasVariants(childSchema)) {
        return
      }

      plan.variantIds.add(slot.variant)
    },
    variantFallbacks,
  )

  return plans
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
