import { useCustomTheme } from "@lib/themes/use-custom-theme"
import { Theme, ThemeCustomSwatchId } from "@seldon/core"
import { toHSLString } from "@seldon/core/helpers/color/convert-color"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { Button } from "@components/seldon/elements/Button"
import { IconColorValue } from "@components/icons/values/Color"
import { getHSLComponents } from "@components/properties-panel/helpers/get-hsl-components"
import { Input } from "@components/ui/Input"
import { PropertyRow } from "../../PropertyRow"
import { ThemeSection } from "../ThemeSection"
import { SwatchListItem } from "./SwatchListItem"

type SwatchSectionProps = {
  theme: Theme
}

const tints = [
  "primary",
  "swatch1",
  "swatch2",
  "swatch3",
  "swatch4",
  "background",
  "white",
  "gray",
  "black",
  "primary",
]

export function SwatchSection({ theme }: SwatchSectionProps) {
  const { setSwatchValue, addCustomSwatch, removeCustomSwatch, setSwatchName } =
    useCustomTheme()

  const allSwatches = Object.entries(theme.swatch)
  const tintSwatches = allSwatches.filter(([key]) => tints.includes(key))
  const customSwatches = allSwatches.filter(([key]) => key.startsWith("custom"))

  return (
    <ThemeSection title="Swatch">
      {tintSwatches.map(([key, swatchValue]) => {
        return (
          <PropertyRow title={swatchValue.name} key={key}>
            <Input
              value=""
              placeholder={HSLObjectToString(swatchValue.value)}
              iconLeft={
                <IconColorValue color={HSLObjectToString(swatchValue.value)} />
              }
              disabled
            />
          </PropertyRow>
        )
      })}
      {customSwatches.map(([key, swatchValue]) => {
        return (
          <SwatchListItem
            key={key}
            swatchId={key as ThemeCustomSwatchId}
            swatchValue={swatchValue}
            onValueChange={(value) => {
              setSwatchValue(
                key as ThemeCustomSwatchId,
                getHSLComponents(toHSLString(value)),
              )
            }}
            onNameChange={(name) => {
              setSwatchName(key as ThemeCustomSwatchId, name)
            }}
            onRemoveClick={
              theme.id === "custom"
                ? () => removeCustomSwatch(key as ThemeCustomSwatchId)
                : undefined
            }
          />
        )
      })}
      {theme.id === "custom" && (
        <Button
          data-testid="add-custom-swatch-button"
          iconProps={{ icon: "material-add" }}
          labelProps={{ children: "Add custom swatch" }}
          onClick={addCustomSwatch}
          className="back-button"
        />
      )}
    </ThemeSection>
  )
}
