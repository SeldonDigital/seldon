import { SVGAttributes } from "react"

export function IconMaterialFactory(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M22 22H2V10L9 7V9L14 7V10H17L18 2H21L22 10V22ZM12 9.95L7 11.95V10L4 11.32V20H20V12H12V9.95ZM11 18H13V14H11V18ZM7 18H9V14H7V18ZM17 14H15V18H17V14Z" />
    </svg>
  )
}
