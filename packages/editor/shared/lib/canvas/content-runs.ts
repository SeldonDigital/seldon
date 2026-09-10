import { getThemeTokenVarReference } from "@seldon/factory/styles/css-properties/get-theme-token-reference"
import { getContentRuns } from "@seldon/core/properties"

import type { ContentRun, Properties } from "@seldon/core/properties"

export interface CanvasContentRunStyle {
  fontWeight?: string
  fontStyle?: string
}

export interface CanvasContentRun {
  key: string
  tag: string
  value: string
  style: CanvasContentRunStyle
}

function runStyle(run: ContentRun): CanvasContentRunStyle {
  const style: CanvasContentRunStyle = {}
  const weightVar = getThemeTokenVarReference(run.fontWeight?.value)

  if (weightVar) {
    style.fontWeight = weightVar
  }

  const fontStyle = run.fontStyle?.value

  if (fontStyle === "italic" || fontStyle === "oblique") {
    style.fontStyle = fontStyle
  }

  return style
}

/** Canvas paint list for a primitive's inline runs, or null when content is a text node. */
export function canvasContentRuns(properties: Properties): CanvasContentRun[] | null {
  const runs = getContentRuns(properties)

  if (!runs) return null

  return runs.map((run, index) => ({
    key: `${index}-${run.htmlElement}-${run.value}`,
    tag: run.htmlElement,
    value: run.value.replace(/\r?\n/g, " "),
    style: runStyle(run),
  }))
}
