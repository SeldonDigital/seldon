import { useCallback } from "react"
import {
  BackgroundParameters,
  BorderParameters,
  FontParameters,
  GradientParameters,
  HSL,
  Harmony,
  ModulationParameters,
  Ratio,
  ScrollbarParameters,
  ShadowParameters,
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
} from "@seldon/core"
import { useWorkspace } from "@lib/workspace/use-workspace"

export function useCustomTheme() {
  const { dispatch, workspace } = useWorkspace()

  const reset = useCallback(() => {
    dispatch({
      type: "reset_custom_theme",
      payload: {},
    })
  }, [dispatch])

  const setCoreRatio = useCallback(
    (value: Ratio) => {
      dispatch({
        type: "set_custom_theme_core_ratio",
        payload: {
          value,
        },
      })
    },
    [dispatch],
  )

  const setCoreSize = useCallback(
    (value: number) => {
      dispatch({
        type: "set_custom_theme_core_size",
        payload: {
          value,
        },
      })
    },
    [dispatch],
  )

  const setBaseColor = useCallback(
    (value: HSL) => {
      dispatch({
        type: "set_custom_theme_base_color",
        payload: {
          value,
        },
      })
    },
    [dispatch],
  )

  const setFontFamilyValue = useCallback(
    (key: ThemeFontFamilyId, value: string) => {
      dispatch({
        type: "set_custom_theme_font_family_value",
        payload: { key, value },
      })
    },
    [dispatch],
  )

  const setCoreFontSize = useCallback(
    (value: number) => {
      dispatch({
        type: "set_custom_theme_core_font_size",
        payload: {
          value,
        },
      })
    },
    [dispatch],
  )

  const setHarmony = useCallback(
    (value: Harmony) => {
      dispatch({
        type: "set_custom_theme_harmony",
        payload: {
          value,
        },
      })
    },
    [dispatch],
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
        | "contrastRatio",
      value: number,
    ) => {
      dispatch({
        type: "set_custom_theme_color_value",
        payload: {
          key,
          value,
        },
      })
    },
    [dispatch],
  )

  const setFontValue = useCallback(
    (key: ThemeFontId, value: Partial<FontParameters>) => {
      dispatch({
        type: "set_custom_theme_font_value",
        payload: {
          key,
          value,
        },
      })
    },
    [dispatch],
  )

  const setLineHeightValue = useCallback(
    (key: ThemeLineHeightId, value: number) => {
      dispatch({
        type: "set_custom_theme_line_height_value",
        payload: {
          key,
          value,
        },
      })
    },
    [dispatch],
  )

  const setBorderValue = useCallback(
    (key: ThemeBorderId, value: Partial<BorderParameters>) => {
      dispatch({
        type: "set_custom_theme_border_value",
        payload: {
          key,
          value,
        },
      })
    },
    [dispatch],
  )

  const setShadowValue = useCallback(
    (key: ThemeShadowId, value: Partial<ShadowParameters>) => {
      dispatch({
        type: "set_custom_theme_shadow_value",
        payload: {
          key,
          value,
        },
      })
    },
    [dispatch],
  )

  const setScrollbarValue = useCallback(
    (key: ThemeScrollbarId, value: Partial<ScrollbarParameters>) => {
      dispatch({
        type: "set_custom_theme_scrollbar_value",
        payload: {
          key,
          value,
        },
      })
    },
    [dispatch],
  )

  const setBackgroundValue = useCallback(
    (key: ThemeBackgroundId, value: Partial<BackgroundParameters>) => {
      dispatch({
        type: "set_custom_theme_background_value",
        payload: {
          key,
          value,
        },
      })
    },
    [dispatch],
  )

  const setGradientValue = useCallback(
    (key: ThemeGradientId, value: Partial<GradientParameters>) => {
      dispatch({
        type: "set_custom_theme_gradient_value",
        payload: {
          key,
          value,
        },
      })
    },
    [dispatch],
  )

  const setModulationValue = useCallback(
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
        | "blur",
      key: string,
      value: ModulationParameters,
    ) => {
      switch (section) {
        case "fontSize":
          dispatch({
            type: "set_custom_theme_font_size_value",
            payload: {
              key: key as ThemeFontSizeId,
              value,
            },
          })
          break
        case "size":
          dispatch({
            type: "set_custom_theme_size_value",
            payload: {
              key: key as ThemeSizeId,
              value,
            },
          })
          break
        case "dimension":
          dispatch({
            type: "set_custom_theme_dimension_value",
            payload: {
              key: key as ThemeDimensionId,
              value,
            },
          })
          break
        case "margin":
          dispatch({
            type: "set_custom_theme_margin_value",
            payload: {
              key: key as ThemeSpacingId,
              value,
            },
          })
          break
        case "padding":
          dispatch({
            type: "set_custom_theme_padding_value",
            payload: {
              key: key as ThemeSpacingId,
              value,
            },
          })
          break
        case "gap":
          dispatch({
            type: "set_custom_theme_gap_value",
            payload: {
              key: key as ThemeSpacingId,
              value,
            },
          })
          break
        case "corners":
          dispatch({
            type: "set_custom_theme_corners_value",
            payload: {
              key: key as ThemeSpacingId,
              value,
            },
          })
          break
        case "borderWidth":
          dispatch({
            type: "set_custom_theme_border_width_value",
            payload: {
              key: key as ThemeBorderWidthId,
              value,
            },
          })
          break
        case "blur":
          dispatch({
            type: "set_custom_theme_blur_value",
            payload: {
              key: key as ThemeSizeId,
              value,
            },
          })
          break
      }
    },
    [dispatch],
  )

  const addCustomSwatch = useCallback(() => {
    dispatch({
      type: "add_custom_theme_swatch",
      payload: {
        name: "New Swatch",
        intent: "Custom Swatch",
        value: { hue: 0, saturation: 0, lightness: 0 },
      },
    })
  }, [dispatch])

  const removeCustomSwatch = useCallback(
    (key: ThemeCustomSwatchId) => {
      dispatch({
        type: "remove_custom_theme_swatch",
        payload: { key },
      })
    },
    [dispatch],
  )

  const setSwatchName = useCallback(
    (key: ThemeCustomSwatchId, name: string) => {
      dispatch({
        type: "update_custom_theme_swatch",
        payload: { key, name },
      })
    },
    [dispatch],
  )

  const setSwatchValue = useCallback(
    (key: ThemeCustomSwatchId, value: HSL) => {
      dispatch({
        type: "update_custom_theme_swatch",
        payload: { key, value },
      })
    },
    [dispatch],
  )

  return {
    theme: workspace.customTheme,
    reset,
    setCoreRatio,
    setCoreFontSize,
    setCoreSize,
    setBaseColor,
    setFontFamilyValue,
    setHarmony,
    setColorValue,
    setFontValue,
    setLineHeightValue,
    setBorderValue,
    setShadowValue,
    setScrollbarValue,
    setBackgroundValue,
    setGradientValue,
    setSwatchValue,
    setModulationValue,
    addCustomSwatch,
    removeCustomSwatch,
    setSwatchName,
  }
}
