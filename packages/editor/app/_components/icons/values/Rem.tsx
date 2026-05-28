import { SVGProps } from "react"

export function IconRemValue(props: SVGProps<SVGSVGElement>) {
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
        d="M3.31 10.5h-.778V5.614H4.36c.467 0 .821.13 1.064.392.247.261.371.62.371 1.078 0 .373-.09.681-.273.924-.182.243-.443.392-.784.448L5.864 10.5h-.868L3.96 8.526h-.65V10.5Zm.937-2.604c.485 0 .728-.222.728-.665V6.93c0-.443-.243-.665-.728-.665H3.31v1.631h.938ZM6.503 10.5V5.614h3.06v.658H7.286v1.421h2.191v.658h-2.19v1.491h2.274v.658H6.503Zm6.47-2.338.022-1.47h-.056l-.98 2.513-.98-2.513h-.056l.02 1.47V10.5h-.692V5.614h.959l.749 1.939h.049l.756-1.939h.903V10.5h-.693V8.162Z"
      />
    </svg>
  )
}
