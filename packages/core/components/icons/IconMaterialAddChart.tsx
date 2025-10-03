import { SVGAttributes } from "react"

export function IconMaterialAddChart(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M19 19H5V5H14V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V10H19V19Z" />
      <path d="M17 13H15V17H17V13Z" />
      <path d="M9 10H7V17H9V10Z" />
      <path d="M13 7H11V17H13V7Z" />
      <path d="M19 5V3H17V5H15V7H17V9H19V7H21V5H19Z" />
    </svg>
  )
}
