import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import {
  SchemaChild,
  hasVariants,
  isComplexSchema,
} from "../../../components/types"
import { resolveSchemaChild } from "./resolve-schema-child"
import { applyVariantFallbackToSlot } from "./schema-composition-children"

/**
 * How a component board is built when added: either every catalog variant
 * (`fullCatalog`) or the default plus a restricted set of variant ids.
 */
export type ComponentInstantiationPlan = {
  fullCatalog: boolean
  variantIds: Set<string>
}

/**
 * The full result of planning an add: the component boards to create (parents
 * before children) and how each board should be instantiated.
 */
export type ComponentAddPlan = {
  orderedComponentIds: ComponentId[]
  plans: Map<ComponentId, ComponentInstantiationPlan>
}

/**
 * Returns every child slot a component board materializes for a given build
 * mode, flattened across the instance tree. This mirrors `instantiateComponent`
 * exactly so board collection and plan collection can never diverge:
 *
 * - the default tree is always materialized, so the board's default variant is
 *   never left empty regardless of build mode;
 * - full catalog adds every variant tree on top (a variant with no children of
 *   its own falls back to the default children);
 * - a restricted plan adds only the named variant trees (an empty variant
 *   contributes no children, matching the restricted instantiation branch);
 * - within any tree, a slot's own `children` win, otherwise the slot resolves
 *   to its schema fallback children.
 */
export function materializedChildSlots(
  componentId: ComponentId,
  plan: ComponentInstantiationPlan,
  variantFallbacks?: ReadonlySet<string>,
): SchemaChild[] {
  const schema = getComponentSchema(componentId)
  if (!isComplexSchema(schema)) {
    return []
  }

  const defaultChildren = schema.default.children ?? []
  const trees: SchemaChild[][] = [defaultChildren]

  if (plan.fullCatalog) {
    for (const variant of schema.variants ?? []) {
      trees.push(variant.children?.length ? variant.children : defaultChildren)
    }
  } else {
    for (const variantId of plan.variantIds) {
      const variant = schema.variants?.find(
        (candidate) => candidate.id === variantId,
      )
      if (variant?.children?.length) {
        trees.push(variant.children)
      }
    }
  }

  const slots: SchemaChild[] = []

  function walk(rawSlot: SchemaChild): void {
    const slot = applyVariantFallbackToSlot(rawSlot, variantFallbacks)
    slots.push(slot)
    const childSlots = slot.children?.length
      ? slot.children
      : resolveSchemaChild(slot).fallbackChildren
    for (const child of childSlots) {
      walk(child)
    }
  }

  for (const tree of trees) {
    for (const slot of tree) {
      walk(slot)
    }
  }

  return slots
}

/**
 * Phase 1: resolve each reachable component's build mode. A worklist re-visits a
 * component whenever its mode grows (restricted to full, or a new variant id),
 * which terminates because modes only ever grow within a finite space.
 */
function computePlans(
  rootId: ComponentId,
  variantFallbacks?: ReadonlySet<string>,
): Map<ComponentId, ComponentInstantiationPlan> {
  const plans = new Map<ComponentId, ComponentInstantiationPlan>()
  const queue: ComponentId[] = []

  function reference(id: ComponentId, variantId: string | undefined): void {
    const existing = plans.get(id)
    const plan = existing ?? {
      fullCatalog: false,
      variantIds: new Set<string>(),
    }
    let changed = !existing

    if (!variantId) {
      if (!plan.fullCatalog) {
        plan.fullCatalog = true
        changed = true
      }
    } else if (hasVariants(getComponentSchema(id))) {
      if (!plan.variantIds.has(variantId)) {
        plan.variantIds.add(variantId)
        changed = true
      }
    }

    if (!existing) {
      plans.set(id, plan)
    }
    if (changed) {
      queue.push(id)
    }
  }

  reference(rootId, undefined)

  while (queue.length) {
    const id = queue.shift()!
    const plan = plans.get(id)!
    for (const slot of materializedChildSlots(id, plan, variantFallbacks)) {
      reference(slot.component, slot.variant)
    }
  }

  return plans
}

/**
 * Phase 2: order the component boards parents-before-children using the same
 * materialized slots, so the descendant set always matches the plans.
 */
function computeOrderedIds(
  rootId: ComponentId,
  plans: Map<ComponentId, ComponentInstantiationPlan>,
  variantFallbacks?: ReadonlySet<string>,
): ComponentId[] {
  const fullCatalogFallback: ComponentInstantiationPlan = {
    fullCatalog: true,
    variantIds: new Set<string>(),
  }
  const ordered: ComponentId[] = []
  const seen = new Set<ComponentId>()

  function childComponentIds(id: ComponentId): ComponentId[] {
    const plan = plans.get(id) ?? fullCatalogFallback
    const ids: ComponentId[] = []
    const localSeen = new Set<ComponentId>()
    for (const slot of materializedChildSlots(id, plan, variantFallbacks)) {
      if (!localSeen.has(slot.component)) {
        localSeen.add(slot.component)
        ids.push(slot.component)
      }
    }
    return ids
  }

  function visit(id: ComponentId): void {
    if (seen.has(id)) {
      return
    }
    seen.add(id)
    for (const childId of childComponentIds(id)) {
      visit(childId)
    }
    ordered.push(id)
  }

  visit(rootId)

  return ordered.reverse()
}

/**
 * Builds the complete add plan for a root component: which boards to create and
 * how to instantiate each. Both outputs derive from `materializedChildSlots`, so
 * the board set and the plans stay consistent by construction.
 */
export function buildComponentAddPlan(
  rootId: ComponentId,
  variantFallbacks?: ReadonlySet<string>,
): ComponentAddPlan {
  const plans = computePlans(rootId, variantFallbacks)
  const orderedComponentIds = computeOrderedIds(rootId, plans, variantFallbacks)
  return { orderedComponentIds, plans }
}
