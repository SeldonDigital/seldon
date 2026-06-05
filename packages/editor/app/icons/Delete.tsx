import { SVGProps } from "react"

export const IconDelete = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <g
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke="current"
        strokeWidth="1.5px"
      >
        <circle cx={12} cy={12} r={9} />
        <path d="m5 19 13-13" />
      </g>
    </svg>
  )
}
