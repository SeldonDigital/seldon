import type {
  FamilyVariantSelection,
  VariantSelection,
} from "../../../../font-collections/helpers"
import type { EntryFontCollection } from "../../../model/entry-font-collection"

/** Section key under `EntryFontCollection.overrides` that holds per-family variant selection. */
export const FONT_COLLECTION_VARIANT_SELECTION_SECTION =
  "variantSelection" as const

function readSelection(entry: EntryFontCollection): VariantSelection {
  const current = (entry.overrides as Record<string, unknown>)[
    FONT_COLLECTION_VARIANT_SELECTION_SECTION
  ]
  if (typeof current !== "object" || current === null || Array.isArray(current)) {
    return {}
  }
  return { ...(current as VariantSelection) }
}

function writeSelection(
  entry: EntryFontCollection,
  selection: VariantSelection,
): void {
  const overrides: Record<string, unknown> = {
    ...(entry.overrides as Record<string, unknown>),
  }
  if (Object.keys(selection).length === 0) {
    delete overrides[FONT_COLLECTION_VARIANT_SELECTION_SECTION]
  } else {
    overrides[FONT_COLLECTION_VARIANT_SELECTION_SECTION] = selection
  }
  entry.overrides = overrides
}

/** Reads the variant selection for one family slot. */
export function readFamilyVariantSelection(
  entry: EntryFontCollection,
  slot: string,
): FamilyVariantSelection {
  const slotSelection = readSelection(entry)[slot]
  if (
    typeof slotSelection !== "object" ||
    slotSelection === null ||
    Array.isArray(slotSelection)
  ) {
    return {}
  }
  return { ...slotSelection }
}

/** Sets one variant on or off for a family slot. Mutates `entry`. */
export function setFamilyVariant(
  entry: EntryFontCollection,
  slot: string,
  variant: string,
  enabled: boolean,
): void {
  const selection = readSelection(entry)
  const slotSelection: FamilyVariantSelection = {
    ...readFamilyVariantSelection(entry, slot),
    [variant]: enabled,
  }
  selection[slot] = slotSelection
  writeSelection(entry, selection)
}

/**
 * Applies a preset to a family slot. `all` clears the slot override so every
 * variant defaults to enabled. `none` disables every available variant.
 * Mutates `entry`.
 */
export function setFamilyVariantPreset(
  entry: EntryFontCollection,
  slot: string,
  preset: "all" | "none",
  availableVariants: string[],
): void {
  const selection = readSelection(entry)
  if (preset === "all") {
    delete selection[slot]
  } else {
    const slotSelection: FamilyVariantSelection = {}
    for (const variant of availableVariants) {
      slotSelection[variant] = false
    }
    selection[slot] = slotSelection
  }
  writeSelection(entry, selection)
}
