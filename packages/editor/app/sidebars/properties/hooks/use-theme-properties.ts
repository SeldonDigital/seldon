import { serializeColor } from "@lib/properties/serialize-color"
import { serializeValue } from "@lib/properties/serialize-value"
import { useCallback } from "react"
import {
  HSL,
  Harmony,
  LOOK_FACETS,
  type LookFacetEntry,
  Ratio,
  type ScaleTokenInput,
  type ScaleTokenSection,
  ThemeCustomSwatchId,
  ThemeFontId,
  ThemeLineHeightId,
  Unit,
  isBridgedLookFacet,
  isLookSection,
} from "@seldon/core"
import {
  parseHSLString,
  toHSLString,
} from "@seldon/core/helpers/color/convert-color"
import { getThemeOverridePath } from "@seldon/core/workspace/helpers/themes/theme-override-paths"
import type { EntryThemeId } from "@seldon/core/workspace/types"
import { useThemeEntryEditor } from "@lib/themes/hooks/use-theme-entry-editor"
import { FlatProperty } from "../helpers/properties-data"

/** Scale sections whose `.step` row edits route through `set_theme_scale_slot`. */
const SCALE_SLOT_SECTIONS = new Set<ScaleTokenSection>([
  "size",
  "dimension",
  "margin",
  "padding",
  "gap",
  "corners",
  "fontSize",
  "blur",
  "spread",
  "borderWidth",
])

function isScaleSlotSection(section: string): section is ScaleTokenSection {
  return SCALE_SLOT_SECTIONS.has(section as ScaleTokenSection)
}

/** Computed-section groups handled by the generic `setComputedValue` path. */
const COMPUTED_GENERIC_GROUPS = new Set([
  "matchColor",
  "highContrast",
  "opticalPadding",
  "autoFit",
])

/** Splits a computed-group facet key into its group and facet, or null. */
function parseComputedGroupKey(
  key: string,
): { group: string; facet: string } | null {
  const [group, facet] = key.split(".")
  if (!group || !facet || !COMPUTED_GENERIC_GROUPS.has(group)) return null
  return { group, facet }
}

/** Parses a control value to a finite number, stripping unit suffixes. Null on failure. */
function parseNumericInput(raw: string): number | null {
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed === "object" && parsed !== null && "value" in parsed) {
      const n = Number((parsed as { value: unknown }).value)
      return Number.isFinite(n) ? n : null
    }
  } catch {
    // Not JSON; fall through to plain numeric parsing.
  }
  const cleaned = raw.replace(/\s*(%|px|rem|deg|em|vw|vh)\s*$/i, "").trim()
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

/**
 * Parses a scale `.step` row input. A bare number is a modulated step; a `px`
 * or `rem` suffix makes it an exact length. Returns null for unparseable input.
 */
function parseScaleInput(raw: string): ScaleTokenInput | null {
  const match = /^(-?\d*\.?\d+)\s*(px|rem)?$/i.exec(raw.trim())
  if (!match) return null
  const numeric = parseFloat(match[1]!)
  if (!Number.isFinite(numeric)) return null
  const unit = match[2]?.toLowerCase()
  if (unit === "px") {
    return { kind: "exact", parameters: { unit: Unit.PX, value: numeric } }
  }
  if (unit === "rem") {
    return { kind: "exact", parameters: { unit: Unit.REM, value: numeric } }
  }
  return { kind: "modulated", parameters: { step: numeric } }
}

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
    setComputedValue,
    setFontFamilyValue,
    setLineHeightValue,
    setFontWeightValue,
    setScaleSlot,
    setLookParameter,
    setSwatchValue,
    addCustomToken,
    removeCustomToken,
    renameCustomToken,
    resetOverride,
  } = useThemeEntryEditor(themeEntryId)

  const updateThemeProperty = useCallback(
    (property: FlatProperty, newValue: string) => {
      const key = property.key

      // Modulation group
      if (key === "modulation.ratio") {
        setCoreRatio(Number(newValue) as Ratio)
        return
      }
      if (key === "modulation.baseFontSize") {
        setCoreFontSize(Number(newValue))
        return
      }
      if (key === "modulation.baseSize") {
        setCoreSize(Number(newValue))
        return
      }

      // Color harmony group
      if (key === "colorHarmony.baseColor") {
        const hsl = parseHSLString(toHSLString(newValue))
        setBaseColor(hsl)
        return
      }
      if (key === "colorHarmony.harmony") {
        setHarmony(Number(newValue) as Harmony)
        return
      }
      if (key.startsWith("colorHarmony.")) {
        const colorKey = key.split(".")[1] as
          | "angle"
          | "step"
          | "whitePoint"
          | "grayPoint"
          | "blackPoint"
          | "bleed"
        const numericValue = parseNumericInput(newValue)
        if (numericValue === null) {
          console.warn(`Invalid numeric value for ${key}: ${newValue}`)
          return
        }
        setColorValue(colorKey, numericValue)
        return
      }

      // Font family group
      if (key === "fontFamily.primary") {
        setFontFamilyValue("primary", newValue)
        return
      }
      if (key === "fontFamily.secondary") {
        setFontFamilyValue("secondary", newValue)
        return
      }

      // Other Computed-section groups: matchColor, highContrast,
      // opticalPadding, autoFit. Each facet writes to `parameters[facet]`.
      const computedFacet = parseComputedGroupKey(key)
      if (computedFacet) {
        const { group, facet } = computedFacet
        if (facet === "fallbackColor") {
          setComputedValue(group, facet, serializeColor(newValue))
          return
        }
        if (
          facet === "includeBrightness" ||
          facet === "includeOpacity" ||
          facet === "includeBleed"
        ) {
          setComputedValue(
            group,
            facet,
            newValue === "true" || newValue === "On",
          )
          return
        }
        const numericValue = parseNumericInput(newValue)
        if (numericValue === null) {
          console.warn(`Invalid numeric value for ${key}: ${newValue}`)
          return
        }
        setComputedValue(group, facet, numericValue)
        return
      }

      // Swatch values are stored as HSL objects on the swatch cell. Swatch rows
      // nest under a group: `swatch.<group>.<id>`, so the id is the last segment.
      if (key.startsWith("swatch.")) {
        const swatchId = key
          .split(".")
          .slice(2)
          .join(".") as ThemeCustomSwatchId
        setSwatchValue(swatchId, parseHSLString(toHSLString(newValue)))
        return
      }

      // Scale `.step` rows. A bare number is a modulated step; `px`/`rem` makes
      // the token an exact length. `lineHeight` stays an exact unitless number.
      if (key.includes(".step")) {
        const parts = key.split(".")
        const section = parts[0]!
        const subKey = parts[1] as string

        if (section === "lineHeight") {
          setLineHeightValue(subKey as ThemeLineHeightId, Number(newValue))
          return
        }

        if (isScaleSlotSection(section)) {
          const parsed = parseScaleInput(newValue)
          if (parsed) {
            setScaleSlot(section, subKey, parsed)
          }
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
        const entry = (LOOK_FACETS[section] as readonly LookFacetEntry[]).find(
          (item) => item.facet === facet,
        )
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
      setComputedValue,
      setFontFamilyValue,
      setLineHeightValue,
      setFontWeightValue,
      setScaleSlot,
      setLookParameter,
      setSwatchValue,
    ],
  )

  const resetThemeProperty = useCallback(
    (property: FlatProperty) => {
      const path = getThemeOverridePath(property.key)
      if (!path) return
      resetOverride(path)
    },
    [resetOverride],
  )

  return {
    updateThemeProperty,
    resetThemeProperty,
    addCustomToken,
    removeCustomToken,
    renameCustomToken,
  }
}
