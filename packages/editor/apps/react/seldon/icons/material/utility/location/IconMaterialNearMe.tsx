import type { SVGAttributes } from "react"

export function IconMaterialNearMe(props: SVGAttributes<SVGSVGElement>) {
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
          '<path fill="currentColor" d="m12.9 21l-2.85-7.05L3 11.1V9.7L21 3l-6.7 18zm.65-3.7L17.6 6.4L6.7 10.45l4.9 1.95zm-1.95-4.9"/>',
      }}
    />
  )
}
