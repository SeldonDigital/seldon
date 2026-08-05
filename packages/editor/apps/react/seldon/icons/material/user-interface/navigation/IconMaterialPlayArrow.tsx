import type { SVGAttributes } from "react"

export function IconMaterialPlayArrow(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{
        __html: '<path fill="currentColor" d="M8 19V5l11 7zm2-3.65L15.25 12L10 8.65z"/>',
      }}
    />
  )
}
