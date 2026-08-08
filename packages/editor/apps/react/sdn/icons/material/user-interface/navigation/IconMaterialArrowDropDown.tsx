import type { SVGAttributes } from "react"

export function IconMaterialArrowDropDown(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{ __html: '<path fill="currentColor" d="m12 15l-5-5h10z"/>' }}
    />
  )
}
