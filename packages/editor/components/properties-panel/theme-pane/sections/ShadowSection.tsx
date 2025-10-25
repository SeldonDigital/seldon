import { useCustomTheme } from "@lib/themes/use-custom-theme"
import {
  ShadowOffsetValue,
  Theme,
  ThemeBlurKey,
  ThemeShadowId,
  Unit,
  ValueType,
} from "@seldon/core"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import {
  isNumber,
  isPercentage,
  isPx,
  isRem,
  isValidColor,
  isValidSize,
} from "@seldon/core/helpers/validation"
import { IconBorderColorValue } from "@components/icons/values/BorderColor"
import { IconBrightnessValue } from "@components/icons/values/Brightness"
import { IconOpacityValue } from "@components/icons/values/Opacity"
import { IconThemeColorValue } from "@components/icons/values/ThemeColor"
import { IconTokenValue } from "@components/icons/values/Token"
import { IconWidthValue } from "@components/icons/values/Width"
import { serializeColor } from "@components/properties-panel/helpers/serialize-color"
import { serializeValue } from "@components/properties-panel/helpers/serialize-value"
import { Input } from "@components/ui/Input"
import { Combobox } from "@components/ui/combobox"
import { SubPropertyRow } from "../../SubPropertyRow"
import { getColorDropdownOptions } from "../../helpers/get-color-dropdown-options"
import { getDropdownOptions } from "../../helpers/get-dropdown-options"
import { ThemeSection } from "../ThemeSection"
import { ThemeSubSection } from "../ThemeSubSection"

type ShadowSectionProps = {
  theme: Theme
}

export function ShadowSection({ theme }: ShadowSectionProps) {
  const { setShadowValue } = useCustomTheme()

  return (
    <ThemeSection title="Shadow">
      {Object.entries(theme.shadow).map(([key, shadowValue]) => (
        <ThemeSubSection title={shadowValue.name} key={key}>
          <SubPropertyRow title="Offset X">
            <Input
              validate={(value) =>
                isPx(value) || isRem(value) || isNumber(value)
              }
              value={stringifyValue(shadowValue.parameters.offsetX)}
              iconLeft={<IconWidthValue />}
              placeholder={stringifyValue(shadowValue.parameters.offsetX)}
              disabled={theme.id !== "custom"}
              onValueChange={(value) => {
                if (value) {
                  setShadowValue(key as ThemeShadowId, {
                    offsetX: serializeValue(value, {
                      currentValue: shadowValue.parameters.offsetX,
                      defaultUnit: Unit.PX,
                    }) as ShadowOffsetValue,
                  })
                }
              }}
            />
          </SubPropertyRow>
          <SubPropertyRow title="Offset Y">
            <Input
              validate={(value) =>
                isPx(value) || isRem(value) || isNumber(value)
              }
              value={stringifyValue(shadowValue.parameters.offsetY)}
              iconLeft={<IconWidthValue />}
              placeholder={stringifyValue(shadowValue.parameters.offsetY)}
              disabled={theme.id !== "custom"}
              onValueChange={(value) => {
                if (value) {
                  setShadowValue(key as ThemeShadowId, {
                    offsetY: serializeValue(value, {
                      currentValue: shadowValue.parameters.offsetY,
                      defaultUnit: Unit.PX,
                    }) as ShadowOffsetValue,
                  })
                }
              }}
            />
          </SubPropertyRow>
          <SubPropertyRow title="Blur">
            <Combobox
              value={stringifyValue(shadowValue.parameters.blur)}
              placeholder={stringifyValue(shadowValue.parameters.blur)}
              validateCustomValue={(newValue) => isValidSize(newValue)}
              renderIcon={<IconTokenValue />}
              options={getDropdownOptions({
                themeOptions: theme.blur,
                themeSection: "@blur",
              })}
              onValueChange={(value) => {
                if (value) {
                  setShadowValue(key as ThemeShadowId, {
                    blur: {
                      type: ValueType.THEME_ORDINAL,
                      value: value as ThemeBlurKey,
                    },
                  })
                }
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="Color">
            <Combobox
              value={stringifyValue(shadowValue.parameters.color)}
              placeholder={stringifyValue(shadowValue.parameters.color)}
              validateCustomValue={isValidColor}
              renderIcon={(option) => {
                if (option) {
                  const isSwatch = option.value.startsWith("@swatch.")

                  if (isSwatch && option.color) {
                    return (
                      <IconThemeColorValue
                        color={HSLObjectToString(option.color)}
                      />
                    )
                  }
                }

                return <IconBorderColorValue />
              }}
              options={getColorDropdownOptions({
                theme,
              })}
              onValueChange={(value) => {
                if (value) {
                  setShadowValue(key as ThemeShadowId, {
                    color: serializeColor(value),
                  })
                }
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="Brightness">
            <Input
              validate={(value) => isNumber(value) || isPercentage(value)}
              value={`${shadowValue.parameters.brightness?.value?.value ?? 0}%`}
              iconLeft={<IconBrightnessValue />}
              placeholder="0%"
              onValueChange={(value) => {
                if (value) {
                  setShadowValue(key as ThemeShadowId, {
                    brightness: {
                      type: ValueType.EXACT,
                      value: {
                        value: parseFloat(value),
                        unit: Unit.PERCENT,
                      },
                    },
                  })
                }
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          {shadowValue.parameters.opacity && (
            <SubPropertyRow title="Opacity">
              <Input
                validate={(value) => isNumber(value) || isPercentage(value)}
                value={stringifyValue(shadowValue.parameters.opacity)}
                placeholder={stringifyValue(shadowValue.parameters.opacity)}
                iconLeft={<IconOpacityValue />}
                onValueChange={(value) => {
                  if (value) {
                    setShadowValue(key as ThemeShadowId, {
                      opacity: {
                        type: ValueType.EXACT,
                        value: {
                          value: parseFloat(value),
                          unit: Unit.PERCENT,
                        },
                      },
                    })
                  }
                }}
                disabled={theme.id !== "custom"}
              />
            </SubPropertyRow>
          )}
        </ThemeSubSection>
      ))}
    </ThemeSection>
  )
}
