import { SVGProps } from "react"

export function IconGradientValue(props: SVGProps<SVGSVGElement>) {
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
        d="M11 13v-2h2v2h-2zm-2 2v-2h2v2H9zm4 0v-2h2v2h-2zm2-2v-2h2v2h-2zm-8 0v-2h2v2H7zm-2 8c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 013 19V5c0-.55.196-1.02.587-1.413A1.926 1.926 0 015 3h14c.55 0 1.02.196 1.413.587C20.803 3.98 21 4.45 21 5v14c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0119 21H5zm2-2h2v-2H7v2zm4 0h2v-2h-2v2zm-6-2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2h-2v-2h2V5H5v8h2v2H5v2zm10 0v2h2v-2h-2z"
      ></path>
    </svg>
  )
}
