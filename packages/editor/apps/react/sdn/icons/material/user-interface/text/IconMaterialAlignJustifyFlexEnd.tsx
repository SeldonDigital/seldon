import type { SVGAttributes } from "react"

export function IconMaterialAlignJustifyFlexEnd(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{
        __html: '<path fill="currentColor" d="M20 22V2h2v20zm-6-5V7h3v10zm-6 0V7h3v10z"/>',
      }}
    />
  )
}
