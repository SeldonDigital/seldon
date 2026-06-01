import { Theme } from "@seldon/core"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { modulate } from "@seldon/core/helpers/math/modulate"
import { Colorspace } from "@seldon/core/themes/constants/colorspace"
import { colorspaceLiteralToHsl } from "@seldon/core/themes/compute"
import {
  isModulatedToken,
  isThemeExactToken,
} from "@seldon/core/themes/values"
import type { ThemeScaleToken, ThemeSwatch } from "@seldon/core/themes/values"
import { workspaceThemeService } from "@seldon/core/workspace/services"
import { Workspace } from "@seldon/core/workspace/types"
import { kebabCase } from "../../react/utils/case-utils"
import { getThemeSwatchVarNames } from "../../../styles/css-properties/get-theme-swatch-names"
import { format } from "../utils/format"

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

function generateThemeCSSVariables(theme: Theme, themeId: string): string {
  const prefix = themeId === "default" ? `--sdn-` : `--sdn-${themeId}-`
  let cssVariables = ""

  if (themeId !== "default") {
    const themeDisplayName = themeId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    cssVariables += `\n  /* Theme: ${themeDisplayName} */\n`
  }

  if (theme.core) {
    cssVariables += `  /* Core */\n`
    cssVariables += `  ${prefix}ratio: ${theme.core.ratio};\n`
    cssVariables += `  ${prefix}font-size: ${theme.core.fontSize}px;\n`
    cssVariables += `  ${prefix}size: ${theme.core.size};\n`
  }

  if (theme.fontFamily) {
    // TODO: font collections are not yet refactored in core. For now emit the
    // raw font stack stored on each family token.
    cssVariables += `  /* Font Families */\n`
    cssVariables += `  ${prefix}font-family-primary: ${theme.fontFamily.primary.parameters};\n`
    cssVariables += `  ${prefix}font-family-secondary: ${theme.fontFamily.secondary.parameters};\n`
  }

  const baseHsl = colorspaceLiteralToHsl(theme.color.baseColor)
  cssVariables += `  /* Colors */\n`
  cssVariables += `  ${prefix}color-base-hue: ${baseHsl.hue};\n`
  cssVariables += `  ${prefix}color-base-saturation: ${baseHsl.saturation}%;\n`
  cssVariables += `  ${prefix}color-base-lightness: ${baseHsl.lightness}%;\n`
  cssVariables += `  ${prefix}color-harmony: ${theme.color.harmony};\n`
  cssVariables += `  ${prefix}color-angle: ${theme.color.angle}deg;\n`
  cssVariables += `  ${prefix}color-step: ${theme.color.step};\n`
  cssVariables += `  ${prefix}color-white-point: ${theme.color.whitePoint}%;\n`
  cssVariables += `  ${prefix}color-gray-point: ${theme.color.grayPoint}%;\n`
  cssVariables += `  ${prefix}color-black-point: ${theme.color.blackPoint}%;\n`
  cssVariables += `  ${prefix}color-bleed: ${theme.color.bleed};\n`
  cssVariables += `  ${prefix}color-contrast-ratio: ${theme.color.contrastRatio};\n`

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
            ratio: theme.core.ratio,
            size: theme.core.size,
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
          ratio: theme.core.ratio,
          size: theme.core.fontSize / 16,
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
        ratio: theme.core.ratio,
        size: theme.core.size,
        step: value.parameters.step,
      })
    cssVariables += `  ${prefix}border-width-${key}: ${calculatedBorderWidth}rem;\n`
  })

  return cssVariables
}

export function generateThemeStylesheet(
  themeId: string,
  theme: Theme,
): string {
  const variables = generateThemeCSSVariables(theme, themeId)
  return `:root {\n${variables}}\n`
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
  const usedThemeIds = workspaceThemeService.collectUsedThemes(workspace)
  const files: ThemeStylesheetFile[] = []

  for (const themeId of usedThemeIds) {
    const theme = workspaceThemeService.getTheme(themeId, workspace)
    if (!theme) continue

    const fileSlug = themeId === "default" ? "default" : kebabCase(themeId)
    const content = await format(generateThemeStylesheet(themeId, theme))

    files.push({
      themeId,
      path: `${componentsFolder}/styles-${fileSlug}.css`,
      content,
    })
  }

  return files
}
