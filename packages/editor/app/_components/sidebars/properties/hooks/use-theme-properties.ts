import { useCallback } from "react"
import {
  FontParameters,
  HSL,
  Harmony,
  Ratio,
  ScrollbarParameters,
  ThemeBackgroundId,
  ThemeBorderId,
  ThemeBorderWidthId,
  ThemeCustomSwatchId,
  ThemeDimensionId,
  ThemeFontFamilyId,
  ThemeFontId,
  ThemeFontSizeId,
  ThemeGradientId,
  ThemeLineHeightId,
  ThemeScrollbarId,
  ThemeShadowId,
  ThemeSizeId,
  ThemeSpacingId,
  Unit,
  ValueType,
} from "@seldon/core"
import { toHSLString } from "@seldon/core/helpers/color/convert-color"
import { getHSLComponents } from "@lib/properties-ui/get-hsl-components"
import { serializeColor } from "@lib/properties-ui/serialize-color"
import { serializeValue } from "@lib/properties-ui/serialize-value"
import { useThemeEntryEditor } from "@lib/themes/use-theme-entry-editor"
import type { EntryThemeId } from "@seldon/core/workspace/types"
import { FlatProperty } from "../helpers/properties-data"

/**
 * Maps theme property panel edits to `set_theme_override` on the active theme entry.
 */
export function useThemeProperties(themeEntryId: EntryThemeId | null) {
  const {
    setCoreRatio,
    setCoreSize,
    setCoreFontSize,
    setBaseColor,
    setHarmony,
    setColorValue,
    setFontFamilyValue,
    setSizeValue,
    setDimensionValue,
    setMarginValue,
    setPaddingValue,
    setGapValue,
    setFontSizeValue,
    setLineHeightValue,
    setFontWeightValue,
    setBorderWidthValue,
    setCornersValue,
    setShadowValue,
    setBorderValue,
    setBlurValue,
    setSpreadValue,
    setGradientValue,
    setBackgroundValue,
    setScrollbarValue,
    setFontValue,
    addCustomSwatch,
    removeCustomSwatch,
    setSwatchValue,
    setSwatchName,
  } = useThemeEntryEditor(themeEntryId)

  const updateThemeProperty = useCallback(
    (property: FlatProperty, newValue: string) => {
      const key = property.key

      // Core properties
      if (key === "core.ratio") {
        setCoreRatio(Number(newValue) as Ratio)
        return
      }
      if (key === "core.fontSize") {
        setCoreFontSize(Number(newValue))
        return
      }
      if (key === "core.size") {
        setCoreSize(Number(newValue))
        return
      }

      // Color properties
      if (key === "color.baseColor") {
        const hsl = getHSLComponents(toHSLString(newValue))
        setBaseColor(hsl)
        return
      }
      if (key === "color.harmony") {
        setHarmony(Number(newValue) as Harmony)
        return
      }
      if (
        key.startsWith("color.") &&
        (key.includes("angle") ||
          key.includes("step") ||
          key.includes("Point") ||
          key.includes("bleed") ||
          key.includes("contrastRatio"))
      ) {
        const colorKey = key.split(".")[1] as
          | "angle"
          | "step"
          | "whitePoint"
          | "grayPoint"
          | "blackPoint"
          | "bleed"
          | "contrastRatio"
        
        // Extract numeric value - handle both plain strings and serialized unit objects
        let numericValue: number
        try {
          // Try parsing as JSON first (in case it's a serialized unit object)
          const parsed = JSON.parse(newValue)
          if (typeof parsed === "object" && parsed !== null && "value" in parsed) {
            numericValue = Number(parsed.value)
          } else {
            numericValue = Number(newValue)
          }
        } catch {
          // Not JSON, parse as plain number string
          // Remove any unit suffixes like " %", "px", etc.
          const cleanedValue = newValue.replace(/\s*(%|px|rem|deg|em|vw|vh)\s*$/i, "").trim()
          numericValue = Number(cleanedValue)
        }
        
        // Validate that we got a valid number
        if (isNaN(numericValue)) {
          console.warn(`Invalid numeric value for ${key}: ${newValue}`)
          return
        }
        
        setColorValue(colorKey, numericValue)
        return
      }

      // Font Family properties
      if (key === "fontFamily.primary") {
        setFontFamilyValue("primary", newValue)
        return
      }
      if (key === "fontFamily.secondary") {
        setFontFamilyValue("secondary", newValue)
        return
      }

      // Swatch properties (custom swatches need special handling)
      if (key.startsWith("swatch.")) {
        const swatchId = key.split(".")[1] as ThemeCustomSwatchId
        // For now, we'll need to handle swatch updates differently
        // This would require getting the current swatch and updating it
        console.warn("Swatch updates not yet implemented in Properties Sidebar")
        return
      }

      // Modulation value sections (size, dimension, margin, padding, gap, fontSize, etc.)
      if (key.includes(".step")) {
        const parts = key.split(".")
        const section = parts[0]
        const subKey = parts[1] as string

        if (section === "size") {
          setSizeValue(subKey as ThemeSizeId, Number(newValue))
          return
        }
        if (section === "dimension") {
          setDimensionValue(subKey as ThemeDimensionId, Number(newValue))
          return
        }
        if (section === "margin") {
          setMarginValue(subKey as ThemeSpacingId, Number(newValue))
          return
        }
        if (section === "padding") {
          setPaddingValue(subKey as ThemeSpacingId, Number(newValue))
          return
        }
        if (section === "gap") {
          setGapValue(subKey as ThemeSpacingId, Number(newValue))
          return
        }
        if (section === "fontSize") {
          setFontSizeValue(subKey as ThemeFontSizeId, Number(newValue))
          return
        }
        if (section === "lineHeight") {
          setLineHeightValue(subKey as ThemeLineHeightId, Number(newValue))
          return
        }
        if (section === "borderWidth") {
          setBorderWidthValue(subKey as ThemeBorderWidthId, Number(newValue))
          return
        }
        if (section === "corners") {
          setCornersValue(subKey as ThemeSpacingId, Number(newValue))
          return
        }
        if (section === "blur") {
          setBlurValue(subKey as ThemeSizeId, Number(newValue))
          return
        }
        if (section === "spread") {
          setSpreadValue(subKey as ThemeSizeId, Number(newValue))
          return
        }
      }

      // Font Weight
      if (key.startsWith("fontWeight.")) {
        const fontWeightKey = key.split(".")[1]
        setFontWeightValue(fontWeightKey as ThemeFontId, Number(newValue))
        return
      }

      // Shadow properties
      if (key.startsWith("shadow.")) {
        const parts = key.split(".")
        const shadowId = parts[1] as ThemeShadowId
        const subProperty = parts[2]

        if (subProperty === "offsetX") {
          setShadowValue(shadowId, {
            offsetX: serializeValue(newValue, { defaultUnit: Unit.PX }) as any,
          })
          return
        }
        if (subProperty === "offsetY") {
          setShadowValue(shadowId, {
            offsetY: serializeValue(newValue, { defaultUnit: Unit.PX }) as any,
          })
          return
        }
        if (subProperty === "blur") {
          setShadowValue(shadowId, {
            blur: serializeValue(newValue) as any,
          })
          return
        }
        if (subProperty === "spread") {
          setShadowValue(shadowId, {
            spread: serializeValue(newValue) as any,
          })
          return
        }
        if (subProperty === "color") {
          setShadowValue(shadowId, { color: serializeColor(newValue) as any })
          return
        }
      }

      // Border properties
      if (key.startsWith("border.")) {
        const parts = key.split(".")
        const borderId = parts[1] as ThemeBorderId
        const subProperty = parts[2]

        if (subProperty === "width") {
          setBorderValue(borderId, { width: newValue })
          return
        }
        if (subProperty === "style") {
          setBorderValue(borderId, { style: newValue })
          return
        }
        if (subProperty === "color") {
          setBorderValue(borderId, { color: newValue })
          return
        }
      }

      // Background properties
      if (key.startsWith("background.") && key.includes("color")) {
        const parts = key.split(".")
        const backgroundId = parts[1] as ThemeBackgroundId
        setBackgroundValue(backgroundId, { color: newValue })
        return
      }

      // Gradient properties
      if (key.startsWith("gradient.")) {
        const parts = key.split(".")
        const gradientId = parts[1] as ThemeGradientId
        const subProperty = parts[2]

        if (subProperty === "angle") {
          setGradientValue(gradientId, { angle: Number(newValue) })
          return
        }
        if (subProperty === "startColor") {
          setGradientValue(gradientId, { startColor: newValue })
          return
        }
        if (subProperty === "endColor") {
          setGradientValue(gradientId, { endColor: newValue })
          return
        }
      }

      // Font properties (font presets)
      if (key.startsWith("font.")) {
        const parts = key.split(".")
        const fontId = parts[1] as ThemeFontId
        const subProperty = parts[2]

        const update: Partial<FontParameters> = {}
        if (subProperty === "family") {
          update.family = serializeValue(newValue) as FontParameters["family"]
          setFontValue(fontId, update)
          return
        }
        if (subProperty === "size") {
          update.size = serializeValue(newValue) as FontParameters["size"]
          setFontValue(fontId, update)
          return
        }
        if (subProperty === "weight") {
          update.weight = serializeValue(newValue) as FontParameters["weight"]
          setFontValue(fontId, update)
          return
        }
        if (subProperty === "lineHeight") {
          update.lineHeight = serializeValue(newValue) as FontParameters["lineHeight"]
          setFontValue(fontId, update)
          return
        }
      }

      // Scrollbar properties
      if (key.startsWith("scrollbar.")) {
        const parts = key.split(".")
        const scrollbarId = parts[1] as ThemeScrollbarId
        const subProperty = parts[2]

        const update: Partial<ScrollbarParameters> = {}
        if (subProperty === "trackSize") {
          update.trackSize = serializeValue(newValue) as ScrollbarParameters["trackSize"]
          setScrollbarValue(scrollbarId, update)
          return
        }
        if (subProperty === "trackColor") {
          update.trackColor = serializeColor(newValue) as ScrollbarParameters["trackColor"]
          setScrollbarValue(scrollbarId, update)
          return
        }
        if (subProperty === "thumbColor") {
          update.thumbColor = serializeColor(newValue) as ScrollbarParameters["thumbColor"]
          setScrollbarValue(scrollbarId, update)
          return
        }
        if (subProperty === "thumbHoverColor") {
          update.thumbHoverColor = serializeColor(newValue) as ScrollbarParameters["thumbHoverColor"]
          setScrollbarValue(scrollbarId, update)
          return
        }
        if (subProperty === "rounded") {
          update.rounded = newValue === "true" || newValue === "On"
          setScrollbarValue(scrollbarId, update)
          return
        }
      }

      console.warn(`Unhandled theme property: ${key}`)
    },
    [
      setCoreRatio,
      setCoreSize,
      setCoreFontSize,
      setBaseColor,
      setHarmony,
      setColorValue,
      setFontFamilyValue,
      setSizeValue,
      setDimensionValue,
      setMarginValue,
      setPaddingValue,
      setGapValue,
      setFontSizeValue,
      setLineHeightValue,
      setFontWeightValue,
      setBorderWidthValue,
      setCornersValue,
      setShadowValue,
      setBorderValue,
      setBlurValue,
      setSpreadValue,
      setGradientValue,
      setBackgroundValue,
      setScrollbarValue,
      setFontValue,
    ],
  )

  return { updateThemeProperty }
}
