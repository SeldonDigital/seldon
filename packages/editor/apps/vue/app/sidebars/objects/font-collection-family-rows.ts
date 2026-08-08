import { deriveVariantPreset, isVariantEnabled } from "@seldon/core/font-collections"
import { fontVariantDisplayLabel, sortFontVariants } from "@seldon/core/helpers/utils/font-variant"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services/font-collection/font-collection.service"

import type { VariantPreset } from "@seldon/core/font-collections"
import type { Workspace } from "@seldon/core/workspace/types"

/** One weight variant of a family, with its display label and enabled flag. */
export interface FontFamilyWeightRow {
  variant: string
  label: string
  enabled: boolean
}

/** One family slot of a collection entry, with its preset and weight rows. */
export interface FontFamilyRowModel {
  slot: string
  name: string
  preset: VariantPreset
  weights: FontFamilyWeightRow[]
  stack?: string
}

/**
 * Derives the per-family rows for a font collection entry, one per family slot,
 * each with its derived preset and sorted weight rows. Mirrors the React
 * `useFontCollectionFamilyRows` hook so both editors read the same shape.
 */
export function getFontCollectionFamilyRows(
  workspace: Workspace,
  entryId: string,
): FontFamilyRowModel[] {
  const collection = workspaceFontCollectionService.getFontCollection(entryId, workspace)

  if (!collection) return []

  const selection = workspaceFontCollectionService.getVariantSelection(entryId, workspace)

  return Object.entries(collection.families).map(([slot, family]) => {
    const available = family.variants ?? []
    const slotSelection = selection[slot]
    const weights = sortFontVariants(available).map((variant) => ({
      variant,
      label: fontVariantDisplayLabel(variant),
      enabled: isVariantEnabled(slotSelection, variant),
    }))

    return {
      slot,
      name: family.name,
      preset: deriveVariantPreset(slotSelection, available),
      weights,
      stack: family.stack,
    }
  })
}

/** Serializes a font family selection key as `font-collection:{boardKey}:{entryId}:{slot}`. */
export function formatFontFamilyKey(boardKey: string, entryId: string, slot: string): string {
  return `font-collection:${boardKey}:${entryId}:${slot}`
}
