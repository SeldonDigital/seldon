import {
  deriveVariantPreset,
  isVariantEnabled,
} from "@seldon/core/font-collections"
import { sortFontVariants } from "@seldon/core/helpers/utils/font-variant"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services/font-collection/font-collection.service"
import type { Workspace } from "@seldon/core/workspace/types"

import { section } from "./section"

const TITLE =
  "Font collection families (toggle a whole family with set_font_collection_family_preset, or one weight with set_font_collection_family_variant):"

/**
 * Lists the families of one font collection entry with each family's weights and
 * on/off state, so the model can toggle a family or a single weight in one step.
 * Reads the same computed collection and variant selection the editor's font
 * panel uses, so the reported slot and variant tokens match the tool payloads.
 * Returns [] when the entry is missing, so the caller drops the section.
 */
export function fontCollectionValuesSection(
  fontCollectionId: string,
  workspace: Workspace,
): string[] {
  const collection = workspaceFontCollectionService.getFontCollection(
    fontCollectionId,
    workspace,
  )
  if (!collection) return []
  const selection = workspaceFontCollectionService.getVariantSelection(
    fontCollectionId,
    workspace,
  )

  const body: string[] = [`entry: ${fontCollectionId}`]
  for (const [slot, family] of Object.entries(collection.families)) {
    const variants = family.variants ?? []
    if (variants.length === 0) {
      body.push(`- ${slot} (${family.name}): no selectable weights`)
      continue
    }
    const slotSelection = selection[slot]
    const preset = deriveVariantPreset(slotSelection, variants)
    const weights = sortFontVariants(variants)
      .map(
        (variant) =>
          `${variant}=${isVariantEnabled(slotSelection, variant) ? "on" : "off"}`,
      )
      .join(", ")
    body.push(`- ${slot} (${family.name}) preset=${preset}: ${weights}`)
  }
  return section(TITLE, body)
}
