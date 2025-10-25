import { SVGProps } from "react"

export const IconPhone = (props: SVGProps<SVGSVGElement>) => {
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
        d="M7 23c-.55 0-1.02-.196-1.412-.587A1.926 1.926 0 0 1 5 21V3c0-.55.196-1.02.588-1.413A1.926 1.926 0 0 1 7 1h10c.55 0 1.02.196 1.413.587C18.803 1.98 19 2.45 19 3v18c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 17 23H7Zm0-5v3h10v-3H7Zm5 2.5c.283 0 .52-.096.713-.288A.968.968 0 0 0 13 19.5a.968.968 0 0 0-.287-.712A.968.968 0 0 0 12 18.5a.968.968 0 0 0-.713.288.968.968 0 0 0-.287.712c0 .283.096.52.287.712.192.192.43.288.713.288ZM7 16h10V6H7v10ZM7 4h10V3H7v1Z"
      />
    </svg>
  )
}
