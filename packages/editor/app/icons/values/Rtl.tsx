import { SVGProps } from "react"

export function IconRtlValue(props: SVGProps<SVGSVGElement>) {
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
        d="M4 18H2V6h2v12zm8 0l-6-6 6-6 1.4 1.4L9.825 11H22v2H9.825l3.6 3.6L12 18z"
      ></path>
    </svg>
  )
}
