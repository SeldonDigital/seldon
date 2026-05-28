import { SVGAttributes } from "react"

export function IconMaterialDoubleArrow(props: SVGAttributes<SVGSVGElement>) {
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
        <path d="M15.5 5H11l5 7-5 7h4.5l5-7z" />
        <path d="M8.5 5H4l5 7-5 7h4.5l5-7z" />
      </g>
    </svg>
  )
}
