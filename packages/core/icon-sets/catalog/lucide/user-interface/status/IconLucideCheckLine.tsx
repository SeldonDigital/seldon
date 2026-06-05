import { SVGAttributes } from "react"

export function IconLucideCheckLine(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <g transform="translate(0, -960) scale(40)">
        <path d="M20 4L9 15" />
        <path d="M21 19L3 19" />
        <path d="M9 15L4 10" />
      </g>
    </svg>
  )
}
