import { SVGProps } from "react"

export function IconBorderStyleValue(props: SVGProps<SVGSVGElement>) {
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
        d="M7 21v-2h2v2H7zm4 0v-2h2v2h-2zm4 0v-2h2v2h-2zm4 0v-2h2v2h-2zm0-4v-2h2v2h-2zm0-4v-2h2v2h-2zm0-4V7h2v2h-2zM3 21V3h18v2H5v16H3z"
      ></path>
    </svg>
  )
}
