// BESPOKE-VIEW: hand-authored transitional View. Replace with a generated
// workspace component once one covers the theme swatch cluster.
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
