import type { SVGAttributes } from "react"

export function IconMaterialFlag(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{
        __html:
          '<path fill="currentColor" d="M5 21V4h9l.4 2H20v10h-7l-.4-2H7v7zm9.65-7H18V8h-5.25l-.4-2H7v6h7.25z"/>',
      }}
    />
  )
}
