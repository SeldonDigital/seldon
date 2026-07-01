import { computeTheme } from "../helpers/compute-theme"
import type { ComputedTheme, StockTheme } from "../types/theme"
import type { ThemeTemplateId } from "../types/theme-id"
import { theme as earthStock } from "./earth"
import { theme as highContrastStock } from "./high-contrast"
import { theme as industrialStock } from "./industrial"
import { theme as materialStock } from "./material"
import { theme as popPunkStock } from "./pop-punk"
import { theme as royalAzureStock } from "./royal-azure"
import { theme as defaultStock } from "./seldon"
import { theme as skyStock } from "./sky"
import { theme as sunsetBlueStock } from "./sunset-blue"
import { theme as wildberryStock } from "./wildberry"

/** Packaged stock theme definitions (`catalog/*.ts`), display order. */
export const STOCK_THEMES: StockTheme[] = [
  defaultStock,
  earthStock,
  highContrastStock,
  industrialStock,
  materialStock,
  popPunkStock,
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

/** Computed Seldon theme, the shipped default preset. */
export const defaultTheme: ComputedTheme = computeTheme(defaultStock)

export { computeTheme }
