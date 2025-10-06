import { Theme } from "@seldon/core"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { modulate } from "@seldon/core/helpers/math/modulate"
import { getPaletteSwatchName } from "@seldon/core/themes/helpers/get-palette-swatch-name"
import { themeService } from "@seldon/core/workspace/services/theme.service"
import { Workspace } from "@seldon/core/workspace/types"

/**
 * Inserts CSS variables for all used themes
 */
export function insertThemeVariables(
  stylesheet: string,
  workspace: Workspace,
): string {
  // Collect all themes used in the workspace
  const usedThemeIds = themeService.collectUsedThemes(workspace)

  let themeCSS = `
  
/********************************************
 *                                          *
 *           Theme variables                *
 *                                          *
 ********************************************/

  `

  usedThemeIds.forEach((themeId) => {
    const theme = themeService.getTheme(themeId, workspace)
    if (theme) {
      themeCSS += generateThemeCSSVariables(theme, themeId)
    }
  })

  stylesheet += `\n/* Theme Variables */\n:root {\n${themeCSS}}\n`

  return stylesheet
}

/**
 * Helper function to ensure unique swatch names by appending numbers when duplicates exist
 */
function ensureUniqueSwatchNames(
  swatchNames: Record<string, string>,
): Record<string, string> {
  const nameCount = new Map<string, number>()
  const result: Record<string, string> = {}

  // First pass: count occurrences of each name
  Object.values(swatchNames).forEach((name) => {
    const currentCount = nameCount.get(name) || 0
    nameCount.set(name, currentCount + 1)
  })

  // Second pass: append numbers to duplicates
  const nameInstanceCount = new Map<string, number>()
  Object.entries(swatchNames).forEach(([key, name]) => {
    if (nameCount.get(name)! > 1) {
      const instanceCount = (nameInstanceCount.get(name) || 0) + 1
      nameInstanceCount.set(name, instanceCount)
      result[key] = `${name}${instanceCount}`
    } else {
      result[key] = name
    }
  })

  return result
}

/**
 * Generates CSS variables for a theme's tokens with --sdn-<themeid>- prefix
 */
function generateThemeCSSVariables(theme: Theme, themeId: string): string {
  const prefix = themeId === "default" ? `--sdn-` : `--sdn-${themeId}-`
  let cssVariables = ""

  // Add theme label for non-default themes
  if (themeId !== "default") {
    // Convert kebab-case to Title Case for display
    const themeDisplayName = themeId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    cssVariables += `\n  /* Theme: ${themeDisplayName} */\n`
  }

  // Core values
  if (theme.core) {
    cssVariables += `  /* Core */\n`
    cssVariables += `  ${prefix}ratio: ${theme.core.ratio};\n`
    cssVariables += `  ${prefix}font-size: ${theme.core.fontSize}px;\n`
    cssVariables += `  ${prefix}size: ${theme.core.size};\n`
  }

  // Font families
  if (theme.fontFamily) {
    cssVariables += `  /* Font Families */\n`
    cssVariables += `  ${prefix}font-family-primary: "${theme.fontFamily.primary}";\n`
    cssVariables += `  ${prefix}font-family-secondary: "${theme.fontFamily.secondary}";\n`
  }

  // Color values
  cssVariables += `  /* Colors */\n`
  cssVariables += `  ${prefix}color-base-hue: ${theme.color.baseColor.hue};\n`
  cssVariables += `  ${prefix}color-base-saturation: ${theme.color.baseColor.saturation}%;\n`
  cssVariables += `  ${prefix}color-base-lightness: ${theme.color.baseColor.lightness}%;\n`
  cssVariables += `  ${prefix}color-harmony: ${theme.color.harmony};\n`
  cssVariables += `  ${prefix}color-angle: ${theme.color.angle}deg;\n`
  cssVariables += `  ${prefix}color-step: ${theme.color.step};\n`
  cssVariables += `  ${prefix}color-white-point: ${theme.color.whitePoint}%;\n`
  cssVariables += `  ${prefix}color-gray-point: ${theme.color.grayPoint}%;\n`
  cssVariables += `  ${prefix}color-black-point: ${theme.color.blackPoint}%;\n`
  cssVariables += `  ${prefix}color-bleed: ${theme.color.bleed};\n`
  cssVariables += `  ${prefix}color-contrast-ratio: ${theme.color.contrastRatio};\n`

  // Swatch tokens - as single color values using HSLObjectToString
  cssVariables += `  /* Swatches */\n`

  // First, collect all swatch names to handle duplicates
  const swatchNames: Record<string, string> = {}
  Object.entries(theme.swatch).forEach(([key, value]) => {
    if (key.startsWith("custom")) {
      // Use the swatch name for custom swatches
      swatchNames[key] = value.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    } else if (
      key === "swatch1" ||
      key === "swatch2" ||
      key === "swatch3" ||
      key === "swatch4"
    ) {
      // Use computed palette names for swatch1-4
      const paletteName = getPaletteSwatchName(
        key as "swatch1" | "swatch2" | "swatch3" | "swatch4",
        theme,
      )
      swatchNames[key] = paletteName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    } else {
      // Use the key for other swatches (background, white, gray, black, primary)
      swatchNames[key] = key
    }
  })

  // Ensure unique names by appending numbers to duplicates
  const uniqueSwatchNames = ensureUniqueSwatchNames(swatchNames)

  // Generate CSS variables
  Object.entries(theme.swatch).forEach(([key, value]) => {
    const colorString = HSLObjectToString(value.value)
    const swatchName = uniqueSwatchNames[key]
    cssVariables += `  ${prefix}swatch-${swatchName}: ${colorString};\n`
  })

  // Size tokens - using calculated values
  cssVariables += `  /* Sizes */\n`
  Object.entries(theme.size).forEach(([key, value]) => {
    const calculatedSize = modulate({
      ratio: theme.core.ratio,
      size: theme.core.size,
      step: value.parameters.step,
    })
    cssVariables += `  ${prefix}size-${key}: ${calculatedSize}rem;\n`
  })

  // Spacing tokens - using calculated values
  cssVariables += `  /* Margins */\n`
  Object.entries(theme.margin).forEach(([key, value]) => {
    const calculatedMargin = modulate({
      ratio: theme.core.ratio,
      size: theme.core.size,
      step: value.parameters.step,
    })
    cssVariables += `  ${prefix}margin-${key}: ${calculatedMargin}rem;\n`
  })

  cssVariables += `  /* Paddings */\n`
  Object.entries(theme.padding).forEach(([key, value]) => {
    const calculatedPadding = modulate({
      ratio: theme.core.ratio,
      size: theme.core.size,
      step: value.parameters.step,
    })
    cssVariables += `  ${prefix}padding-${key}: ${calculatedPadding}rem;\n`
  })

  cssVariables += `  /* Gaps */\n`
  Object.entries(theme.gap).forEach(([key, value]) => {
    const calculatedGap = modulate({
      ratio: theme.core.ratio,
      size: theme.core.size,
      step: value.parameters.step,
    })
    cssVariables += `  ${prefix}gap-${key}: ${calculatedGap}rem;\n`
  })

  // Corner tokens - using calculated values
  cssVariables += `  /* Corners */\n`
  Object.entries(theme.corners).forEach(([key, value]) => {
    const calculatedCorner = modulate({
      ratio: theme.core.ratio,
      size: theme.core.size,
      step: value.parameters.step,
    })
    cssVariables += `  ${prefix}corners-${key}: ${calculatedCorner}rem;\n`
  })

  // Font size tokens - using calculated values
  cssVariables += `  /* Font Sizes */\n`
  Object.entries(theme.fontSize).forEach(([key, value]) => {
    const calculatedFontSize = modulate({
      ratio: theme.core.ratio,
      size: theme.core.fontSize / 16, // Convert to rem base
      step: value.parameters.step,
    })
    cssVariables += `  ${prefix}font-size-${key}: ${calculatedFontSize}rem;\n`
  })

  // Font weight tokens
  cssVariables += `  /* Font Weights */\n`
  Object.entries(theme.fontWeight).forEach(([key, value]) => {
    cssVariables += `  ${prefix}font-weight-${key}: ${value.value};\n`
  })

  // Line height tokens
  cssVariables += `  /* Line Heights */\n`
  Object.entries(theme.lineHeight).forEach(([key, value]) => {
    cssVariables += `  ${prefix}line-height-${key}: ${value.value};\n`
  })

  // Border width tokens - using calculated values
  cssVariables += `  /* Border Widths */\n`
  Object.entries(theme.borderWidth).forEach(([key, value]) => {
    if ("parameters" in value) {
      const calculatedBorderWidth = modulate({
        ratio: theme.core.ratio,
        size: theme.core.size,
        step: value.parameters.step,
      })
      cssVariables += `  ${prefix}border-width-${key}: ${calculatedBorderWidth}rem;\n`
    }
  })
  return cssVariables
}
