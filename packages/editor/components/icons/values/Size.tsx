import { SVGProps } from "react"

export function IconSizeValue(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.75 13.25v-3.5h1.167v1.517l1.808-1.809.817.817-1.809 1.808H6.25v1.167h-3.5Zm7 0v-1.167h1.517l-1.809-1.808.817-.817 1.808 1.809V9.75h1.167v3.5h-3.5ZM5.725 6.542 3.917 4.733V6.25H2.75v-3.5h3.5v1.167H4.733l1.809 1.808-.817.817Zm4.55 0-.817-.817 1.809-1.808H9.75V2.75h3.5v3.5h-1.167V4.733l-1.808 1.809Z"
        clipRule="evenodd"
      />
    </svg>
  )
}
