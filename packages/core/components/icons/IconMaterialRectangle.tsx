import { SVGAttributes } from "react"

export function IconMaterialRectangle(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M2 4V20H22V4H2ZM20 18H4V6H20V18Z" />
    </svg>
  )
}
