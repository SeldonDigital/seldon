import type { SVGAttributes } from "react"

export function IconMaterialAlignStart(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{
        __html: '<path fill="currentColor" d="M2 4V2h20v2zm5 6V7h10v3zm0 6v-3h10v3z"/>',
      }}
    />
  )
}
