import { cn } from "@lib/utils/cn"
import { SVGProps } from "react"

export const IconChevronLeft = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      className={cn("shrink-0", props.className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="m13 18-6-6 6-6 1.4 1.4L9.8 12l4.6 4.6L13 18Z"
      />
    </svg>
  )
}
