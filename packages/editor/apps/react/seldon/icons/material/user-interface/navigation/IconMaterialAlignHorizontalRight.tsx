import type { SVGAttributes } from "react"

export function IconMaterialAlignHorizontalRight(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{
        __html: '<path fill="currentColor" d="M20 22V2h2v20zM8 17v-3h10v3zm-6-7V7h16v3z"/>',
      }}
    />
  )
}
