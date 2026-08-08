import type { SVGAttributes } from "react"

export function IconMaterialAlignVerticalTop(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{
        __html: '<path fill="currentColor" d="M7 22V6h3v16zm7-6V6h3v10zM2 4V2h20v2z"/>',
      }}
    />
  )
}
