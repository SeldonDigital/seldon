import { SVGProps } from "react"

interface Props extends SVGProps<SVGSVGElement> {
  color: string
}

export const IconSwatchValue = ({ color, ...svgProps }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    {...svgProps}
  >
    <circle cx={8} cy={8} r={7} fill={color} />
    <path
      fill="currentColor"
      d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-9.67 4.81 8.17-4.714V8a5.5 5.5 0 1 0-8.17 4.81Z"
    />
  </svg>
)
