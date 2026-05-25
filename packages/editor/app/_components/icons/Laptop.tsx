import { SVGProps } from "react"

export const IconLaptop = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <g clipPath="url(#a)">
        <path
          fill="currentColor"
          d="M2 20c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 0 18h4c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 2 16V5c0-.55.196-1.02.587-1.413A1.926 1.926 0 0 1 4 3h16c.55 0 1.02.196 1.413.587C21.803 3.98 22 4.45 22 5v11c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 20 18h4c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 22 20H2Zm10-1c.283 0 .52-.096.713-.288A.968.968 0 0 0 13 18a.968.968 0 0 0-.287-.712A.968.968 0 0 0 12 17a.968.968 0 0 0-.713.288A.968.968 0 0 0 11 18c0 .283.096.52.287.712.192.192.43.288.713.288Zm-8-3h16V5H4v11Z"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
