import { SVGAttributes } from "react"

export function IconMaterialVector(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M12.25 8.49998L16.75 14.4375H3.25001L7.00003 9.99998L9.34376 12.0625L12.25 8.49998Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195834 1.45 0 2 0H18C18.55 0 19.0208 0.195834 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H2ZM18 2V18H2V2H18Z"
      />
    </svg>
  )
}
