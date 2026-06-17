import { SVGAttributes } from "react"

export function IconLucideGroup(props: SVGAttributes<SVGSVGElement>) {
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
        <path d="M3 7V5c0-1.1.9-2 2-2h2" />
        <path d="M17 3h2c1.1 0 2 .9 2 2v2" />
        <path d="M21 17v2c0 1.1-.9 2-2 2h-2" />
        <path d="M7 21H5c-1.1 0-2-.9-2-2v-2" />
      </g>
    </svg>
  )
}
