import type { SVGAttributes } from "react"

export function IconMaterialChevronLineUp(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{
        __html:
          '<path fill="currentColor" d="M6 8V6h12v2zm1.4 10.4L6 17l6-6l6 6l-1.4 1.4l-4.6-4.6z"/>',
      }}
    />
  )
}
