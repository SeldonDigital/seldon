import { SVGAttributes } from "react"

interface QuestionMarkProps extends SVGAttributes<SVGElement> {
  className?: string
}

export function QuestionMark({ className = "", ...props }: QuestionMarkProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <circle
        cx="8"
        cy="8"
        r="7"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M6.5 6.5C6.5 5.67157 7.17157 5 8 5C8.82843 5 9.5 5.67157 9.5 6.5C9.5 7.32843 8.82843 8 8 8V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="11.5" r="0.5" fill="currentColor" />
    </svg>
  )
}
