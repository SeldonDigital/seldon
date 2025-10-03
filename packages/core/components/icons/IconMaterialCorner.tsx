import { SVGAttributes } from "react"

export function IconMaterialCorner(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M18.75 21C18.75 18.825 18.3375 16.7813 17.5125 14.8688C16.6875 12.9563 15.5625 11.2875 14.1375 9.8625C12.7125 8.4375 11.0438 7.3125 9.13125 6.4875C7.21875 5.6625 5.175 5.25 3 5.25V3C5.475 3 7.80469 3.47344 9.98906 4.42031C12.1734 5.36719 14.0813 6.65625 15.7125 8.2875C17.3438 9.91875 18.6328 11.8266 19.5797 14.0109C20.5266 16.1953 21 18.525 21 21H18.75Z" />
    </svg>
  )
}
