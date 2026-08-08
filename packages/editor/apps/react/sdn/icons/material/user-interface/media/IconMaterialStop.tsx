import type { SVGAttributes } from "react"

export function IconMaterialStop(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{
        __html: '<path fill="currentColor" d="M8 8v8zM6 18V6h12v12zm2-2h8V8H8z"/>',
      }}
    />
  )
}
