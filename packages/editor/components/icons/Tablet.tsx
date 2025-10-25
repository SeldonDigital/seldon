import { SVGProps } from "react"

export const IconTablet = (props: SVGProps<SVGSVGElement>) => {
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
        d="M12 20.5c.283 0 .52-.096.713-.288A.968.968 0 0 0 13 19.5a.968.968 0 0 0-.287-.712A.968.968 0 0 0 12 18.5a.968.968 0 0 0-.713.288.968.968 0 0 0-.287.712c0 .283.096.52.287.712.192.192.43.288.713.288ZM5 23c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 3 21V3c0-.55.196-1.02.587-1.413A1.926 1.926 0 0 1 5 1h14c.55 0 1.02.196 1.413.587C20.803 1.98 21 2.45 21 3v18c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 19 23H5Zm0-5v3h14v-3H5Zm0-2h14V6H5v10ZM5 4h14V3H5v1Z"
      />
    </svg>
  )
}
