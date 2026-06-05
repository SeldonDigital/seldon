import { SVGAttributes } from "react"

export function IconLucideExpand(props: SVGAttributes<SVGSVGElement>) {
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
        <path d="m15 15 6 6" />
        <path d="m15 9 6-6" />
        <path d="M21 16v5h-5" />
        <path d="M21 8V3h-5" />
        <path d="M3 16v5h5" />
        <path d="m3 21 6-6" />
        <path d="M3 8V3h5" />
        <path d="M9 9 3 3" />
      </g>
    </svg>
  )
}
