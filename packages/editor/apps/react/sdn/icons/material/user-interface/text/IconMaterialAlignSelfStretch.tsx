import type { SVGAttributes } from "react"

export function IconMaterialAlignSelfStretch(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{
        __html: '<path fill="currentColor" d="M2 4V2h20v2zm0 18v-2h20v2zm8.5-4.5V6h3v11.5z"/>',
      }}
    />
  )
}
