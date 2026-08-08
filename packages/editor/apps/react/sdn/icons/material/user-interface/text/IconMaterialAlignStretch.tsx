import type { SVGAttributes } from "react"

export function IconMaterialAlignStretch(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{
        __html: '<path fill="currentColor" d="M7 10V4H2V2h20v2h-5v6zM2 22v-2h5v-6h10v6h5v2z"/>',
      }}
    />
  )
}
