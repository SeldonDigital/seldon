import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useMemo } from "react"

import { deriveVariantPreset, isVariantEnabled } from "@seldon/core/font-collections"
import { fontVariantDisplayLabel, sortFontVariants } from "@seldon/core/helpers/utils/font-variant"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services/font-collection/font-collection.service"

import type { VariantPreset } from "@seldon/core/font-collections"

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
 * each with its derived preset and sorted weight rows. Reuses the workspace
 * font collection service and the variant-selection helpers so the Objects
 * sidebar reads the same data the Properties sidebar and canvas do.
 */
export function useFontCollectionFamilyRows(entryId: string): FontFamilyRowModel[] {
  const { workspace } = useWorkspace({ usePreview: false })

  return useMemo(() => {
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
  }, [entryId, workspace])
}
