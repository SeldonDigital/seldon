import { SVGAttributes } from "react"

export function IconMaterialContextualToken(
  props: SVGAttributes<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M240-320h280v-120H240v120Zm360 0h120v-320H600v320ZM240-520h280v-120H240v120Zm-80 360q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z" />
    </svg>
  )
}
