import { Theme, ThemeSwatchKey } from "@seldon/core"
import { themeSwatchToCssBackground } from "@seldon/core/helpers/color/theme-swatch-to-css-background"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { isSwatchToken } from "@seldon/core/themes/values"

interface ThemeSwatchesProps {
  theme: Theme
  isSelected?: boolean
}

/** Overlap each swatch except the last; selected rows overlap a little less. */
function getSwatchMarginRight(
  index: number,
  isSelected: boolean,
): string | undefined {
  if (index >= 4) return undefined
  return isSelected ? "-7px" : "-10px"
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
    <div style={{ position: "relative", display: "flex" }}>
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
        className="shadow-dieter-rams-button"
        style={{
          zIndex: 5 - i,
          display: "block",
          height: "0.75rem",
          width: "0.75rem",
          borderRadius: "9999px",
          backgroundColor: backgroundColor ?? "var(--color-blue)",
          marginRight: getSwatchMarginRight(i, isSelected),
        }}
      />
    )
  }
}
