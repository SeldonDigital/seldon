import { Theme } from "@seldon/core"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { modulate } from "@seldon/core/helpers/math/modulate"
import {
  colorspaceLiteralToHsl,
  getOppositeModeSwatches,
} from "@seldon/core/themes/compute"
import { Colorspace } from "@seldon/core/themes/constants/colorspace"
import { isModulatedToken, isThemeExactToken } from "@seldon/core/themes/values"
import type { ThemeScaleToken, ThemeSwatch } from "@seldon/core/themes/values"
import { workspaceThemeService } from "@seldon/core/workspace/services"
import { Workspace } from "@seldon/core/workspace/types"

import {
  emitComputedThemeVariables,
  emitHighContrastVariables,
} from "../../../styles/computed-variables"
import { getThemeSwatchVarNames } from "../../../styles/css-properties/get-theme-swatch-names"
import { format } from "../utils/format"
import { getThemeSlug } from "./get-theme-slug"

function swatchToCssString(swatch: ThemeSwatch): string {
  const { parameters } = swatch
  if (parameters.colorspace === Colorspace.HSL) {
    return HSLObjectToString(parameters.value)
  }
  if (parameters.colorspace === Colorspace.HEX) {
    return parameters.value
  }
  if (parameters.colorspace === Colorspace.NAME) {
    return parameters.value
  }
  return String(parameters.value)
}

function exactTokenCss(token: ThemeScaleToken): string {
  if (isThemeExactToken(token)) {
    const { unit, value } = token.parameters
    if (unit === "number") {
      return String(value)
    }
    if (unit === "rem" || unit === "px") {
      return `${value}${unit}`
    }
    if (unit === "%") {
      return `${value}%`
    }
    if (unit === "deg") {
      return `${value}deg`
    }
  }
  return "0"
}

function generateThemeCSSVariables(theme: Theme, slug: string): string {
  // Every theme defines the same unprefixed variable names. The stylesheet
  // scopes them by `[data-theme]`, so a consumer switches the active theme by
  // setting that attribute rather than by rewriting component references.
  const prefix = `--sdn-`
  let cssVariables = ""

  if (slug !== "seldon") {
    const themeDisplayName = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    cssVariables += `\n  /* Theme: ${themeDisplayName} */\n`
  }

  if (theme.modulation) {
    const modulation = theme.modulation.parameters
    cssVariables += `  /* Modulation */\n`
    cssVariables += `  ${prefix}ratio: ${modulation.ratio};\n`
    cssVariables += `  ${prefix}font-size: ${modulation.baseFontSize}px;\n`
    cssVariables += `  ${prefix}size: ${modulation.baseSize};\n`
  }

  if (theme.fontFamily) {
    // TODO: font collections are not yet refactored in core. For now emit the
    // raw font stack stored on each family token.
    cssVariables += `  /* Font Families */\n`
    cssVariables += `  ${prefix}font-family-primary: ${theme.fontFamily.parameters.primary.parameters};\n`
    cssVariables += `  ${prefix}font-family-secondary: ${theme.fontFamily.parameters.secondary.parameters};\n`
  }

  const harmony = theme.colorHarmony.parameters
  const baseHsl = colorspaceLiteralToHsl(harmony.baseColor)
  cssVariables += `  /* Colors */\n`
  cssVariables += `  ${prefix}color-base-hue: ${baseHsl.hue};\n`
  cssVariables += `  ${prefix}color-base-saturation: ${baseHsl.saturation}%;\n`
  cssVariables += `  ${prefix}color-base-lightness: ${baseHsl.lightness}%;\n`
  cssVariables += `  ${prefix}color-harmony: ${harmony.harmony};\n`
  cssVariables += `  ${prefix}color-angle: ${harmony.angle}deg;\n`
  cssVariables += `  ${prefix}color-step: ${harmony.step};\n`
  cssVariables += `  ${prefix}color-white-point: ${harmony.whitePoint}%;\n`
  cssVariables += `  ${prefix}color-gray-point: ${harmony.grayPoint}%;\n`
  cssVariables += `  ${prefix}color-black-point: ${harmony.blackPoint}%;\n`
  cssVariables += `  ${prefix}color-bleed: ${harmony.bleed};\n`
  cssVariables += `  ${prefix}color-mode: ${harmony.mode};\n`
  cssVariables += `  ${prefix}color-chroma-change: ${harmony.chromaChange}%;\n`
  cssVariables += `  ${prefix}color-contrast-ratio: ${theme.highContrast.parameters.contrastRatio};\n`

  cssVariables += `  /* Swatches */\n`

  const uniqueSwatchNames = getThemeSwatchVarNames(theme)

  Object.entries(theme.swatch).forEach(([key, value]) => {
    if (!value) return
    const colorString = swatchToCssString(value)
    const swatchName = uniqueSwatchNames[key]
    cssVariables += `  ${prefix}swatch-${swatchName}: ${colorString};\n`
  })

  const writeModulatedScale = (
    label: string,
    table: Record<string, ThemeScaleToken | undefined>,
    unitSuffix: "rem" = "rem",
  ) => {
    cssVariables += `  /* ${label} */\n`
    Object.entries(table).forEach(([key, value]) => {
      if (!value) return
      if (isModulatedToken(value)) {
        const resolved =
          value.value ??
          modulate({
            ratio: theme.modulation.parameters.ratio,
            size: theme.modulation.parameters.baseSize,
            step: value.parameters.step,
          })
        cssVariables += `  ${prefix}${label.toLowerCase()}-${key}: ${resolved}${unitSuffix};\n`
        return
      }
      cssVariables += `  ${prefix}${label.toLowerCase()}-${key}: ${exactTokenCss(value)};\n`
    })
  }

  writeModulatedScale("Sizes", theme.size)
  writeModulatedScale("Margins", theme.margin)
  writeModulatedScale("Paddings", theme.padding)
  writeModulatedScale("Gaps", theme.gap)
  writeModulatedScale("Corners", theme.corners)

  cssVariables += `  /* Font Sizes */\n`
  Object.entries(theme.fontSize).forEach(([key, value]) => {
    if (!value) return
    if (isModulatedToken(value)) {
      const calculatedFontSize =
        value.value ??
        modulate({
          ratio: theme.modulation.parameters.ratio,
          size: theme.modulation.parameters.baseFontSize / 16,
          step: value.parameters.step,
        })
      cssVariables += `  ${prefix}font-size-${key}: ${calculatedFontSize}rem;\n`
      return
    }
    cssVariables += `  ${prefix}font-size-${key}: ${exactTokenCss(value)};\n`
  })

  cssVariables += `  /* Font Weights */\n`
  Object.entries(theme.fontWeight).forEach(([key, value]) => {
    if (!value) return
    cssVariables += `  ${prefix}font-weight-${key}: ${exactTokenCss(value)};\n`
  })

  cssVariables += `  /* Line Heights */\n`
  Object.entries(theme.lineHeight).forEach(([key, value]) => {
    if (!value) return
    cssVariables += `  ${prefix}line-height-${key}: ${exactTokenCss(value)};\n`
  })

  cssVariables += `  /* Border Widths */\n`
  Object.entries(theme.borderWidth).forEach(([key, value]) => {
    if (!value || !isModulatedToken(value)) return
    const calculatedBorderWidth =
      value.value ??
      modulate({
        ratio: theme.modulation.parameters.ratio,
        size: theme.modulation.parameters.baseSize,
        step: value.parameters.step,
      })
    cssVariables += `  ${prefix}border-width-${key}: ${calculatedBorderWidth}rem;\n`
  })

  // Computed functions that bake a derived per-theme value (high contrast, auto
  // fit, optical padding) publish their own variable families here, scoped by the
  // same `[data-theme]` selector, so a computed value swaps with the active theme
  // just like a token. Match Color needs none because it reuses swatch variables.
  cssVariables += emitComputedThemeVariables(theme)

  return cssVariables
}

/**
 * Swatch variables for the mode opposite to the theme's authored `mode`. The
 * neutral pairs (foreground/background, white/black, offBlack/offWhite) swap
 * their authored colors. Every other color moves through LCH: lightness
 * inverts and chroma scales by the theme's `chromaChange` percentage.
 */
function generateOppositeModeCSSVariables(theme: Theme): string {
  const swatches = getOppositeModeSwatches(theme)
  const uniqueSwatchNames = getThemeSwatchVarNames(theme)
  let cssVariables = `  /* Swatches */\n`

  Object.entries(swatches).forEach(([key, hsl]) => {
    const swatchName = uniqueSwatchNames[key]
    if (!swatchName) return
    cssVariables += `  --sdn-swatch-${swatchName}: ${HSLObjectToString(hsl)};\n`
  })

  // Mode switching swaps the authored neutral pairs, so each surface's
  // readable foreground is the partner of the base pick. Re-emit the
  // high-contrast family with every choice flipped.
  cssVariables += emitHighContrastVariables(theme, true)

  return cssVariables
}

export function generateThemeStylesheet(slug: string, theme: Theme): string {
  const variables = generateThemeCSSVariables(theme, slug)

  // The default theme also answers `:root` so unscoped subtrees (and any node
  // that never sets `data-theme`) resolve to it. Every theme, default included,
  // answers its own `[data-theme="{slug}"]` selector so a consumer can switch to
  // it explicitly.
  const selector =
    slug === "seldon"
      ? `:root,\n[data-theme="seldon"]`
      : `[data-theme="${slug}"]`

  // Every theme ships its opposite mode as a swatch-only block behind
  // `data-mode`. Setting `data-mode` to the authored mode matches nothing and
  // falls back to the base block, so consumers always set the resolved mode.
  const mode = theme.colorHarmony.parameters.mode
  const oppositeMode = mode === "dark" ? "light" : "dark"
  const modeSelector =
    slug === "seldon"
      ? `:root[data-mode="${oppositeMode}"],\n[data-theme="seldon"][data-mode="${oppositeMode}"]`
      : `[data-theme="${slug}"][data-mode="${oppositeMode}"]`
  const modeVariables = generateOppositeModeCSSVariables(theme)

  return `${selector} {\n${variables}}\n\n${modeSelector} {\n${modeVariables}}\n`
}

export type ThemeStylesheetFile = {
  themeId: string
  path: string
  content: string
}

export async function generateThemeStylesheetFiles(
  workspace: Workspace,
  componentsFolder: string,
): Promise<ThemeStylesheetFile[]> {
  const themeIds = Object.keys(workspace.themes ?? {})
  if (themeIds.length === 0) {
    themeIds.push("seldon")
  }

  const files: ThemeStylesheetFile[] = []

  for (const themeId of themeIds) {
    const theme = workspaceThemeService.getTheme(themeId, workspace)
    if (!theme) continue

    const slug = getThemeSlug(themeId, workspace)
    const content = await format(generateThemeStylesheet(slug, theme))

    files.push({
      themeId,
      path: `${componentsFolder}/styles-${slug}.css`,
      content,
    })
  }

  return files
}
