import type { SVGAttributes } from "react"

export function IconMaterialBorderStyle(props: SVGAttributes<SVGSVGElement>) {
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
          '<path fill="currentColor" d="M7 21v-2h2v2zm4 0v-2h2v2zm4 0v-2h2v2zm4 0v-2h2v2zm0-4v-2h2v2zm0-4v-2h2v2zm0-4V7h2v2zM3 21V3h18v2H5v16z"/>',
      }}
    />
  )
}
