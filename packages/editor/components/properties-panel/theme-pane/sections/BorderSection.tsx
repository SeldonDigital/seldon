import { useCustomTheme } from "@lib/themes/use-custom-theme"
import {
  BorderColorValue,
  BorderOpacityValue,
  BorderStyle,
  BorderWidthValue,
  Theme,
  ThemeBorderId,
  Unit,
  ValueType,
} from "@seldon/core"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import {
  isNumber,
  isPercentage,
  isValidColor,
  isValidSize,
} from "@seldon/core/helpers/validation"
import { getPresetOptions } from "@seldon/core/properties/schemas"
import { IconBorderColorValue } from "@components/icons/values/BorderColor"
import { IconBorderStyleValue } from "@components/icons/values/BorderStyle"
import { IconBrightnessValue } from "@components/icons/values/Brightness"
import { IconOpacityValue } from "@components/icons/values/Opacity"
import { IconThemeColorValue } from "@components/icons/values/ThemeColor"
import { IconTokenValue } from "@components/icons/values/Token"
import { serializeColor } from "@components/properties-panel/helpers/serialize-color"
import { serializeValue } from "@components/properties-panel/helpers/serialize-value"
import { Input } from "@components/ui/Input"
import { Combobox } from "@components/ui/combobox"
import { SubPropertyRow } from "../../SubPropertyRow"
import { getColorDropdownOptions } from "../../helpers/get-color-dropdown-options"
import { getDropdownOptions } from "../../helpers/get-dropdown-options"
import { ThemeSection } from "../ThemeSection"
import { ThemeSubSection } from "../ThemeSubSection"

type BorderSectionProps = {
  theme: Theme
}

export function BorderSection({ theme }: BorderSectionProps) {
  const { setBorderValue } = useCustomTheme()

  return (
    <ThemeSection title="Border">
      {Object.entries(theme.border).map(([key, borderValue]) => (
        <ThemeSubSection title={borderValue.name} key={key}>
          <SubPropertyRow title="Width">
            <Combobox
              value={stringifyValue(borderValue.parameters.width)}
              validateCustomValue={isValidSize}
              placeholder={stringifyValue(borderValue.parameters.width)}
              renderIcon={<IconTokenValue />}
              options={getDropdownOptions({
                themeOptions: theme.borderWidth,
                themeSection: "@borderWidth",
                standardOptions: getPresetOptions("borderWidth"),
              })}
              onValueChange={(value) => {
                if (value) {
                  setBorderValue(key as ThemeBorderId, {
                    width: serializeValue(value, {
                      currentValue: borderValue.parameters.width,
                      defaultUnit: Unit.PX,
                    }) as BorderWidthValue,
                  })
                }
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="Style">
            <Combobox
              value={stringifyValue(borderValue.parameters.style)}
              placeholder={stringifyValue(borderValue.parameters.style)}
              renderIcon={<IconBorderStyleValue />}
              options={getDropdownOptions({
                standardOptions: getPresetOptions("borderStyle"),
              })}
              onValueChange={(value) => {
                if (value) {
                  setBorderValue(key as ThemeBorderId, {
                    style: {
                      type: ValueType.PRESET,
                      value: value as BorderStyle,
                    },
                  })
                }
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="Color">
            <Combobox
              value={stringifyValue(borderValue.parameters.color)}
              placeholder={stringifyValue(borderValue.parameters.color)}
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
              validateCustomValue={isValidColor}
              onValueChange={(value) => {
                if (value) {
                  setBorderValue(key as ThemeBorderId, {
                    color: serializeColor(value) as BorderColorValue,
                  })
                }
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="Brightness">
            <Input
              validate={(value) => isNumber(value) || isPercentage(value)}
              value={stringifyValue(borderValue.parameters.brightness)}
              iconLeft={<IconBrightnessValue />}
              placeholder={`${borderValue.parameters.brightness?.value?.value ?? 0}%`}
              onValueChange={(value) => {
                if (value) {
                  setBorderValue(key as ThemeBorderId, {
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
          {borderValue.parameters.opacity && (
            <SubPropertyRow title="Opacity">
              <Input
                validate={(value) => isNumber(value) || isPercentage(value)}
                value={stringifyValue(borderValue.parameters.opacity)}
                iconLeft={<IconOpacityValue />}
                placeholder={stringifyValue(borderValue.parameters.opacity)}
                onValueChange={(value) => {
                  if (value) {
                    setBorderValue(key as ThemeBorderId, {
                      opacity: serializeValue(value, {
                        currentValue: borderValue.parameters.opacity,
                        defaultUnit: Unit.PERCENT,
                      }) as BorderOpacityValue,
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
