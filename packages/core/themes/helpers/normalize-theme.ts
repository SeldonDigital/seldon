import { normalizeThemeInput } from "../compute/normalize-theme"
import type { ComputedTheme, StockTheme } from "../types/theme"
import { toRecomputableStockInput } from "./to-recomputable-stock"

/**
 * Coerce unknown / resolved workspace theme JSON into a normalized `StockTheme`
 * (palette slots as `dynamic` when recomputing from a `Theme`).
 */
export function normalizeTheme(theme: unknown): StockTheme {
  return normalizeThemeInput(
    toRecomputableStockInput(theme as StockTheme | ComputedTheme),
  ) as StockTheme
}
