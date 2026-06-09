import { computeTheme } from "../helpers/compute-theme"
import type { ComputedTheme, StockTheme } from "../types/theme"
import type { ThemeTemplateId } from "../types/theme-id"
import earthStock from "./earth"
import highContrastStock from "./high-contrast"
import industrialStock from "./industrial"
import materialStock from "./material"
import popStock from "./pop"
import royalAzureStock from "./royal-azure"
import defaultStock, { defaultTheme } from "./seldon"
import skyStock from "./sky"
import sunsetBlueStock from "./sunset-blue"
import wildberryStock from "./wildberry"

/** Packaged stock theme definitions (`catalog/*.ts`), display order. */
export const STOCK_THEMES: StockTheme[] = [
  defaultStock,
  earthStock,
  highContrastStock,
  industrialStock,
  materialStock,
  popStock,
  royalAzureStock,
  skyStock,
  sunsetBlueStock,
  wildberryStock,
]

export const STOCK_THEMES_BY_ID = Object.fromEntries(
  STOCK_THEMES.map((t) => [t.metadata.id, t]),
) as Record<ThemeTemplateId, StockTheme>

/** Computed packaged themes, same order as `STOCK_THEMES`. */
export const THEMES: ComputedTheme[] = STOCK_THEMES.map(computeTheme)

export const THEMES_BY_ID = Object.fromEntries(
  THEMES.map((theme) => [theme.id, theme]),
) as Record<ThemeTemplateId, ComputedTheme>

export { computeTheme }
export { defaultTheme }
