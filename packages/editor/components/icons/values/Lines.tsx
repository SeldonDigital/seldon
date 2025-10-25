import { SVGProps } from "react"

export function IconLinesValue(props: SVGProps<SVGSVGElement>) {
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
        d="M3 18v-2h12v2H3zm0-5v-2h12v2H3zm0-5V6h18v2H3z"
      ></path>
    </svg>
  )
}
