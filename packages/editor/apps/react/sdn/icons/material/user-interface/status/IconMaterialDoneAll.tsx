import type { SVGAttributes } from "react"

export function IconMaterialDoneAll(props: SVGAttributes<SVGSVGElement>) {
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
          '<path fill="currentColor" d="m6.7 18l-5.65-5.65l1.425-1.4l4.25 4.25l1.4 1.4zm5.65 0L6.7 12.35l1.4-1.425l4.25 4.25l9.2-9.2l1.4 1.425zm0-5.65l-1.425-1.4L15.875 6L17.3 7.4z"/>',
      }}
    />
  )
}
