import { SVGAttributes } from "react"

export function IconMaterialDataArray(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M15 4V6H18V18H15V20H20V4H15Z" />
      <path d="M4 20H9V18H6V6H9V4H4V20Z" />
    </svg>
  )
}
