import { SVGProps } from "react"

export function IconSeldonFrameBackground(props: SVGProps<SVGSVGElement>) {
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
        d="M5 21c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 3 19V5c0-.55.196-1.02.587-1.413A1.926 1.926 0 0 1 5 3h14c.55 0 1.02.196 1.413.587C20.803 3.98 21 4.45 21 5v14c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 19 21H5Zm0-2h14V5H5v14Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m11 4-7 7-.707-.707 7-7L11 4ZM16 4 4 16l-.707-.707 12-12L16 4ZM20 5 5 20l-.707-.707 15-15L20 5ZM21 9 10 20l-.707-.707 11-11L21 9ZM20 15l-5 5-.707-.707 5-5L20 15Z"
        clipRule="evenodd"
      />
    </svg>
  )
}
