import { getIconData } from "@seldon/core/icon-sets/data"
import { getIconCategoryFromId } from "@seldon/core/icon-sets/helpers"

import { getIconComponentName } from "../discovery/get-icon-component-name"

import type { IconId } from "@seldon/core/icon-sets"

/** A synthesized icon export: where it goes and the component source to write. */
export interface DataBackedIcon {
  componentName: string
  relativePath: string
  content: string
}

/**
 * Builds an icon export from core glyph data, when the set ships data. Emits a
 * component at the same `set/category/Name` layout the catalog used, so the
 * generated output stays stable across the switch from committed `.tsx` files
 * to generated data. Returns `undefined` for sets that still ship source files.
 */
export function getDataBackedIcon(iconId: IconId): DataBackedIcon | undefined {
  const data = getIconData(iconId)

  if (!data) return undefined

  const dash = iconId.indexOf("-")
  const setFolder = iconId.slice(0, dash)
  const componentName = getIconComponentName(iconId)
  const category = getIconCategoryFromId(iconId)
  const relativePath = `${setFolder}/${category}/${componentName}`

  return {
    componentName,
    relativePath,
    content: synthesizeIconComponent(componentName, data.viewBox, data.body),
  }
}

/**
 * Renders a React icon component from glyph data. The inner SVG is injected as
 * markup so any body shape (single path, group, stroke) emits unchanged and the
 * output is deterministic.
 */
function synthesizeIconComponent(componentName: string, viewBox: string, body: string): string {
  return `import type { SVGAttributes } from "react"

export function ${componentName}(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="${viewBox}"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
      dangerouslySetInnerHTML={{ __html: ${JSON.stringify(body)} }}
    />
  )
}
`
}
