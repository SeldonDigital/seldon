import type { SVGAttributes } from "react"

export function IconMaterialVerticalAlignBottom(props: SVGAttributes<SVGSVGElement>) {
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
          '<path fill="currentColor" d="M4 21v-2h16v2zm8-4l-5-5l1.4-1.4l2.6 2.6V3h2v10.2l2.6-2.6L17 12z"/>',
      }}
    />
  )
}
