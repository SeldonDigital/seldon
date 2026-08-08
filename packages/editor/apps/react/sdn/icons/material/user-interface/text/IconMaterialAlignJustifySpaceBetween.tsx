import type { SVGAttributes } from "react"

export function IconMaterialAlignJustifySpaceBetween(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{
        __html: '<path fill="currentColor" d="M20 22v-5h-3V7h3V2h2v20zM2 22V2h2v5h3v10H4v5z"/>',
      }}
    />
  )
}
