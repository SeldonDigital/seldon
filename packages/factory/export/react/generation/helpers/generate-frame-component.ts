import { ExportOptions, FileToExport } from "../../../types"

/**
 * Generate the Frame.tsx component file
 */
export async function generateFrameComponent(
  options: ExportOptions,
): Promise<FileToExport> {
  const source = `
import { HTMLAttributes, ReactNode, createElement } from "react"

export type FrameProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode
  wrapperElement?: string
  "data-seldon-ref"?: string
}

export function Frame({ wrapperElement = "div", ...props }: FrameProps) {
  return createElement(wrapperElement, props)
}`
  return {
    path: `${options.output.componentsFolder}/frames/Frame.tsx`,
    content: source,
  }
}
