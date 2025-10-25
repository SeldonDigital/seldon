import { SVGProps } from "react"

export function IconOpacityValue(props: SVGProps<SVGSVGElement>) {
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
        d="M12 21c-2.217 0-4.104-.767-5.662-2.3C4.779 17.167 4 15.3 4 13.1c0-1.083.208-2.096.625-3.037A8.24 8.24 0 016.35 7.55L12 2l5.65 5.55a8.242 8.242 0 011.725 2.513c.417.941.625 1.954.625 3.037 0 2.2-.78 4.067-2.337 5.6C16.104 20.233 14.217 21 12 21zm-5.95-7H17.9c.2-1.2.088-2.225-.337-3.075-.425-.85-.863-1.492-1.313-1.925L12 4.8 7.75 9c-.45.433-.892 1.075-1.325 1.925-.433.85-.558 1.875-.375 3.075z"
      ></path>
    </svg>
  )
}
