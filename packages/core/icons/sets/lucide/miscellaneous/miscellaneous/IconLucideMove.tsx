import { SVGAttributes } from "react"

export function IconLucideMove(props: SVGAttributes<SVGSVGElement>) {
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
        <path d="M12 2v20" />
        <path d="m15 19-3 3-3-3" />
        <path d="m19 9 3 3-3 3" />
        <path d="M2 12h20" />
        <path d="m5 9-3 3 3 3" />
        <path d="m9 5 3-3 3 3" />
      </g>
    </svg>
  )
}
