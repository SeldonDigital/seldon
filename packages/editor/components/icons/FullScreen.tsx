import { SVGProps } from "react"

export const IconFullScreen = (props: SVGProps<SVGSVGElement>) => {
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
        d="M5 21c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 3 19v-4h2v4h4v2H5Zm10 0v-2h4v-4h2v4c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 19 21h-4ZM3 9V5c0-.55.196-1.02.587-1.413A1.926 1.926 0 0 1 5 3h4v2H5v4H3Zm16 0V5h-4V3h4c.55 0 1.02.196 1.413.587C20.803 3.98 21 4.45 21 5v4h-2Z"
      />
    </svg>
  )
}
