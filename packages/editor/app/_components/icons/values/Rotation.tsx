import { SVGProps } from "react"

export function IconRotationValue(props: SVGProps<SVGSVGElement>) {
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
        d="M2 22v-2h20v2H2zM13.625 20c0-1.33-.252-2.578-.756-3.747a9.734 9.734 0 00-2.063-3.06 9.731 9.731 0 00-3.06-2.062A9.357 9.357 0 004 10.375V9c1.513 0 2.936.29 4.271.868 1.335.579 2.5 1.366 3.498 2.363a11.185 11.185 0 012.363 3.498C14.711 17.064 15 18.488 15 20h-1.375z"
      ></path>
      <path fill="currentColor" d="M4 22H2V2h2v20z"></path>
    </svg>
  )
}
