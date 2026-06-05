import { SVGProps } from "react"

export function IconWrapValue(props: SVGProps<SVGSVGElement>) {
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
        d="M4 20V4h2v16H4zm14 0V4h2v16h-2zm-7.4-2.45L7.05 14l3.55-3.525 1.4 1.4L10.875 13H13c.55 0 1.02-.196 1.412-.588.392-.391.588-.862.588-1.412 0-.55-.196-1.02-.588-1.412A1.926 1.926 0 0013 9H7V7h6c1.1 0 2.042.392 2.825 1.175C16.608 8.958 17 9.9 17 11s-.392 2.042-1.175 2.825C15.042 14.608 14.1 15 13 15h-2.125L12 16.125l-1.4 1.425z"
      ></path>
    </svg>
  )
}
