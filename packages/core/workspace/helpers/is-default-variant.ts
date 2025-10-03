import { DefaultVariant, Variant } from "../types"

/**
 * Check if a variant is the default variant of a component
 *
 * @param variant - The variant to check
 */
export function isDefaultVariant(variant: Variant): variant is DefaultVariant {
  // If the variant has an instanceOf property, it is not the default variant
  return variant.type === "defaultVariant"
}
