import merge from "lodash/merge"
import { computeTheme } from "../helpers/compute-theme"
import type { ComputedTheme, StockTheme } from "../types/theme"
import type { ThemeTemplateId } from "../types/theme-id"

/** Stock theme definitions keyed by catalog id (pass {@link STOCK_THEMES_BY_ID} from `themes/stock`). */
export type PresetThemesById = Record<ThemeTemplateId, StockTheme>

/**
 * Instantiates a computed {@link Theme} from a packaged stock row and optional token overrides.
 * Merges with `lodash/merge`, then runs {@link computeTheme}. This is not property **`@`** resolution
 * (see `helpers/resolution` / `resolveThemeValue` on the properties side).
 */
export function instantiateTheme(
  templateId: ThemeTemplateId,
  overrides: Record<string, unknown> | undefined,
  presetsById: PresetThemesById,
): ComputedTheme {
  const base = presetsById[templateId]
  if (!base) {
    throw new Error(`Unknown theme template: ${templateId}`)
  }
  if (!overrides || Object.keys(overrides).length === 0) {
    return computeTheme(base)
  }
  const merged = merge({}, base, overrides) as StockTheme
  return computeTheme(merged)
}
