import type { SVGAttributes } from "react"

export function IconMaterialAlignJustifyCenter(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{
        __html: '<path fill="currentColor" d="M11 22V2h2v20zm4-5V7h3v10zm-9 0V7h3v10z"/>',
      }}
    />
  )
}
