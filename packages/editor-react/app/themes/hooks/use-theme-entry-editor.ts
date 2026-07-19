import { useCallback, useMemo } from "react"
import {
  Colorspace,
  type HSL,
  type Harmony,
  type LookSection,
  type Ratio,
  type ScaleTokenInput,
  type ScaleTokenSection,
  type ThemeBorderWidthId,
  type ThemeCustomSwatchId,
  type ThemeCustomTokenSection,
  type ThemeDimensionId,
  type ThemeFontFamilyId,
  type ThemeFontId,
  type ThemeFontSizeId,
  type ThemeLineHeightId,
  type ThemeMode,
  type ThemeSizeId,
  type ThemeSpacingId,
  type WorkspaceAction,
  buildEmptyCustomTokenPayload,
} from "@seldon/core"
import { getComputedTheme } from "@seldon/core/workspace/compute"
import { getOverrideAtPath } from "@seldon/core/workspace/helpers/general/override-paths"
import { getThemeOverrides } from "@seldon/core/workspace/helpers/themes/get-theme-overrides"
import type { EntryThemeId } from "@seldon/core/workspace/types"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"

function mergeRecord(
  base: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const next = { ...base }
  for (const [key, value] of Object.entries(patch)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      typeof next[key] === "object" &&
      next[key] !== null &&
      !Array.isArray(next[key])
    ) {
      next[key] = mergeRecord(
        next[key] as Record<string, unknown>,
        value as Record<string, unknown>,
      )
    } else {
      next[key] = value
    }
  }
  return next
}

export function useThemeEntryEditor(themeEntryId: EntryThemeId | null) {
  const { dispatch, workspace } = useWorkspace()

  const theme = useMemo(() => {
    if (!themeEntryId) return null
    return getComputedTheme(themeEntryId, workspace)
  }, [themeEntryId, workspace])

  const setOverride = useCallback(
    (path: string, value: unknown) => {
      if (!themeEntryId) return
      dispatch({
        type: "set_theme_override",
        payload: {
          themeId: themeEntryId,
          path,
          value,
        },
      })
    },
    [dispatch, themeEntryId],
  )

  const resetOverride = useCallback(
    (path: string) => {
      if (!themeEntryId) return
      dispatch({
        type: "reset_theme_override",
        payload: {
          themeId: themeEntryId,
          path,
        },
      })
    },
    [dispatch, themeEntryId],
  )

  const mergeOverride = useCallback(
    (path: string, patch: Record<string, unknown>) => {
      if (!themeEntryId) return
      const entry = workspace.themes[themeEntryId]
      if (!entry) return
      const merged = getThemeOverrides(entry, workspace)
      const current =
        (getOverrideAtPath(merged as Record<string, unknown>, path) as
          | Record<string, unknown>
          | undefined) ?? {}
      setOverride(path, mergeRecord(current, patch))
    },
    [setOverride, themeEntryId, workspace],
  )

  const setCoreRatio = useCallback(
    (value: Ratio) => setOverride("modulation.parameters.ratio", value),
    [setOverride],
  )

  const setCoreSize = useCallback(
    (value: number) => setOverride("modulation.parameters.baseSize", value),
    [setOverride],
  )

  const setCoreFontSize = useCallback(
    (value: number) => setOverride("modulation.parameters.baseFontSize", value),
    [setOverride],
  )

  const setBaseColor = useCallback(
    (value: HSL) => setOverride("colorHarmony.parameters.baseColor", value),
    [setOverride],
  )

  const setHarmony = useCallback(
    (value: Harmony) => setOverride("colorHarmony.parameters.harmony", value),
    [setOverride],
  )

  const setColorMode = useCallback(
    (value: ThemeMode) => setOverride("displayMode.parameters.mode", value),
    [setOverride],
  )

  const setColorValue = useCallback(
    (
      key:
        | "angle"
        | "step"
        | "whitePoint"
        | "grayPoint"
        | "blackPoint"
        | "bleed"
        | "chromaChange"
        | "lightnessChange",
      value: number,
    ) => {
      // Chroma and lightness shifts live in the `displayMode` group; the rest
      // are color-harmony inputs.
      const section =
        key === "chromaChange" || key === "lightnessChange"
          ? "displayMode.parameters"
          : "colorHarmony.parameters"
      mergeOverride(section, { [key]: value })
    },
    [mergeOverride],
  )

  const setFontFamilyValue = useCallback(
    (key: ThemeFontFamilyId, value: string) => {
      setOverride(`fontFamily.parameters.${key}`, value)
    },
    [setOverride],
  )

  /** Sets one facet on a Computed-section group (matchColor, highContrast, etc.). */
  const setComputedValue = useCallback(
    (group: string, facet: string, value: unknown) => {
      setOverride(`${group}.parameters.${facet}`, value)
    },
    [setOverride],
  )

  const setModulationStep = useCallback(
    (
      section:
        | "fontSize"
        | "size"
        | "dimension"
        | "margin"
        | "padding"
        | "gap"
        | "corners"
        | "borderWidth"
        | "blur"
        | "spread"
        | "lineHeight",
      key: string,
      step: number,
    ) => {
      mergeOverride(`${section}.${key}.parameters`, { step })
    },
    [mergeOverride],
  )

  const setFontWeightValue = useCallback(
    (key: ThemeFontId, value: number) => {
      mergeOverride(`fontWeight.${key}`, { value })
    },
    [mergeOverride],
  )

  /**
   * Merges a facet patch into one look's `parameters`. Drives every look
   * section (shadow, border, background, gradient, font, scrollbar) so facet
   * keys map straight onto stored parameters with no per-section handling.
   */
  const setLookParameter = useCallback(
    (section: LookSection, key: string, patch: Record<string, unknown>) => {
      mergeOverride(`${section}.${key}.parameters`, patch)
    },
    [mergeOverride],
  )

  const setSizeValue = useCallback(
    (key: ThemeSizeId, value: number) => {
      setModulationStep("size", key, value)
    },
    [setModulationStep],
  )

  const setDimensionValue = useCallback(
    (key: ThemeDimensionId, value: number) => {
      setModulationStep("dimension", key, value)
    },
    [setModulationStep],
  )

  const setMarginValue = useCallback(
    (key: ThemeSpacingId, value: number) => {
      setModulationStep("margin", key, value)
    },
    [setModulationStep],
  )

  const setPaddingValue = useCallback(
    (key: ThemeSpacingId, value: number) => {
      setModulationStep("padding", key, value)
    },
    [setModulationStep],
  )

  const setGapValue = useCallback(
    (key: ThemeSpacingId, value: number) => {
      setModulationStep("gap", key, value)
    },
    [setModulationStep],
  )

  const setFontSizeValue = useCallback(
    (key: ThemeFontSizeId, value: number) => {
      setModulationStep("fontSize", key, value)
    },
    [setModulationStep],
  )

  const setLineHeightValue = useCallback(
    (key: ThemeLineHeightId, value: number) => {
      setModulationStep("lineHeight", key, value)
    },
    [setModulationStep],
  )

  const setBorderWidthValue = useCallback(
    (key: ThemeBorderWidthId, value: number) => {
      setModulationStep("borderWidth", key, value)
    },
    [setModulationStep],
  )

  const setCornersValue = useCallback(
    (key: ThemeSpacingId, value: number) => {
      setModulationStep("corners", key, value)
    },
    [setModulationStep],
  )

  const setBlurValue = useCallback(
    (key: ThemeSizeId, value: number) => {
      setModulationStep("blur", key, value)
    },
    [setModulationStep],
  )

  const setSpreadValue = useCallback(
    (key: ThemeSizeId, value: number) => {
      setModulationStep("spread", key, value)
    },
    [setModulationStep],
  )

  /**
   * Adds a custom token to any custom-capable section with default values from
   * `buildEmptyCustomTokenPayload`. The reducer mints the next `customN` id.
   */
  const addCustomToken = useCallback(
    (section: ThemeCustomTokenSection) => {
      if (!themeEntryId) return
      dispatch({
        type: `add_theme_custom_${section}`,
        payload: {
          themeId: themeEntryId,
          ...buildEmptyCustomTokenPayload(section),
        },
      } as WorkspaceAction)
    },
    [dispatch, themeEntryId],
  )

  const removeCustomToken = useCallback(
    (section: ThemeCustomTokenSection, key: string) => {
      if (!themeEntryId) return
      dispatch({
        type: `remove_theme_custom_${section}`,
        payload: { themeId: themeEntryId, key },
      } as WorkspaceAction)
    },
    [dispatch, themeEntryId],
  )

  /**
   * Replaces a scale-table cell with a modulated step or an exact px/rem length.
   * The reducer builds and swaps the whole cell, so direction switches never
   * leave a stale `step` or `unit/value`.
   */
  const setScaleSlot = useCallback(
    (section: ScaleTokenSection, key: string, value: ScaleTokenInput) => {
      if (!themeEntryId) return
      dispatch({
        type: "set_theme_scale_slot",
        payload: { themeId: themeEntryId, section, key, value },
      })
    },
    [dispatch, themeEntryId],
  )

  const renameCustomToken = useCallback(
    (section: ThemeCustomTokenSection, key: string, name: string) => {
      if (!themeEntryId) return
      dispatch({
        type: "set_theme_custom_token_name",
        payload: { themeId: themeEntryId, section, key, name },
      })
    },
    [dispatch, themeEntryId],
  )

  const addCustomSwatch = useCallback(() => {
    if (!themeEntryId) return
    dispatch({
      type: "add_theme_custom_swatch",
      payload: {
        themeId: themeEntryId,
        name: "New Swatch",
        intent: "Custom Swatch",
        parameters: {
          colorspace: Colorspace.HSL,
          value: { hue: 0, saturation: 0, lightness: 0 },
        },
      },
    })
  }, [dispatch, themeEntryId])

  const removeCustomSwatch = useCallback(
    (key: ThemeCustomSwatchId) => {
      if (!themeEntryId) return
      dispatch({
        type: "remove_theme_custom_swatch",
        payload: { themeId: themeEntryId, key },
      })
    },
    [dispatch, themeEntryId],
  )

  const setSwatchValue = useCallback(
    (key: ThemeCustomSwatchId, value: HSL) => {
      // Swatch cells keep their color at `parameters.value`; `normalizeSwatches`
      // drops any other keys when the theme is computed.
      mergeOverride("swatch", {
        [key]: { parameters: { colorspace: Colorspace.HSL, value } },
      })
    },
    [mergeOverride],
  )

  const setSwatchName = useCallback(
    (key: ThemeCustomSwatchId, name: string) => {
      mergeOverride("swatch", { [key]: { name } })
    },
    [mergeOverride],
  )

  return {
    theme,
    themeEntryId,
    setOverride,
    resetOverride,
    setCoreRatio,
    setCoreSize,
    setCoreFontSize,
    setBaseColor,
    setHarmony,
    setColorMode,
    setColorValue,
    setComputedValue,
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
    addCustomToken,
    removeCustomToken,
    setScaleSlot,
    renameCustomToken,
    addCustomSwatch,
    removeCustomSwatch,
    setSwatchValue,
    setSwatchName,
  }
}
