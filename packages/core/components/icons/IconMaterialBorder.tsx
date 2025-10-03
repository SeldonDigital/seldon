import { SVGAttributes } from "react"

export function IconMaterialBorder(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M2 21V19.875H22V21H2ZM2 17.625V15.375H22V17.625H2ZM2 13.125V9.75H22V13.125H2ZM2 7.5V3H22V7.5H2Z" />
    </svg>
  )
}
