import { SVGProps } from "react"

export const IconDesktop = (props: SVGProps<SVGSVGElement>) => {
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
        d="M8 21v-1l2-2H4c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 2 16V5c0-.55.196-1.02.587-1.413A1.926 1.926 0 0 1 4 3h16c.55 0 1.02.196 1.413.587C21.803 3.98 22 4.45 22 5v11c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 20 18h-6l2 2v1H8Zm-4-8h16V5H4v8Z"
      />
    </svg>
  )
}
