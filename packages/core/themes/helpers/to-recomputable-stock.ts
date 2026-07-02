import type { ComputedTheme, StockTheme } from "../types/theme"
import type { StockThemeSwatch, ThemeSwatch } from "../values"
import { THEME_PALETTE_SLOTS, TokenType } from "../values"
import { isSwatchToken } from "../values"

function isResolvedThemeSwatch(
  cell: StockThemeSwatch | ThemeSwatch,
): cell is ThemeSwatch {
  return isSwatchToken(cell)
}

/** A computed `Theme` has concrete swatches; stock uses `TokenType.DYNAMIC_SWATCH` there. */
function isResolvedTheme(
  theme: StockTheme | ComputedTheme,
): theme is ComputedTheme {
  const w = theme.swatch.white
  return Boolean(
    w && isResolvedThemeSwatch(w as StockThemeSwatch | ThemeSwatch),
  )
}

/** Turn a computed theme back into stock-shaped input so palette + neutrals recompute. */
function toRecomputableStock(theme: ComputedTheme): StockTheme {
  const swatch: { [key: string]: StockThemeSwatch | undefined } = {
    ...theme.swatch,
  }
  for (const slot of THEME_PALETTE_SLOTS) {
    swatch[slot] = { type: TokenType.DYNAMIC_SWATCH, role: slot }
  }
  return {
    ...theme,
    metadata: {
      ...theme.metadata,
      id: theme.metadata.id as StockTheme["metadata"]["id"],
    },
    swatch: swatch as StockTheme["swatch"],
  }
}

export function toRecomputableStockInput(
  theme: StockTheme | ComputedTheme,
): StockTheme {
  if (isResolvedTheme(theme)) {
    return toRecomputableStock(theme)
  }
  return theme
}
