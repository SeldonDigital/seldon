import { SVGProps } from "react"

export function IconBackgroundValue(props: SVGProps<SVGSVGElement>) {
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
        d="M5 21c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 013 19V5c0-.55.196-1.02.587-1.413A1.926 1.926 0 015 3h14c.55 0 1.02.196 1.413.587C20.803 3.98 21 4.45 21 5v14c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0119 21H5zm0-2h14V5H5v14z"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M11 4l-7 7-.707-.707 7-7L11 4zM16 4L4 16l-.707-.707 12-12L16 4zM20 5L5 20l-.707-.707 15-15L20 5zM21 9L10 20l-.707-.707 11-11L21 9zM20 15l-5 5-.707-.707 5-5L20 15z"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}
