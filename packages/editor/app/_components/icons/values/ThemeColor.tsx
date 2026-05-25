import { SVGProps } from "react"

interface Props extends Omit<SVGProps<SVGSVGElement>, "color"> {
  color: string | null
}

export function IconThemeColorValue({ color, ...svgProps }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...svgProps}
    >
      <circle cx="12" cy="12" r="10" fill={color ?? ""} />
      <path
        fill="white"
        fillRule="evenodd"
        d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10ZM8.186 18.87l11.67-6.733.001-.137a7.857 7.857 0 1 0-11.671 6.87Z"
        clipRule="evenodd"
      />
    </svg>
  )
}
