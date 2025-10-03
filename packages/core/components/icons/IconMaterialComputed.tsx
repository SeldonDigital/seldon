import { SVGAttributes } from "react"

export function IconMaterialComputed(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M3 18V14.4H21V18H3ZM3 9.6V6H21V9.6H3Z" />
    </svg>
  )
}
