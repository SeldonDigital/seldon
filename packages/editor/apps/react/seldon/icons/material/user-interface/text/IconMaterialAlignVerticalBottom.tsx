import type { SVGAttributes } from "react"

export function IconMaterialAlignVerticalBottom(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{
        __html: '<path fill="currentColor" d="M2 22v-2h20v2zm5-4V2h3v16zm7 0V8h3v10z"/>',
      }}
    />
  )
}
