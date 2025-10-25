import { produce } from "immer"
import {
  Theme,
  ThemeBorderWidthId,
  ThemeCornersId,
  ThemeDimensionId,
  ThemeFontSizeId,
  ThemeSizeId,
  ThemeSpacingId,
} from "@seldon/core"
import { modulateWithTheme } from "@seldon/core/helpers/math/modulate"

export function generateThemeValues(theme: Theme) {
  return produce(theme, (draft) => {
    for (const key in draft.size) {
      const property = draft.size[key as ThemeSizeId]
      property.value = modulateWithTheme({
        parameters: property.parameters,
        theme,
      })
    }
    for (const key in draft.dimension) {
      const property = draft.dimension[key as ThemeDimensionId]
      property.value = modulateWithTheme({
        parameters: property.parameters,
        theme,
      })
    }
    for (const key in draft.fontSize) {
      const property = draft.fontSize[key as ThemeFontSizeId]
      property.value = modulateWithTheme({
        parameters: property.parameters,
        theme,
      })
    }
    for (const key in draft.margin) {
      const property = draft.margin[key as ThemeSpacingId]
      property.value = modulateWithTheme({
        parameters: property.parameters,
        theme,
      })
    }
    for (const key in draft.padding) {
      const property = draft.padding[key as ThemeSpacingId]
      property.value = modulateWithTheme({
        parameters: property.parameters,
        theme,
      })
    }
    for (const key in draft.gap) {
      const property = draft.gap[key as ThemeSpacingId]
      property.value = modulateWithTheme({
        parameters: property.parameters,
        theme,
      })
    }
    for (const key in draft.corners) {
      const property = draft.corners[key as ThemeCornersId]
      property.value = modulateWithTheme({
        parameters: property.parameters,
        theme,
      })
    }
    for (const key in draft.borderWidth) {
      const property = draft.borderWidth[key as ThemeBorderWidthId]
      property.value =
        property.value ??
        modulateWithTheme({
          parameters: property.parameters,
          theme,
        })
    }
  })
}
