import { useCustomTheme } from "@lib/themes/use-custom-theme"
import { capitalCase } from "change-case"
import { ModulationParameters, Theme } from "@seldon/core"
import { modulateWithTheme } from "@seldon/core/helpers/math/modulate"
import { isNumber } from "@seldon/core/helpers/validation"
import { IconStepValue } from "@components/icons/values/Step"
import { Input } from "@components/ui/Input"
import { PropertyRow } from "../../PropertyRow"
import { ThemeSection } from "../ThemeSection"

type Props = {
  title: string
  theme: Theme
  subProperties: {
    key: string
    name: string
    parameters: ModulationParameters
  }[]
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
}

export function ModulationValueSection({
  title,
  theme,
  subProperties,
  section,
}: Props) {
  const { setModulationValue } = useCustomTheme()

  return (
    <ThemeSection title={title}>
      {subProperties.map((property) => (
        <PropertyRow key={property.name} title={capitalCase(property.name)}>
          <Input
            validate={(value) => isNumber(value)}
            value={property.parameters.step.toString()}
            placeholder="Auto"
            disabled={theme.id !== "custom"}
            onValueChange={(value) => {
              setModulationValue(section, property.key, {
                step: parseFloat(value),
              })
            }}
            iconLeft={<IconStepValue />}
            type="number"
            adornment={
              modulateWithTheme({
                theme,
                parameters: property.parameters,
              }) + "rem"
            }
            step={1}
            min={-10}
            max={10}
          />
        </PropertyRow>
      ))}
    </ThemeSection>
  )
}
