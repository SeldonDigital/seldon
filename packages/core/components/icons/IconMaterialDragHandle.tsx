import { SVGAttributes } from "react"

export function IconMaterialDragHandle(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M20 9H4V11H20V9ZM4 15H20V13H4V15Z" />
    </svg>
  )
}
