import { SVGProps } from "react"

export function IconStyleValue(props: SVGProps<SVGSVGElement>) {
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
        d="M6 21q-1.125 0-2.225-.55T2 19q.65 0 1.325-.512Q4 17.975 4 17q0-1.25.875-2.125A2.9 2.9 0 0 1 7 14q1.25 0 2.125.875T10 17q0 1.65-1.175 2.825T6 21m0-2q.824 0 1.412-.587Q8 17.825 8 17a.97.97 0 0 0-.287-.712A.97.97 0 0 0 7 16a.97.97 0 0 0-.713.288A.97.97 0 0 0 6 17q0 .575-.138 1.05a4.7 4.7 0 0 1-.362.9q.125.05.25.05zm5.75-4L9 12.25l8.95-8.95a.98.98 0 0 1 .688-.287.93.93 0 0 1 .712.287l1.35 1.35q.3.3.3.7t-.3.7z"
      ></path>
    </svg>
  )
}
