import type { SVGAttributes } from "react"

export function IconMaterialFormatSize(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{
        __html: '<path fill="currentColor" d="M14 20V7H9V4h13v3h-5v13zm-9 0v-8H2V9h9v3H8v8z"/>',
      }}
    />
  )
}
