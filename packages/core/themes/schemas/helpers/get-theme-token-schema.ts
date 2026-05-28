import type {
  ThemeTokenSchema,
  ThemeTokenSchemaUnresolved,
} from "../../types/schema"
import { THEME_TOKEN_SCHEMAS } from "../data/theme-token-schemas"
import { resolveThemeTokenSchema } from "./resolve-theme-token-schema"

/** Catalog entry from the static map only, without merging `propertyKey` defaults. */
export function getStoredThemeTokenSchema(
  key: string,
): ThemeTokenSchema | undefined {
  return THEME_TOKEN_SCHEMAS[key]
}

/** Resolved catalog entry (static map + `propertyKey` merge when present). */
export function getThemeTokenSchema(key: string): ThemeTokenSchema | undefined {
  const entry = THEME_TOKEN_SCHEMAS[key]
  if (!entry) return undefined
  return resolveThemeTokenSchema(entry as ThemeTokenSchemaUnresolved)
}
