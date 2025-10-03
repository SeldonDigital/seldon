import { SVGAttributes } from "react"

export function IconMaterialIconImage(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M14.25 10.5L18.75 16.4375H5.25001L9.00003 12L11.3438 14.0625L14.25 10.5Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 22C3.45 22 2.97917 21.8042 2.5875 21.4125C2.19583 21.0208 2 20.55 2 20V4C2 3.45 2.19583 2.97917 2.5875 2.5875C2.97917 2.19583 3.45 2 4 2H20C20.55 2 21.0208 2.19583 21.4125 2.5875C21.8042 2.97917 22 3.45 22 4V20C22 20.55 21.8042 21.0208 21.4125 21.4125C21.0208 21.8042 20.55 22 20 22H4ZM20 4V20H4V4H20Z"
      />
    </svg>
  )
}
