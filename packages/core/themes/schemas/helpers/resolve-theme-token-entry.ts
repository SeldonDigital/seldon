import type { ThemeTokenSchema } from "../../types/schema"
import type { ComputedTheme, StockTheme } from "../../types/theme"
import { getAllThemeTokenSchemas } from "./get-all-theme-token-schemas"
import { getThemeTokenSchema } from "./get-theme-token-schema"

/**
 * Resolves a theme token catalog entry by key: static catalog first (with property-key merge), then
 * dynamic catalog entries when `theme` is provided.
 */
export function resolveThemeTokenEntry(
  key: string,
  theme?: StockTheme | ComputedTheme,
): ThemeTokenSchema | undefined {
  const staticEntry = getThemeTokenSchema(key)
  if (staticEntry) return staticEntry
  if (!theme) return undefined
  return getAllThemeTokenSchemas(theme).find((entry) => entry.key === key)
}
