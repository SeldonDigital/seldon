// BESPOKE-VIEW: hand-authored SVG icon asset. Raw svg markup, not a generated
// View.
import { CSSProperties, SVGProps } from "react"

interface Props extends Omit<SVGProps<SVGSVGElement>, "color"> {
  color?: string | null | undefined
}

// The chip ring reads against the panel, not the swatch: the mode block inverts
// swatch lightness, so `offBlack` renders dark in light mode and near-white in
// dark mode. This is the same token the panel's `--separator-border` uses.
const ringStyle: CSSProperties = { stroke: "var(--sdn-swatch-offBlack)" }

export function IconCustomColorValue(props: Props) {
  const { color, ...svgProps } = props
  const colorValue = color ?? null
  // Type assertion needed because svgProps may include color from IconProps spread
  const cleanSvgProps = svgProps as Omit<SVGProps<SVGSVGElement>, "color">
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      {...cleanSvgProps}
    >
      <rect
        width={14}
        height={14}
        x={1}
        y={1}
        fill="#fff"
        fillOpacity={0.1}
        rx={7}
      />
      {colorValue && (
        <>
          <rect width={14} height={14} x={1} y={1} fill={colorValue} rx={7} />
          <rect
            width={12.5}
            height={12.5}
            x={1.75}
            y={1.75}
            style={ringStyle}
            strokeWidth={1.5}
            rx={6.25}
          />
        </>
      )}
    </svg>
  )
}
