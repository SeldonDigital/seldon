import { SVGAttributes } from "react"

export function IconMaterialClip(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M4.22284 22H2V19.7772H4.22284V22Z" />
      <path d="M8.66667 22H6.44382V19.7772H8.66667V22Z" />
      <path d="M13.1105 22H10.8895V19.7772H13.1105V22Z" />
      <path d="M17.5562 22H15.3333V19.7772H17.5562V22Z" />
      <path d="M22 22H19.7772V19.7772H22V22Z" />
      <path d="M4.22284 17.5562H2V15.3333H4.22284V17.5562Z" />
      <path d="M22 17.5562H19.7772V15.3333H22V17.5562Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 2V13.1105H2V2H22ZM4.22284 4.22284V10.8895H19.7772V4.22284H4.22284Z"
      />
    </svg>
  )
}
