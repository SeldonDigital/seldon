import { SVGAttributes } from "react"

export function IconMaterialSquare(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M3 3V21H21V3H3ZM19 19H5V5H19V19Z" />
    </svg>
  )
}
