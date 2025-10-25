import { useCustomTheme } from "@lib/themes/use-custom-theme"
import {
  BackgroundPosition,
  BackgroundRepeat,
  ImageFit,
  Theme,
  ThemeBackgroundId,
  ThemeSwatchKey,
  Unit,
  ValueType,
} from "@seldon/core"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import { isNumber, isPercentage } from "@seldon/core/helpers/validation"
import { isValidURL } from "@seldon/core/helpers/validation/url"
import { getPresetOptions } from "@seldon/core/properties/schemas"
import { IconPosition } from "@components/icons/Position"
import { IconBackgroundColorValue } from "@components/icons/values/BackgroundColor"
import { IconBrightnessValue } from "@components/icons/values/Brightness"
import { IconCheckboxCheckedValue } from "@components/icons/values/CheckboxChecked"
import { IconCheckboxUncheckedValue } from "@components/icons/values/CheckboxUnchecked"
import { IconImageValue } from "@components/icons/values/Image"
import { IconImageFit } from "@components/icons/values/ImageFit"
import { IconOpacityValue } from "@components/icons/values/Opacity"
import { IconThemeColorValue } from "@components/icons/values/ThemeColor"
import { Input } from "@components/ui/Input"
import { Combobox } from "@components/ui/combobox"
import { SubPropertyRow } from "../../SubPropertyRow"
import { getColorDropdownOptions } from "../../helpers/get-color-dropdown-options"
import { ThemeSection } from "../ThemeSection"
import { ThemeSubSection } from "../ThemeSubSection"

type BackgroundSectionProps = {
  theme: Theme
}

export function BackgroundSection({ theme }: BackgroundSectionProps) {
  const { setBackgroundValue } = useCustomTheme()

  return (
    <ThemeSection title="Background">
      {Object.entries(theme.background).map(([key, backgroundValue]) => {
        const { opacity, color, repeat, size, position, image, brightness } =
          backgroundValue.parameters
        return (
          <ThemeSubSection title={backgroundValue.name} key={key}>
            <SubPropertyRow title="Image">
              <Input
                validate={isValidURL}
                value={stringifyValue(image)}
                onValueChange={(value) => {
                  setBackgroundValue(key as ThemeBackgroundId, {
                    image: {
                      type: ValueType.EXACT,
                      value: value,
                    },
                  })
                }}
                placeholder={stringifyValue(image) ?? "None"}
                disabled={theme.id !== "custom"}
                iconLeft={
                  image ? (
                    <img
                      src={stringifyValue(image)}
                      alt="Preview"
                      className="h-[14px] w-[14px] rounded-[3px]"
                    />
                  ) : (
                    <IconImageValue />
                  )
                }
              />
            </SubPropertyRow>
            <SubPropertyRow title="Size">
              <Combobox
                value={stringifyValue(size)}
                placeholder={stringifyValue(size) ?? "Cover"}
                renderIcon={<IconImageFit />}
                options={getPresetOptions("imageFit")}
                onValueChange={(value) => {
                  setBackgroundValue(key as ThemeBackgroundId, {
                    size: value
                      ? {
                          type: ValueType.PRESET,
                          value: value as ImageFit,
                        }
                      : undefined,
                  })
                }}
                disabled={theme.id !== "custom"}
              />
            </SubPropertyRow>
            <SubPropertyRow title="Repeat">
              <Combobox
                value={stringifyValue(repeat)}
                placeholder={stringifyValue(repeat) ?? "No repeat"}
                renderIcon={(value) => {
                  return value?.value === "repeat" ? (
                    <IconCheckboxCheckedValue />
                  ) : (
                    <IconCheckboxUncheckedValue />
                  )
                }}
                disabled={theme.id !== "custom"}
                options={getPresetOptions("backgroundRepeat")}
                onValueChange={(value) => {
                  setBackgroundValue(key as ThemeBackgroundId, {
                    repeat: value
                      ? {
                          type: ValueType.PRESET,
                          value: value as BackgroundRepeat,
                        }
                      : undefined,
                  })
                }}
              />
            </SubPropertyRow>
            <SubPropertyRow title="Position">
              <Combobox
                value={position?.toString()}
                placeholder={position?.toString() ?? "Center"}
                renderIcon={<IconPosition />}
                options={getPresetOptions("backgroundPosition")}
                onValueChange={(value) => {
                  setBackgroundValue(key as ThemeBackgroundId, {
                    position: value
                      ? {
                          type: ValueType.PRESET,
                          value: value as BackgroundPosition,
                        }
                      : undefined,
                  })
                }}
                disabled={theme.id !== "custom"}
              />
            </SubPropertyRow>
            <SubPropertyRow title="Color">
              <Combobox
                value={stringifyValue(color)}
                placeholder={stringifyValue(color) ?? "None"}
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

                  return <IconBackgroundColorValue />
                }}
                options={getColorDropdownOptions({
                  theme,
                })}
                onValueChange={(value) => {
                  setBackgroundValue(key as ThemeBackgroundId, {
                    color: value
                      ? {
                          type: ValueType.THEME_CATEGORICAL,
                          value: value as ThemeSwatchKey,
                        }
                      : undefined,
                  })
                }}
                disabled={theme.id !== "custom"}
              />
            </SubPropertyRow>
            <SubPropertyRow title="Brightness">
              <Input
                validate={(value) => isNumber(value) || isPercentage(value)}
                value={stringifyValue(brightness)}
                iconLeft={<IconBrightnessValue />}
                placeholder={`${brightness?.value?.value ?? 0}%`}
                onValueChange={(value) => {
                  if (value) {
                    setBackgroundValue(key as ThemeBackgroundId, {
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
              />
            </SubPropertyRow>
            <SubPropertyRow title="Opacity">
              <Input
                validate={(value) => isNumber(value) || isPercentage(value)}
                value={stringifyValue(opacity)}
                iconLeft={<IconOpacityValue />}
                placeholder={stringifyValue(opacity)}
                onValueChange={(value) => {
                  if (value) {
                    setBackgroundValue(key as ThemeBackgroundId, {
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
              />
            </SubPropertyRow>
          </ThemeSubSection>
        )
      })}
    </ThemeSection>
  )
}
