import type { SVGAttributes } from "react"

export function IconMaterialAlignHorizontalLeft(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{
        __html: '<path fill="currentColor" d="M2 22V2h2v20zm4-5v-3h10v3zm0-7V7h16v3z"/>',
      }}
    />
  )
}
