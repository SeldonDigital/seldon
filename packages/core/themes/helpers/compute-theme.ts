import { theme as seldonStockTheme } from "../catalog/seldon"
import { getDynamicSwatchColors } from "../compute/get-dynamic-swatch-color"
import { getDynamicSwatchName } from "../compute/get-dynamic-swatch-names"
import { normalizeThemeInput } from "../compute/normalize-theme"
import { Colorspace } from "../constants/colorspace"
import { injectBuiltInLooks } from "../looks/built-in-looks"
import type { ComputedTheme, StockTheme } from "../types/theme"
import type { ThemeInterfaceSwatchId } from "../types/theme-token-ids"
import type { ThemePaletteSlot, ThemeSwatch } from "../values"
import { THEME_INTERFACE_SLOTS, TokenType } from "../values"
import { isDynamicSwatchToken, isSwatchToken } from "../values"
import { toRecomputableStockInput } from "./to-recomputable-stock"

let seldonInterfaceDefaults:
  | Partial<Record<ThemeInterfaceSwatchId, ThemeSwatch>>
  | undefined

/**
 * Interface swatch cells read from the Seldon catalog, used to fill any
 * interface slot a theme does not author. Read lazily and memoized: the Seldon
 * catalog imports `computeTheme`, so the catalog `theme` is only safe to touch
 * at call time, after its module finished evaluating.
 */
function getSeldonInterfaceDefaults(): Partial<
  Record<ThemeInterfaceSwatchId, ThemeSwatch>
> {
  if (!seldonInterfaceDefaults) {
    const defaults: Partial<Record<ThemeInterfaceSwatchId, ThemeSwatch>> = {}
    const seldonSwatch = seldonStockTheme.swatch as Record<
      string,
      ThemeSwatch | undefined
    >
    for (const id of THEME_INTERFACE_SLOTS) {
      const cell = seldonSwatch[id]
      if (cell && isSwatchToken(cell)) defaults[id] = cell
    }
    seldonInterfaceDefaults = defaults
  }
  return seldonInterfaceDefaults
}

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

  // Fill any interface slot the theme did not author from the Seldon defaults, so
  // every computed theme exposes the full interface vocabulary and node refs like
  // `@swatch.active` resolve on every theme.
  const interfaceDefaults = getSeldonInterfaceDefaults()
  for (const id of THEME_INTERFACE_SLOTS) {
    if (!resolvedSwatch[id]) {
      const fallback = interfaceDefaults[id]
      if (fallback) resolvedSwatch[id] = fallback
    }
  }

  // `injectBuiltInLooks` fills the reserved look ids (including the `normal`
  // font) at runtime, so the materialized object satisfies `ComputedTheme`
  // even though the generic return type mirrors the stock input shape.
  return injectBuiltInLooks({
    ...normalized,
    id: normalized.metadata.id,
    swatch: resolvedSwatch as ComputedTheme["swatch"],
  }) as ComputedTheme
}
