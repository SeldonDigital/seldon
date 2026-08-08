import type { SVGAttributes } from "react"

export function IconMaterialNavigation(props: SVGAttributes<SVGSVGElement>) {
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
          '<path fill="currentColor" d="m5 21l-1-1l8-18l8 18l-1 1l-7-3zm2.1-3.1l4.9-2.1l4.9 2.1l-4.9-11zm4.9-2.1"/>',
      }}
    />
  )
}
