/**
 * Per-family variant selection. A font collection entry stores which variants
 * (weights and styles) of each family are enabled. The selection lives in the
 * entry overrides under `variantSelection[slot]`. An absent slot or absent
 * variant means enabled, so the default is all-on.
 */

/** Enabled flags for one family's variants, keyed by variant string. */
export type FamilyVariantSelection = Record<string, boolean>

/** Variant selection for every family slot in a collection entry. */
export type VariantSelection = Record<string, FamilyVariantSelection>

export type VariantPreset = "all" | "none" | "custom"

/** True when a variant is enabled. Absent entries default to enabled. */
export function isVariantEnabled(
  slotSelection: FamilyVariantSelection | undefined,
  variant: string,
): boolean {
  return slotSelection?.[variant] !== false
}

/** Returns the enabled subset of `available`, preserving order. */
export function getEnabledVariants(
  slotSelection: FamilyVariantSelection | undefined,
  available: string[],
): string[] {
  return available.filter((variant) => isVariantEnabled(slotSelection, variant))
}

/** Derives the preset for a family from its selection and available variants. */
export function deriveVariantPreset(
  slotSelection: FamilyVariantSelection | undefined,
  available: string[],
): VariantPreset {
  if (available.length === 0) return "all"
  const enabled = getEnabledVariants(slotSelection, available).length
  if (enabled === available.length) return "all"
  if (enabled === 0) return "none"
  return "custom"
}
