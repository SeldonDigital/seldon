import { SVGProps } from "react"

export function IconShadowValue(props: SVGProps<SVGSVGElement>) {
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
        d="M4 22c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 012 20V8c0-.55.196-1.02.587-1.412A1.926 1.926 0 014 6h2V4c0-.55.196-1.02.588-1.413A1.926 1.926 0 018 2h12c.55 0 1.02.196 1.413.587C21.803 2.98 22 3.45 22 4v12c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0120 18h-2v2c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0116 22H4zm4-6h12V4H8v12z"
      ></path>
    </svg>
  )
}
