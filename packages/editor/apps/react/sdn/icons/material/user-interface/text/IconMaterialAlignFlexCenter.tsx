import type { SVGAttributes } from "react"

export function IconMaterialAlignFlexCenter(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{
        __html: '<path fill="currentColor" d="M11 22v-8.5H3v-3h8V2h2v8.5h8v3h-8V22z"/>',
      }}
    />
  )
}
