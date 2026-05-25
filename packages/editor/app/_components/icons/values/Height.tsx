import { SVGProps } from "react"

export function IconHeightValue(props: SVGProps<SVGSVGElement>) {
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
        d="M12 21l-4-4 1.4-1.4 1.6 1.575V6.825L9.4 8.4 8 7l4-4 4 4-1.4 1.425-1.6-1.6v10.35l1.6-1.575L16 17l-4 4z"
      ></path>
    </svg>
  )
}
