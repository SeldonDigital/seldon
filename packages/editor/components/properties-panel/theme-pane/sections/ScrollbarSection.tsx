import { useCustomTheme } from "@lib/themes/use-custom-theme"
import {
  ColorValue,
  PixelValue,
  RemValue,
  Theme,
  ThemeScrollbarId,
  Unit,
} from "@seldon/core"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import {
  isNumber,
  isPx,
  isRem,
  isValidColor,
} from "@seldon/core/helpers/validation"
import { IconBackgroundColorValue } from "@components/icons/values/BackgroundColor"
import { IconCornerValue } from "@components/icons/values/Corners"
import { IconThemeColorValue } from "@components/icons/values/ThemeColor"
import { IconWidthValue } from "@components/icons/values/Width"
import { serializeColor } from "@components/properties-panel/helpers/serialize-color"
import { serializeValue } from "@components/properties-panel/helpers/serialize-value"
import { Input } from "@components/ui/Input"
import { Combobox } from "@components/ui/combobox"
import { SubPropertyRow } from "../../SubPropertyRow"
import { getColorDropdownOptions } from "../../helpers/get-color-dropdown-options"
import { ThemeSection } from "../ThemeSection"
import { ThemeSubSection } from "../ThemeSubSection"

type ScrollbarSectionProps = {
  theme: Theme
}

export function ScrollbarSection({ theme }: ScrollbarSectionProps) {
  const { setScrollbarValue } = useCustomTheme()

  return (
    <ThemeSection title="Scrollbar">
      {Object.entries(theme.scrollbar).map(([key, scrollbarValue]) => {
        const { trackColor, thumbColor, thumbHoverColor, trackSize, rounded } =
          scrollbarValue.parameters
        return (
          <ThemeSubSection title={scrollbarValue.name} key={key}>
            <SubPropertyRow title="Track color">
              <Combobox
                value={stringifyValue(trackColor)}
                validateCustomValue={isValidColor}
                placeholder={stringifyValue(trackColor) ?? "None"}
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
                  setScrollbarValue(key as ThemeScrollbarId, {
                    trackColor: serializeColor(value) as ColorValue,
                  })
                }}
                disabled={theme.id !== "custom"}
              />
            </SubPropertyRow>
            <SubPropertyRow title="Thumb color">
              <Combobox
                value={stringifyValue(thumbColor)}
                validateCustomValue={isValidColor}
                placeholder={stringifyValue(thumbColor) ?? "None"}
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
                  setScrollbarValue(key as ThemeScrollbarId, {
                    thumbColor: serializeColor(value) as ColorValue,
                  })
                }}
                disabled={theme.id !== "custom"}
              />
            </SubPropertyRow>
            <SubPropertyRow title="Thumb hover color">
              <Combobox
                value={stringifyValue(thumbHoverColor)}
                placeholder={stringifyValue(thumbHoverColor) ?? "None"}
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

                  return <IconBackgroundColorValue />
                }}
                options={getColorDropdownOptions({
                  theme,
                })}
                onValueChange={(value) => {
                  setScrollbarValue(key as ThemeScrollbarId, {
                    thumbHoverColor: serializeColor(value) as ColorValue,
                  })
                }}
                disabled={theme.id !== "custom"}
              />
            </SubPropertyRow>
            <SubPropertyRow title="Track size">
              <Input
                validate={(value) =>
                  isPx(value) || isRem(value) || isNumber(value)
                }
                value={stringifyValue(trackSize)}
                iconLeft={<IconWidthValue />}
                placeholder={stringifyValue(trackSize)}
                disabled={theme.id !== "custom"}
                onValueChange={(value) => {
                  if (value) {
                    setScrollbarValue(key as ThemeScrollbarId, {
                      trackSize: serializeValue(value, {
                        currentValue: trackSize,
                        defaultUnit: Unit.PX,
                      }) as RemValue | PixelValue,
                    })
                  }
                }}
              />
            </SubPropertyRow>
            <SubPropertyRow title="Rounded">
              <Combobox
                value={rounded ? "On" : "Off"}
                placeholder="Off"
                onValueChange={(value) => {
                  setScrollbarValue(key as ThemeScrollbarId, {
                    rounded: value === "On",
                  })
                }}
                options={[
                  { value: "On", name: "On" },
                  { value: "Off", name: "Off" },
                ]}
                renderIcon={<IconCornerValue />}
                disabled={theme.id !== "custom"}
              />
            </SubPropertyRow>
          </ThemeSubSection>
        )
      })}
    </ThemeSection>
  )
}
