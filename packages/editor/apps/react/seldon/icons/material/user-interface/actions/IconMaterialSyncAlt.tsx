import type { SVGAttributes } from "react"

export function IconMaterialSyncAlt(props: SVGAttributes<SVGSVGElement>) {
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
          '<path fill="currentColor" d="m7 21l-5-5l5-5l1.425 1.4l-2.6 2.6H21v2H5.825l2.6 2.6zm10-8l-1.425-1.4l2.6-2.6H3V7h15.175l-2.6-2.6L17 3l5 5z"/>',
      }}
    />
  )
}
