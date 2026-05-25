import { SVGProps } from "react"

export const IconPosition = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        d="M7 21v-2h2v2H7zm4 0v-2h2v2h-2zm4 0v-2h2v2h-2zm4 0v-2h2v2h-2zm0-4v-2h2v2h-2zm0-4v-2h2v2h-2zm0-4V7h2v2h-2zM3 19v2h2v-2H3zM19 3v2h2V3h-2zM15 3v2h2V3h-2zM11 3v2h2V3h-2zM9 9v6h6V9H9zM7 3v2h2V3H7zM3 3v2h2V3H3zM3 15v2h2v-2H3zM3 11v2h2v-2H3zM3 7v2h2V7H3z"
        fill="currentColor"
      />
    </svg>
  )
}
