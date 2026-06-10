import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import {
  ComponentSchema,
  SchemaChild,
  isComplexSchema,
} from "../../../components/types"
import { mergeProperties } from "../../../properties/helpers/merge-properties"
import { resolveSchemaChild } from "./resolve-schema-child"

export function formatSchemaVariantLabel(variantId: string): string {
  if (!variantId.length) return variantId
  const spaced = variantId.replace(/([a-z])([A-Z])/g, "$1 $2")
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

export function getSchemaVariantSlotKey(
  componentId: ComponentId,
  variantId: string,
): string {
  return `${componentId}:${variantId}`
}

export function getSchemaCompositionChildren(
  schema: ComponentSchema,
): SchemaChild[] {
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

export function getCompositionChildren(
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

export function applyVariantFallbackToSlot(
  slot: SchemaChild,
  variantFallbacks?: ReadonlySet<string>,
): SchemaChild {
  if (!slot.variant || !variantFallbacks?.size) {
    return slot
  }

  const slotKey = getSchemaVariantSlotKey(slot.component, slot.variant)
  if (!variantFallbacks.has(slotKey)) {
    return slot
  }

  const { variant: _variant, ...slotWithoutVariant } = slot
  return slotWithoutVariant
}

/**
 * Resolves a slot into its effective form: inline children keep membership, and
 * each inline child layers its overrides on top of the slot it displaces in the
 * referenced tree. Matching walks the displaced list in order and takes the
 * first unused slot with the same component. Unmatched inline slots keep their
 * own overrides. Displaced slots taken as fallback membership are resolved the
 * same way, so the returned tree is fully effective and must not be merged
 * again.
 */
export function mergeInlineSlotOverrides(
  slot: SchemaChild,
  variantFallbacks?: ReadonlySet<string>,
): SchemaChild {
  return mergeSlot(slot, null, variantFallbacks)
}

/** The children a slot displaces: its explicit list or its schema fallback. */
function getDisplacedChildren(
  slot: SchemaChild,
  variantFallbacks?: ReadonlySet<string>,
): SchemaChild[] {
  const resolved = applyVariantFallbackToSlot(slot, variantFallbacks)
  return resolved.children?.length
    ? resolved.children
    : resolveSchemaChild(resolved).fallbackChildren
}

function mergeSlot(
  rawSlot: SchemaChild,
  displaced: SchemaChild | null,
  variantFallbacks?: ReadonlySet<string>,
): SchemaChild {
  const slot = applyVariantFallbackToSlot(rawSlot, variantFallbacks)
  const overrides = displaced
    ? mergeProperties(
        structuredClone(displaced.overrides ?? {}),
        slot.overrides ?? {},
      )
    : slot.overrides

  if (!slot.children?.length) {
    if (!displaced && !overrides) return slot
    return { ...slot, ...(overrides ? { overrides } : {}) }
  }

  const displacedChildren = displaced
    ? getDisplacedChildren(displaced, variantFallbacks)
    : resolveSchemaChild(slot).fallbackChildren

  const usedDisplaced = new Set<number>()
  const children = slot.children.map((child) => {
    const resolvedChild = applyVariantFallbackToSlot(child, variantFallbacks)
    const matchIndex = displacedChildren.findIndex(
      (candidate, index) =>
        !usedDisplaced.has(index) &&
        applyVariantFallbackToSlot(candidate, variantFallbacks).component ===
          resolvedChild.component,
    )
    if (matchIndex === -1) {
      return mergeSlot(child, null, variantFallbacks)
    }
    usedDisplaced.add(matchIndex)
    return mergeSlot(child, displacedChildren[matchIndex], variantFallbacks)
  })

  return {
    ...slot,
    ...(overrides ? { overrides } : {}),
    children,
  }
}

export function walkSchemaComposition(
  componentId: ComponentId,
  visitSlot: (slot: SchemaChild) => void,
  variantFallbacks?: ReadonlySet<string>,
): void {
  const schema = getComponentSchema(componentId)

  function walkComponent(component: ComponentSchema | SchemaChild): void {
    getCompositionChildren(component).forEach((childSlot) => {
      const slot = applyVariantFallbackToSlot(childSlot, variantFallbacks)
      visitSlot(slot)
      walkComponent(slot)
    })
  }

  walkComponent(schema)
}
