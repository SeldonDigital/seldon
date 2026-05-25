import { SVGProps } from "react"

export function IconButton(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M4 18c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 2 16V8c0-.55.196-1.02.587-1.412A1.926 1.926 0 0 1 4 6h16c.55 0 1.02.196 1.413.588.391.391.587.862.587 1.412v8c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 20 18H4Zm0-2h16V8H4v8Z"
      />
      <path
        fill="currentColor"
        d="M15.652 14.652 14.59 13.59 16.181 12l-1.59-1.591 1.06-1.06L18.304 12l-2.651 2.652Z"
      />
    </svg>
  )
}
