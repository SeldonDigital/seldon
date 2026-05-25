import { cn } from "@lib/utils/cn"
import { Theme, ThemeSwatchKey } from "@seldon/core"
import { themeSwatchToCssBackground } from "@seldon/core/helpers/color/theme-swatch-to-css-background"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { isSwatchToken } from "@seldon/core/themes/values"

interface ThemeSwatchesProps {
  theme: Theme
  isSelected?: boolean
}

export const ThemeSwatches = ({
  theme,
  isSelected = false,
}: ThemeSwatchesProps) => {
  const swatches: ThemeSwatchKey[] = [
    "@swatch.primary",
    "@swatch.swatch1",
    "@swatch.swatch2",
    "@swatch.swatch3",
    "@swatch.swatch4",
  ]

  return (
    <div className="relative flex">
      {swatches.map((swatch, i) => renderSwatch(swatch, i, isSelected))}
    </div>
  )

  function renderSwatch(value: ThemeSwatchKey, i: number, isSelected: boolean) {
    const themeValue = getThemeOption(value, theme)
    const backgroundColor = isSwatchToken(themeValue)
      ? themeSwatchToCssBackground(themeValue)
      : undefined

    return (
      <span
        key={i}
        style={{
          zIndex: 5 - i,
          ...(backgroundColor ? { backgroundColor } : {}),
        }}
        className={cn(
          "block h-3 w-3 rounded-full bg-blue shadow-dieter-rams-button",
          i < 4 ? (isSelected ? "-mr-[7px]" : "-mr-[10px]") : "",
        )}
      />
    )
  }
}
