import { SVGAttributes } from "react"

export function IconMaterialMouse(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M20 8.965C19.96 4.575 16.4 1.035 12 1.035C7.6 1.035 4.04 4.575 4 8.965V14.965C4 19.385 7.58 22.965 12 22.965C16.42 22.965 20 19.385 20 14.965V8.965ZM18 8.965H13V3.125C15.81 3.595 17.96 6.025 18 8.965ZM11 3.125V8.965H6C6.04 6.025 8.19 3.595 11 3.125ZM18 14.965C18 18.275 15.31 20.965 12 20.965C8.69 20.965 6 18.275 6 14.965V10.965H18V14.965Z" />
    </svg>
  )
}
