import type { SVGAttributes } from "react"

export function IconMaterialResize(props: SVGAttributes<SVGSVGElement>) {
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
          '<path fill="currentColor" d="M19 9V5h-4V3h6v6zM3 21v-6h2v4h4v2zm0-8v-2h2v2zm0-4V7h2v2zm0-4V3h2v2zm4 0V3h2v2zm4 16v-2h2v2zm0-16V3h2v2zm4 16v-2h2v2zm4 0v-2h2v2zm0-4v-2h2v2zm0-4v-2h2v2z"/>',
      }}
    />
  )
}
