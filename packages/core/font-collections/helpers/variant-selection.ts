import { sortFontVariants } from "../../helpers/utils/font-variant"

/**
 * Per-family variant selection. A font collection entry stores which variants
 * (weights and styles) of each family are enabled. The selection lives in the
 * entry overrides under `variantSelection[slot]`. An absent slot or absent
 * variant means disabled, so the default is None and an enabled variant is an
 * explicit `true`.
 */

/** Enabled flags for one family's variants, keyed by variant string. */
export type FamilyVariantSelection = Record<string, boolean>

/** Variant selection for every family slot in a collection entry. */
export type VariantSelection = Record<string, FamilyVariantSelection>

export type VariantPreset = "all" | "none" | "custom"

/** True when a variant is enabled. Absent entries default to disabled. */
export function isVariantEnabled(
  slotSelection: FamilyVariantSelection | undefined,
  variant: string,
): boolean {
  return slotSelection?.[variant] === true
}

/**
 * Returns the enabled subset of `available`, sorted into a stable order
 * (uprights before italics, ascending by weight). Source data lists variants
 * inconsistently across families, so normalize here.
 */
export function getEnabledVariants(
  slotSelection: FamilyVariantSelection | undefined,
  available: string[],
): string[] {
  return sortFontVariants(
    available.filter((variant) => isVariantEnabled(slotSelection, variant)),
  )
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
