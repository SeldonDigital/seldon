import type { SVGAttributes } from "react"

export function IconMaterialAlignItemsStretch(props: SVGAttributes<SVGSVGElement>) {
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
          '<path fill="currentColor" d="M7 18V6h3v12zm7 0V6h3v12zM2 4V2h20v2zm0 18v-2h20v2z"/>',
      }}
    />
  )
}
