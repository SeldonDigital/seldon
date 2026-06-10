import { SVGAttributes } from "react"

export function IconMaterialToolbar(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-520h560v-120H200v120Zm560 80H200v360h560v-360Zm-560-80v80-80Zm0 0v-120 120Zm0 80v360-360Z" />
    </svg>
  )
}
