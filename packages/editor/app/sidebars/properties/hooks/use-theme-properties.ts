import { useCallback } from "react"
import {
  HSL,
  Harmony,
  LOOK_FACETS,
  Ratio,
  ThemeBorderWidthId,
  ThemeCustomSwatchId,
  ThemeDimensionId,
  ThemeFontFamilyId,
  ThemeFontId,
  ThemeFontSizeId,
  ThemeLineHeightId,
  ThemeSizeId,
  ThemeSpacingId,
  isBridgedLookFacet,
  isLookSection,
} from "@seldon/core"
import {
  parseHSLString,
  toHSLString,
} from "@seldon/core/helpers/color/convert-color"
import { serializeColor } from "@lib/properties/serialize-color"
import { serializeValue } from "@lib/properties/serialize-value"
import { useThemeEntryEditor } from "@lib/themes/hooks/use-theme-entry-editor"
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
    setBlurValue,
    setSpreadValue,
    setLookParameter,
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
        const hsl = parseHSLString(toHSLString(newValue))
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

      // Look facets (shadow, border, background, gradient, font, scrollbar).
      // Every look section flows through one descriptor-driven path: the facet
      // entry decides how to serialize, then the value merges onto the look's
      // parameters under its facet key.
      const [section, lookId, facet] = key.split(".")
      if (isLookSection(section) && lookId && facet) {
        const entry = LOOK_FACETS[section].find((item) => item.facet === facet)
        if (!entry) {
          console.warn(`Unhandled theme look facet: ${key}`)
          return
        }

        let serialized: unknown
        if (isBridgedLookFacet(entry)) {
          serialized = serializeValue(
            newValue,
            undefined,
            undefined,
            entry.propertyKey,
          )
        } else if (entry.valueType === "color") {
          serialized = serializeColor(newValue)
        } else if (entry.valueType === "boolean") {
          serialized = newValue === "true" || newValue === "On"
        } else {
          serialized = serializeValue(newValue)
        }

        setLookParameter(section, lookId, { [facet]: serialized })
        return
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
      setBlurValue,
      setSpreadValue,
      setLookParameter,
    ],
  )

  return { updateThemeProperty }
}
