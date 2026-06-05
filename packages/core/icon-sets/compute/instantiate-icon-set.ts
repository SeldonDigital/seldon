import merge from "lodash/merge"
import { computeIconSet } from "../helpers/compute-icon-set"
import type { ComputedIconSet, StockIconSet } from "../types/icon-set"
import type { IconSetTemplateId } from "../types/icon-set-id"

/** Packaged icon set schemas keyed by catalog id (pass `STOCK_ICON_SETS_BY_ID`). */
export type PresetIconSetsById = Record<IconSetTemplateId, StockIconSet>

/**
 * Instantiates a computed icon set from a packaged schema and optional
 * overrides. Merges with `lodash/merge`, then runs `computeIconSet`.
 */
export function instantiateIconSet(
  templateId: IconSetTemplateId,
  overrides: Record<string, unknown> | undefined,
  presetsById: PresetIconSetsById,
): ComputedIconSet {
  const base = presetsById[templateId]
  if (!base) {
    throw new Error(`Unknown icon set template: ${templateId}`)
  }
  if (!overrides || Object.keys(overrides).length === 0) {
    return computeIconSet(base)
  }
  const merged = merge({}, base, overrides) as StockIconSet
  return computeIconSet(merged)
}
