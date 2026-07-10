// Editor chrome: renders a computed theme's palette as an overlapping swatch
// cluster. Prop-driven and factory-inert, so it lives in the editor rather than
// the generated View layer.
import { CSSProperties } from "react"
import { SwatchDot } from "./SwatchDot"

interface ThemeSwatchesProps {
  colors: string[]
  isSelected?: boolean
}

const containerStyle: CSSProperties = { position: "relative", display: "flex" }

export function ThemeSwatches({
  colors,
  isSelected = false,
}: ThemeSwatchesProps) {
  return (
    <div style={containerStyle}>
      {colors.map((color, index) => (
        <SwatchDot
          key={index}
          color={color}
          index={index}
          isSelected={isSelected}
        />
      ))}
    </div>
  )
}
