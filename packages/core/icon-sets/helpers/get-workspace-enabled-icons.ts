import merge from "lodash/merge"
import { isIconSetBoard } from "../../workspace/model/components"
import type { EntryIconSet } from "../../workspace/model/entry-icon-set"
import {
  getIconSetTemplateCatalogId,
  getIconSetTemplateIconSetId,
} from "../../workspace/model/template-ref"
import type { Workspace } from "../../workspace/types"
import { STOCK_ICON_SETS_BY_ID } from "../catalog"
import { instantiateIconSet } from "../compute"
import type { IconId } from "../../icon-sets"
import type { ComputedIconSet } from "../types/icon-set"
import type { IconSetTemplateId } from "../types/icon-set-id"
import { getIncludedIcons, type IconInclusion } from "./icon-selection"

/** Maps an icon-set board catalog id to the icon-id prefix it contributes. */
const CATALOG_TO_ICON_PREFIX: Record<string, string> = {
  seldonIcons: "seldon",
  googleMaterial: "material",
  ibmCarbon: "carbon",
  lucideIcons: "lucide",
}

/** Reads the per-icon inclusion stored on an `icon-sets` entry. */
function readInclusion(entry: EntryIconSet | undefined): IconInclusion {
  const inclusion = entry?.overrides?.["includedIcons"]
  if (
    typeof inclusion !== "object" ||
    inclusion === null ||
    Array.isArray(inclusion)
  ) {
    return {}
  }
  return inclusion as IconInclusion
}

/**
 * Resolves an `icon-sets` entry to a computed icon set. Follows `catalog:{id}`
 * directly and walks `icon-set:{parentId}` links. Mirrors
 * `workspaceIconSetService.getIconSet`.
 */
function resolveEntryIconSet(
  iconSetId: string,
  workspace: Workspace,
): ComputedIconSet | null {
  const entry = workspace["icon-sets"][iconSetId] as EntryIconSet | undefined
  if (!entry) return null

  const catalogId = getIconSetTemplateCatalogId(entry.template)
  if (catalogId) {
    if (!(catalogId in STOCK_ICON_SETS_BY_ID)) return null
    return instantiateIconSet(
      catalogId as IconSetTemplateId,
      entry.overrides,
      STOCK_ICON_SETS_BY_ID,
    )
  }

  const parentId = getIconSetTemplateIconSetId(entry.template)
  if (parentId) {
    const parent = resolveEntryIconSet(parentId, workspace)
    if (!parent) return null
    return merge({}, parent, entry.overrides) as ComputedIconSet
  }

  return null
}

/**
 * Returns the icon-id prefixes (`material`, `carbon`, `lucide`, `seldon`) for
 * the icon-set boards present in the workspace.
 */
export function getAddedIconSetPrefixes(workspace: Workspace): Set<string> {
  const prefixes = new Set<string>()
  for (const entry of Object.values(workspace.components)) {
    if (!entry || !isIconSetBoard(entry)) continue
    const prefix = CATALOG_TO_ICON_PREFIX[entry.catalogId]
    if (prefix) prefixes.add(prefix)
  }
  return prefixes
}

/**
 * Returns the icons turned on across the workspace: the union of included icons
 * across every entry (default and variants) of every icon-set board, in board
 * then category order, deduplicated so each icon appears once.
 */
export function getWorkspaceEnabledIcons(workspace: Workspace): IconId[] {
  const ordered: IconId[] = []
  const seen = new Set<IconId>()

  for (const board of Object.values(workspace.components)) {
    if (!board || !isIconSetBoard(board)) continue
    for (const variant of board.variants ?? []) {
      const set = resolveEntryIconSet(variant.id, workspace)
      if (!set) continue
      const entry = workspace["icon-sets"][variant.id] as
        | EntryIconSet
        | undefined
      for (const iconId of getIncludedIcons(set, readInclusion(entry))) {
        if (seen.has(iconId)) continue
        seen.add(iconId)
        ordered.push(iconId)
      }
    }
  }

  return ordered
}

/**
 * True when an icon's set is added to the workspace but the icon is not
 * currently enabled. Icons whose set was never added render normally, so they
 * are not treated as unavailable. Callers pass precomputed sets so the work is
 * done once per workspace.
 */
export function isIconUnavailable(
  iconId: IconId,
  enabled: ReadonlySet<IconId>,
  addedPrefixes: ReadonlySet<string>,
): boolean {
  const prefix = iconId.split("-")[0]
  if (!addedPrefixes.has(prefix)) return false
  return !enabled.has(iconId)
}
