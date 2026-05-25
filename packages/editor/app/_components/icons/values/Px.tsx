import { SVGProps } from "react"

export function IconPxValue(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <rect width={16} height={16} fill="#fff" fillOpacity={0.1} rx={3} />
      <path
        fill="currentColor"
        d="M4.51 10.5V5.614h1.828c.466 0 .821.13 1.064.392.247.261.37.62.37 1.078 0 .457-.123.817-.37 1.078-.243.261-.598.392-1.064.392H5.295V10.5H4.51Zm.785-2.597h.924c.485 0 .728-.224.728-.672V6.93c0-.443-.243-.665-.728-.665h-.924v1.638Zm6.659 2.597h-.889l-.553-.966-.518-.924h-.042l-.532.924-.574.966h-.833l1.498-2.506-1.407-2.38h.889l.497.875.504.903h.035l.504-.903.518-.875h.833l-1.414 2.38 1.484 2.506Z"
      />
    </svg>
  )
}
