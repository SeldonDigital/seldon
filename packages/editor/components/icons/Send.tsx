import { SVGProps } from "react"

export const IconSend = (props: SVGProps<SVGSVGElement>) => {
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
        d="M4 20V4l19 8-19 8zm2-3l11.85-5L6 7v3.5l6 1.5-6 1.5V17z"
      />
    </svg>
  )
}
