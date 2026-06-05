import { SVGProps } from "react"

export function IconWidthValue(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M7 16l-4-4 4-4 1.425 1.4-1.6 1.6h10.35L15.6 9.4 17 8l4 4-4 4-1.4-1.4 1.575-1.6H6.825L8.4 14.6 7 16z"
      ></path>
    </svg>
  )
}
