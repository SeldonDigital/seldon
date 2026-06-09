import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import {
  ComponentSchema,
  SchemaChild,
  isComplexSchema,
} from "../../../components/types"
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
