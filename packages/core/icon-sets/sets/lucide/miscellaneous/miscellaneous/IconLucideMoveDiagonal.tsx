import { SVGAttributes } from "react"

export function IconLucideMoveDiagonal(props: SVGAttributes<SVGSVGElement>) {
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
        <path d="M11 19H5v-6" />
        <path d="M13 5h6v6" />
        <path d="M19 5 5 19" />
      </g>
    </svg>
  )
}
