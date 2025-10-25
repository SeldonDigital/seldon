import { HSL, ValueType } from "@seldon/core"
import { getPresetOptions } from "@seldon/core/properties/schemas"
import { Theme, ThemeSwatchId } from "@seldon/core/themes/types"

type Props = {
  theme: Theme
  allowedValues?: string[]
  includeComputedValue?: boolean
}

export function getColorDropdownOptions({
  theme,
  allowedValues,
  includeComputedValue,
}: Props) {
  const defaultOptions: {
    name: string
    value: string
    color?: HSL
  }[] = []
  const swatchOptions: { name: string; value: string; color?: HSL }[] = []
  const customOptions: { name: string; value: string; color?: HSL }[] = []

  for (const [id, swatch] of Object.entries(theme.swatch)) {
    const option = {
      name: theme.swatch[id as ThemeSwatchId].name,
      value: `@swatch.${id}`,
      color: swatch.value,
    }

    if (!allowedValues || allowedValues.includes(option.value)) {
      if (id.startsWith("custom")) {
        customOptions.push(option)
      } else {
        swatchOptions.push(option)
      }
    }
  }

  defaultOptions.push(...getPresetOptions("color"))

  if (includeComputedValue) {
    defaultOptions.unshift({
      name: "Computed",
      value: ValueType.COMPUTED,
      color: undefined,
    })
  }

  return [defaultOptions, swatchOptions, customOptions]
}
