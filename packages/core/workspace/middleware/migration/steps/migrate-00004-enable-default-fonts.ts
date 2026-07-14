import { STOCK_FONT_COLLECTIONS_BY_ID } from "../../../../font-collections/catalog"
import type { EntryFontCollection } from "../../../model/entry-font-collection"
import { formatFontCollectionCatalog } from "../../../model/template-ref"
import type { Workspace } from "../../../model/workspace"
import {
  readFamilyVariantSelection,
  setFamilyVariantPreset,
} from "../../../reducers/handlers/shared/font-collection-variant-selection"

/**
 * v4: enable Google font families that became defaults after a workspace was
 * created.
 *
 * `GOOGLE_DEFAULT_ENABLED_FAMILIES` is applied only when the Google collection
 * is first seeded or added. Families added to that set later stay disabled in
 * existing workspaces, so a theme that references one cannot show it in the font
 * picker. This backfills those families on every Google collection entry,
 * enabling all available variants. It skips any family a workspace already
 * selects, so it never clobbers a user's own selection.
 *
 * Families added in a later release get their own versioned step that reuses
 * {@link enableGoogleFontFamilies}, so each workspace runs the backfill once.
 */
const FAMILIES_TO_ENABLE = new Set(["Fraunces", "Space Grotesk", "Sora"])

const GOOGLE_TEMPLATE = formatFontCollectionCatalog("googleFonts")

function googleFontEntries(workspace: Workspace): EntryFontCollection[] {
  return Object.values(workspace["font-collections"]).filter(
    (entry) => entry.template === GOOGLE_TEMPLATE,
  )
}

/** Slots to enable on an entry: requested families it does not select yet. */
function pendingFamilies(
  entry: EntryFontCollection,
  families: Set<string>,
): [string, string[]][] {
  const stock = STOCK_FONT_COLLECTIONS_BY_ID["googleFonts"]
  const pending: [string, string[]][] = []
  for (const [slot, family] of Object.entries(stock.families)) {
    if (!family.variants || family.variants.length === 0) continue
    if (!families.has(family.name)) continue
    if (Object.keys(readFamilyVariantSelection(entry, slot)).length > 0)
      continue
    pending.push([slot, family.variants])
  }
  return pending
}

/**
 * Enables the given Google families on every Google collection entry, turning on
 * all available variants. Skips families an entry already selects, so it never
 * clobbers a user's own selection. Shared by the versioned font backfill steps.
 */
export function enableGoogleFontFamilies(
  workspace: Workspace,
  families: Set<string>,
): Workspace {
  const applies = googleFontEntries(workspace).some(
    (entry) => pendingFamilies(entry, families).length > 0,
  )
  if (!applies) return workspace

  const next = structuredClone(workspace)

  for (const entry of googleFontEntries(next)) {
    for (const [slot, variants] of pendingFamilies(entry, families)) {
      setFamilyVariantPreset(entry, slot, "all", variants)
    }
  }

  return next
}

export function migrateV4EnableDefaultFonts(workspace: Workspace): Workspace {
  return enableGoogleFontFamilies(workspace, FAMILIES_TO_ENABLE)
}
