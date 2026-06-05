import { SVGAttributes } from "react"

export function IconLucideListChevronsDownUp(
  props: SVGAttributes<SVGSVGElement>,
) {
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
        <path d="M3 5h8" />
        <path d="M3 12h8" />
        <path d="M3 19h8" />
        <path d="m15 5 3 3 3-3" />
        <path d="m15 19 3-3 3 3" />
      </g>
    </svg>
  )
}
