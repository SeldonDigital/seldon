import { SVGAttributes } from "react"

export function IconLucideSquareDashedMousePointer(
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
        <path d="M5 3a2 2 0 0 0-2 2" />
        <path d="M19 3a2 2 0 0 1 2 2" />
        <path d="M5 21a2 2 0 0 1-2-2" />
        <path d="M9 3h1" />
        <path d="M9 21h2" />
        <path d="M14 3h1" />
        <path d="M3 9v1" />
        <path d="M21 9v2" />
        <path d="M3 14v1" />
      </g>
    </svg>
  )
}
