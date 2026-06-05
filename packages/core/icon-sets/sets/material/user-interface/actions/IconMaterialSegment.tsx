import { SVGAttributes } from "react"

export function IconMaterialSegment(props: SVGAttributes<SVGSVGElement>) {
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
        <path d="M9 18h12v-2H9v2zM3 6v2h18V6H3zm6 7h12v-2H9v2z" />
      </g>
    </svg>
  )
}
