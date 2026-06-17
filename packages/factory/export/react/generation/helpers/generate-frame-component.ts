import { ExportOptions, FileToExport } from "../../../types"

/**
 * Generate the Frame.tsx component file
 */
export async function generateFrameComponent(
  options: ExportOptions,
): Promise<FileToExport> {
  const source = `
import { HTMLAttributes, ReactNode } from "react"
import { HTMLDiv } from "../native-react/HTML.Div"

export type FrameProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode
}

export function Frame(props: FrameProps) {
  return <HTMLDiv {...props} />
}`
  return {
    path: `${options.output.componentsFolder}/frames/Frame.tsx`,
    content: source,
  }
}
