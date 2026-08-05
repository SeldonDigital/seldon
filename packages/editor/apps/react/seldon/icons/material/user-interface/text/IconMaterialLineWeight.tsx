import type { SVGAttributes } from "react"

export function IconMaterialLineWeight(props: SVGAttributes<SVGSVGElement>) {
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
          '<path fill="currentColor" d="M3 20v-1h18v1zm0-3v-2h18v2zm0-4v-3h18v3zm0-5V4h18v4z"/>',
      }}
    />
  )
}
