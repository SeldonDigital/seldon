import { SVGProps } from "react"

export const IconPlus = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
      style={{ flexShrink: 0, ...props.style }}
    >
      <line
        x1="12"
        y1="6"
        x2="12"
        y2="18"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="6"
        y1="12"
        x2="18"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}
