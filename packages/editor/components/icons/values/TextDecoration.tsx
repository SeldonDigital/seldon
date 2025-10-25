import { SVGProps } from "react"

export function IconTextDecoration(props: SVGProps<SVGSVGElement>) {
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
        d="M4 12V10H20V12H4ZM10.5 8V5H5V2H19V5H13.5V8H10.5ZM10.5 18V14H13.5V18H10.5Z"
        fill="currentColor"
      />
      <path d="M4 20V22H20V20H4Z" fill="currentColor" />
    </svg>
  )
}
