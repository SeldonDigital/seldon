import { SVGProps } from "react"

export function IconBorderColorValue(props: SVGProps<SVGSVGElement>) {
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
        d="M2 24v-4h20v4H2zm4-8h1.4l7.8-7.775-.725-.725-.7-.7L6 14.6V16zm-2 2v-4.25L15.2 2.575A1.975 1.975 0 0116.6 2c.267 0 .525.05.775.15.25.1.475.25.675.45L19.425 4c.2.183.346.4.438.65.091.25.137.508.137.775 0 .25-.046.496-.137.737a1.874 1.874 0 01-.438.663L8.25 18H4zm11.2-9.775l-.725-.725-.7-.7L15.2 8.225z"
      ></path>
    </svg>
  )
}
