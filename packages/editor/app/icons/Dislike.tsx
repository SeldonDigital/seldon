import { SVGProps } from "react"

export const IconDislike = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M6 3h11v13l-7 7-1.25-1.25a1.313 1.313 0 0 1-.287-.475 1.636 1.636 0 0 1-.113-.575v-.35L9.45 16H3c-.533 0-1-.2-1.4-.6-.4-.4-.6-.867-.6-1.4v-2c0-.117.017-.242.05-.375s.067-.258.1-.375l3-7.05c.15-.333.4-.617.75-.85C5.25 3.117 5.617 3 6 3Zm9 2H6l-3 7v2h9l-1.35 5.5L15 15.15V5Zm2 11v-2h3V5h-3V3h5v13h-5Z"
        fill="currentColor"
      />
    </svg>
  )
}
