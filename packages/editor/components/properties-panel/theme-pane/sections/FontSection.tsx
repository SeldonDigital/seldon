import { useCustomTheme } from "@lib/themes/use-custom-theme"
import {
  TextCasing,
  Theme,
  ThemeFontFamilyKey,
  ThemeFontId,
  ThemeFontSizeKey,
  ThemeFontWeightKey,
  ThemeLineHeightKey,
  ValueType,
} from "@seldon/core"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import { isThemeValueKey } from "@seldon/core/helpers/validation"
import { getPresetOptions } from "@seldon/core/properties/schemas"
import { IconTextCaseValue } from "@components/icons/values/Case"
import { IconFontFamily } from "@components/icons/values/FontFamily"
import { IconFontSizeValue } from "@components/icons/values/FontSize"
import { IconFontWeightValue } from "@components/icons/values/FontWeight"
import { IconLineHeightValue } from "@components/icons/values/LineHeight"
import { IconTokenValue } from "@components/icons/values/Token"
import { Combobox } from "@components/ui/combobox"
import { SubPropertyRow } from "../../SubPropertyRow"
import { getDropdownOptions } from "../../helpers/get-dropdown-options"
import { ThemeSection } from "../ThemeSection"
import { ThemeSubSection } from "../ThemeSubSection"

type FontSectionProps = {
  theme: Theme
}

export function FontSection({ theme }: FontSectionProps) {
  const { setFontValue } = useCustomTheme()

  return (
    <ThemeSection title="Font">
      {Object.entries(theme.font).map(([key, fontValue]) => (
        <ThemeSubSection title={fontValue.name} key={key}>
          <SubPropertyRow title="Font family">
            <Combobox
              value={stringifyValue(fontValue.parameters.family)}
              placeholder={stringifyValue(fontValue.parameters.family)}
              renderIcon={(option) =>
                option && isThemeValueKey(option.value) ? (
                  <IconTokenValue />
                ) : (
                  <IconFontFamily />
                )
              }
              options={[
                [
                  {
                    name: `${theme.fontFamily.primary} (Primary)`,
                    value: "@fontFamily.primary",
                  },
                  {
                    name: `${theme.fontFamily.secondary} (Secondary)`,
                    value: "@fontFamily.secondary",
                  },
                ],
                getPresetOptions("fontFamily").map((font) => ({
                  name: font,
                  value: font,
                })),
              ]}
              onValueChange={(value) => {
                if (value) {
                  setFontValue(key as ThemeFontId, {
                    family: isThemeValueKey(value)
                      ? {
                          type: ValueType.THEME_CATEGORICAL,
                          value: value as ThemeFontFamilyKey,
                        }
                      : {
                          type: ValueType.PRESET,
                          value: value,
                        },
                  })
                }
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="Weight">
            <Combobox
              value={stringifyValue(fontValue.parameters.weight)}
              placeholder={stringifyValue(fontValue.parameters.weight)}
              renderIcon={<IconFontWeightValue />}
              options={getDropdownOptions({
                themeOptions: theme.fontWeight,
                themeSection: "@fontWeight",
              })}
              onValueChange={(value) => {
                if (value) {
                  setFontValue(key as ThemeFontId, {
                    weight: {
                      type: ValueType.THEME_ORDINAL,
                      value: value as ThemeFontWeightKey,
                    },
                  })
                }
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="Font size">
            <Combobox
              value={stringifyValue(fontValue.parameters.size)}
              placeholder={stringifyValue(fontValue.parameters.size)}
              renderIcon={<IconFontSizeValue />}
              options={getDropdownOptions({
                themeOptions: theme.fontSize,
                themeSection: "@fontSize",
              })}
              validateCustomValue={isThemeValueKey}
              onValueChange={(value) => {
                if (value) {
                  setFontValue(key as ThemeFontId, {
                    size: {
                      type: ValueType.THEME_ORDINAL,
                      value: value as ThemeFontSizeKey,
                    },
                  })
                }
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="Line height">
            <Combobox
              value={stringifyValue(fontValue.parameters.lineHeight)}
              placeholder={stringifyValue(fontValue.parameters.lineHeight)}
              renderIcon={<IconLineHeightValue />}
              options={getDropdownOptions({
                themeOptions: theme.lineHeight,
                themeSection: "@lineHeight",
              })}
              validateCustomValue={isThemeValueKey}
              onValueChange={(value) => {
                if (value) {
                  setFontValue(key as ThemeFontId, {
                    lineHeight: {
                      type: ValueType.THEME_ORDINAL,
                      value: value as ThemeLineHeightKey,
                    },
                  })
                }
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="Case">
            <Combobox
              value={stringifyValue(fontValue.parameters.textCase)}
              renderIcon={<IconTextCaseValue />}
              placeholder={stringifyValue(fontValue.parameters.textCase)}
              options={getDropdownOptions({
                standardOptions: getPresetOptions("textCase"),
              })}
              validateCustomValue={isThemeValueKey}
              onValueChange={(value) => {
                if (value) {
                  setFontValue(key as ThemeFontId, {
                    textCase: {
                      type: ValueType.PRESET,
                      value: value as TextCasing,
                    },
                  })
                }
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
        </ThemeSubSection>
      ))}
    </ThemeSection>
  )
}
