import { SVGProps } from "react"

interface Props extends Omit<SVGProps<SVGSVGElement>, "color"> {
  color: string | null
}

export function IconColorValue({ color, ...svgProps }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      {...svgProps}
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
      {color && (
        <>
          <rect width={14} height={14} x={1} y={1} fill={color} rx={7} />
          <rect
            width={12.5}
            height={12.5}
            x={1.75}
            y={1.75}
            stroke="#fff"
            strokeWidth={1.5}
            rx={6.25}
          />
        </>
      )}
    </svg>
  )
}
