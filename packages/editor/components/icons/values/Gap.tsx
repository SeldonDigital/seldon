import { SVGProps } from "react"

export function IconGapValue(props: SVGProps<SVGSVGElement>) {
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
        d="M3 3h18v2H3V3zm0 16h18v2H3v-2zm8-12h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"
      ></path>
    </svg>
  )
}
