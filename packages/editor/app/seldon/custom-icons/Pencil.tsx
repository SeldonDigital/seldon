import { SVGProps } from "react"

export const IconPencil = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M4.175 21a.916.916 0 0 1-.913-.263.916.916 0 0 1-.262-.912l1-4.775L8.95 20l-4.775 1Zm4.775-1L4 15.05 15.45 3.6c.383-.383.858-.575 1.425-.575.567 0 1.042.192 1.425.575l2.1 2.1c.383.383.575.858.575 1.425 0 .567-.192 1.042-.575 1.425L8.95 20Zm7.925-15L6.525 15.35l2.125 2.125L19 7.125 16.875 5Z"
        fill="currentColor"
      />
    </svg>
  )
}
