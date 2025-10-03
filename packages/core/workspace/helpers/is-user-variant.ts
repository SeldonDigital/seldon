import { UserVariant, Variant } from "../types"
import { isDefaultVariant } from "./is-default-variant"

/**
 * Check if a variant is a user variant of a component
 *
 * @param variant - The variant to check
 */
export function isUserVariant(variant: Variant): variant is UserVariant {
  // If the variant is not the default variant, it is a user variant
  return !isDefaultVariant(variant)
}
