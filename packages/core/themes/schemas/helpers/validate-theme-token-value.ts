import { validatePropertyValue } from "../../../properties/schemas/helpers/validate-property-value"
import type { ComputedTheme, StockTheme } from "../../types/theme"
import type {
  ThemeTokenSchema,
  ThemeTokenSchemaSupport,
} from "../../types/schema"
import { resolveThemeTokenEntry } from "./resolve-theme-token-entry"

function validateUnbridgedThemeToken(
  schema: ThemeTokenSchema,
  value: unknown,
): boolean {
  const primary = schema.supports[0] as ThemeTokenSchemaSupport | undefined
  if (!primary) return false
  const fn = schema.validation[primary]
  return fn ? fn(value) : false
}

/**
 * Validates a raw value for a theme token key (static or dynamic catalog entry when `theme` is set).
 *
 * When the entry has `propertyKey`, delegates to {@link validatePropertyValue} with the same
 * `valueType` and `theme` as component properties (e.g. `exact`, `themeCategorical`).
 *
 * When the entry has no `propertyKey`, checks shape against the entry’s primary {@link ThemeTokenSchema.supports}
 * shape; the `valueType` argument is ignored for that path.
 *
 * @param tokenKey Theme token key (e.g. `size.tiny.step`, or a dynamic shadow key).
 * @param valueType Storage shape for bridged entries; see {@link validatePropertyValue}.
 * @param value Raw payload without a wrapping `{ type, value }` object.
 * @param theme Stock or computed theme; required to resolve dynamic token keys.
 */
export function validateThemeTokenValue(
  tokenKey: string,
  valueType: string,
  value: unknown,
  theme?: StockTheme | ComputedTheme,
): boolean {
  const entry = resolveThemeTokenEntry(tokenKey, theme)
  if (!entry) return false

  if (entry.propertyKey) {
    return validatePropertyValue(
      entry.propertyKey,
      valueType,
      value,
      theme as ComputedTheme | undefined,
    )
  }

  return validateUnbridgedThemeToken(entry, value)
}
