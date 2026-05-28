import { Colorspace } from "../constants/colorspace"
import { getDynamicSwatchColors } from "../compute/get-dynamic-swatch-color"
import { getDynamicSwatchName } from "../compute/get-dynamic-swatch-names"
import { normalizeThemeInput } from "../compute/normalize-theme"
import type { ComputedTheme, StockTheme } from "../types/theme"
import type { ThemePaletteSlot, ThemeSwatch } from "../values"
import { TokenType } from "../values"
import { isDynamicSwatchToken, isSwatchToken } from "../values"
import { injectBuiltInLooks } from "../looks/built-in-looks"
import { toRecomputableStockInput } from "./to-recomputable-stock"

function defaultIntentForPaletteSlot(role: ThemePaletteSlot): string {
  const intents: Record<ThemePaletteSlot, string> = {
    white: "The color white",
    gray: "The color gray",
    black: "The color black",
    primary: "The primary color",
    swatch1: "A tint of the primary color",
    swatch2: "A tint of the primary color",
    swatch3: "A tint of the primary color",
    swatch4: "A tint of the primary color",
  }
  return intents[role]
}

/**
 * Materialize a `StockTheme` schema (or recompute from a resolved theme) into a computed theme.
 * Workspace passes resolved theme rows after edits so dynamic swatches refresh from `color`.
 */
export function computeTheme(theme: StockTheme | ComputedTheme): ComputedTheme {
  const stockInput = toRecomputableStockInput(theme)
  const normalized = normalizeThemeInput(stockInput) as StockTheme
  const dynamic = getDynamicSwatchColors(normalized)

  const resolvedSwatch: Record<string, ThemeSwatch> = {}
  for (const [key, cell] of Object.entries(normalized.swatch)) {
    if (!cell) continue
    if (isDynamicSwatchToken(cell)) {
      const hsl = dynamic[cell.role]
      resolvedSwatch[key] = {
        type: TokenType.SWATCH,
        name: getDynamicSwatchName(cell.role, normalized),
        intent: cell.intent ?? defaultIntentForPaletteSlot(cell.role),
        parameters: { colorspace: Colorspace.HSL, value: hsl },
      }
    } else if (isSwatchToken(cell)) {
      resolvedSwatch[key] = cell
    } else {
      resolvedSwatch[key] = cell as ThemeSwatch
    }
  }

  return injectBuiltInLooks({
    ...normalized,
    id: normalized.metadata.id,
    swatch: resolvedSwatch as ComputedTheme["swatch"],
  })
}
