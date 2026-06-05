import { SVGAttributes } from "react"

export function IconLucideFactory(props: SVGAttributes<SVGSVGElement>) {
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
        <path d="M12 16h.01" />
        <path d="M16 16h.01" />
        <path d="M8 16h.01" />
      </g>
    </svg>
  )
}
