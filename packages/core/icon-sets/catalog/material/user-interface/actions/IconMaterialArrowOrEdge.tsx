import { SVGAttributes } from "react"

export function IconMaterialArrowOrEdge(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M300-120 140-280l56-56 64 63v-247H120q-33 0-56.5-23.5T40-600v-240h80v240h140q33 0 56.5 23.5T340-520v247l63-63 57 56-160 160Zm360 0L500-280l56-56 64 63v-247q0-33 23.5-56.5T700-600h140v-240h80v240q0 33-23.5 56.5T840-520H700v248l63-64 57 56-160 160Z" />
    </svg>
  )
}
