import { useCustomTheme } from "@lib/themes/use-custom-theme"
import { capitalCase } from "change-case"
import { Theme, ThemeLineHeightId } from "@seldon/core"
import { isNumber } from "@seldon/core/helpers/validation"
import { IconLineHeightValue } from "@components/icons/values/LineHeight"
import { Input } from "@components/ui/Input"
import { PropertyRow } from "../../PropertyRow"
import { ThemeSection } from "../ThemeSection"

type LineHeightSectionProps = {
  theme: Theme
}

export function LineHeightSection({ theme }: LineHeightSectionProps) {
  const { setLineHeightValue } = useCustomTheme()

  return (
    <ThemeSection title="Line height">
      {Object.entries(theme.lineHeight).map(([key, lineHeight]) => (
        <PropertyRow key={key} title={capitalCase(key)}>
          <Input
            iconLeft={<IconLineHeightValue />}
            validate={isNumber}
            value={lineHeight.value.toString()}
            placeholder={lineHeight.name}
            onValueChange={(value) => {
              if (value) {
                setLineHeightValue(key as ThemeLineHeightId, parseFloat(value))
              }
            }}
            disabled={theme.id !== "custom"}
          />
        </PropertyRow>
      ))}
    </ThemeSection>
  )
}
