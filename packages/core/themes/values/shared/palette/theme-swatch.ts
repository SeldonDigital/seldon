import { TokenType } from "../../../constants/token-type"
import type { ThemeInterfaceSwatchId } from "../../../types/theme-token-ids"
import type { ThemeSwatchParameters } from "./theme-swatch-parameters"

/** Resolved or author-fixed swatch color. */
export interface ThemeSwatch {
  type: TokenType.SWATCH
  name?: string
  intent?: string
  parameters: ThemeSwatchParameters
}

/**
 * Canonical interface swatch slots. Authored fixed colors that stay slot-stable
 * across themes. `background` is part of this group. Missing slots fall back to
 * the Seldon interface defaults during `computeTheme`.
 */
export const THEME_INTERFACE_SLOTS = [
  "foreground",
  "background",
  "active",
  "punch",
  "positive",
  "negative",
  "warning",
  "accent",
  "offBlack",
  "offWhite",
] as const satisfies readonly ThemeInterfaceSwatchId[]

/** Slots filled from `getDynamicSwatchColors` during `computeTheme`. */
export type ThemePaletteSlot =
  | "white"
  | "gray"
  | "black"
  | "primary"
  | "swatch1"
  | "swatch2"
  | "swatch3"
  | "swatch4"

/** Canonical palette slots resolved via `getDynamicSwatchColors` in `computeTheme`. */
export const THEME_PALETTE_SLOTS = [
  "white",
  "gray",
  "black",
  "primary",
  "swatch1",
  "swatch2",
  "swatch3",
  "swatch4",
] as const satisfies readonly ThemePaletteSlot[]

/** Authoring-only: palette role resolved from harmony / neutrals at compute time. */
export interface StockSwatchDynamic {
  type: TokenType.DYNAMIC_SWATCH
  role: ThemePaletteSlot
  intent?: string
}

/** Swatch cell on `StockTheme`: fixed color or dynamic palette slot. */
export type StockThemeSwatch = ThemeSwatch | StockSwatchDynamic
