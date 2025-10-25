import { useCustomTheme } from "@lib/themes/use-custom-theme"
import { Theme } from "@seldon/core"
import { toHSLString } from "@seldon/core/helpers/color/convert-color"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import {
  isHSLString,
  isHex,
  isNumber,
  isRGBString,
} from "@seldon/core/helpers/validation"
import { getPresetOptions } from "@seldon/core/properties/schemas"
import { IconColorValue } from "@components/icons/values/Color"
import { IconFontFamily } from "@components/icons/values/FontFamily"
import { getDropdownOptions } from "@components/properties-panel/helpers/get-dropdown-options"
import { getHSLComponents } from "@components/properties-panel/helpers/get-hsl-components"
import { Input } from "@components/ui/Input"
import { Combobox } from "@components/ui/combobox"
import { PropertyRow } from "../../PropertyRow"
import { ThemeSection } from "../ThemeSection"
import { harmonyOptions, ratioOptions } from "./data"

type CoreSectionProps = {
  theme: Theme
}

export function CoreSection({ theme }: CoreSectionProps) {
  const {
    setBaseColor,
    setCoreRatio,
    setCoreSize,
    setColorValue,
    setFontFamilyValue,
    setCoreFontSize,
    setHarmony,
  } = useCustomTheme()

  return (
    <ThemeSection title="Core" isInitiallyOpen={true}>
      <PropertyRow title="Base size">
        <Input
          validate={isNumber}
          value={String(theme.core.size)}
          onValueChange={(value) => {
            if (value) setCoreSize(Number(value))
          }}
          disabled={theme.id !== "custom"}
        />
      </PropertyRow>

      <PropertyRow title="Ratio">
        <Combobox
          options={ratioOptions}
          validateCustomValue={isNumber}
          value={String(theme.core.ratio)}
          onValueChange={(value) => {
            if (value) setCoreRatio(Number(value))
          }}
          disabled={theme.id !== "custom"}
        />
      </PropertyRow>

      <PropertyRow title="Base color">
        <Input
          value={HSLObjectToString(theme.color.baseColor)}
          placeholder="Enter HSL, RGB or hex value"
          iconLeft={
            <IconColorValue color={HSLObjectToString(theme.color.baseColor)} />
          }
          validate={(value) =>
            isHSLString(value) || isHex(value) || isRGBString(value)
          }
          onValueChange={(value) => {
            if (value) {
              setBaseColor(getHSLComponents(toHSLString(value)))
            }
          }}
          disabled={theme.id !== "custom"}
        />
      </PropertyRow>

      <PropertyRow title="Harmony">
        <Combobox
          options={harmonyOptions}
          value={String(theme.color.harmony)}
          onValueChange={(value) => {
            if (value) setHarmony(Number(value))
          }}
          disabled={theme.id !== "custom"}
        />
      </PropertyRow>

      {(
        [
          { key: "angle", title: "Angle", adornment: "DEG" },
          { key: "step", title: "Step", adornment: "DEG" },
          { key: "whitePoint", title: "White point", adornment: "%" },
          { key: "grayPoint", title: "Gray point", adornment: "%" },
          { key: "blackPoint", title: "Black point", adornment: "%" },
          { key: "bleed", title: "Bleed", adornment: "%" },
        ] as const
      ).map(({ key, title, adornment }) => (
        <PropertyRow title={title} key={key}>
          <Input
            validate={isNumber}
            value={String(theme.color[key])}
            onValueChange={(value) => {
              if (value) setColorValue(key, Number(value))
            }}
            disabled={theme.id !== "custom"}
            adornment={adornment}
          />
        </PropertyRow>
      ))}

      <PropertyRow title="Base Font Size">
        <Input
          validate={isNumber}
          value={String(theme.core.fontSize)}
          onValueChange={(value) => {
            if (value) setCoreFontSize(Number(value))
          }}
          disabled={theme.id !== "custom"}
          adornment="PX"
        />
      </PropertyRow>

      <PropertyRow title="Primary font family">
        <Combobox
          value={theme.fontFamily.primary}
          placeholder={theme.fontFamily.primary}
          renderIcon={<IconFontFamily />}
          options={getDropdownOptions({
            standardOptions: getPresetOptions("fontFamily").map((font) => ({
              name: font,
              value: font,
            })),
          })}
          onValueChange={(value) => {
            if (value) {
              setFontFamilyValue("primary", value)
            }
          }}
          disabled={theme.id !== "custom"}
        />
      </PropertyRow>

      <PropertyRow title="Secondary font family">
        <Combobox
          value={theme.fontFamily.secondary}
          placeholder={theme.fontFamily.secondary}
          renderIcon={<IconFontFamily />}
          options={getDropdownOptions({
            standardOptions: getPresetOptions("fontFamily").map((font) => ({
              name: font,
              value: font,
            })),
          })}
          onValueChange={(value) => {
            if (value) {
              setFontFamilyValue("secondary", value)
            }
          }}
          disabled={theme.id !== "custom"}
        />
      </PropertyRow>

      <PropertyRow title="Contrast ratio">
        <Input
          validate={isNumber}
          value={String(theme.color.contrastRatio)}
          onValueChange={(value) => {
            if (value) setColorValue("contrastRatio", Number(value))
          }}
          disabled={theme.id !== "custom"}
        />
      </PropertyRow>
    </ThemeSection>
  )
}
