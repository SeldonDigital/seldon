import { SVGProps } from "react"

export const IconPlay = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M8 19V5l11 7-11 7Zm2-3.65L15.25 12 10 8.65v6.7Z"
      />
    </svg>
  )
}
