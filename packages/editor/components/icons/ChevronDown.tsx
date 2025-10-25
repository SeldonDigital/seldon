import { SVGProps } from "react"

export const IconChevronDown = (props: SVGProps<SVGSVGElement>) => {
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
        d="M12 16.375l-6-6 1.4-1.4 4.6 4.6 4.6-4.6 1.4 1.4-6 6z"
      />
    </svg>
  )
}
