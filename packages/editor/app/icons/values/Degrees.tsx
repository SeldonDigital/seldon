import { SVGProps } from "react"

export function IconDegreesValue(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      {...props}
    >
      <rect
        width={14}
        height={14}
        x={1}
        y={1}
        fill="#fff"
        fillOpacity={0.1}
        rx={3}
      />
      <circle cx={8} cy={8} r={1.5} stroke="currentColor" />
    </svg>
  )
}
