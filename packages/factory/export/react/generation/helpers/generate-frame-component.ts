import { NodeIdToClass } from "../../../css/types"
import {
  ComponentToExport,
  ExportOptions,
  FileToExport,
  JSONTreeNode,
} from "../../../types"
import { getPropName } from "../shared/get-prop-name"

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

/**
 * Generate a Frame component wrapper JSX
 * This generates JSX for wrapping children in a Frame component
 */
export function generateFrameWrapper(
  node: JSONTreeNode,
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  propValuesMap: Map<string, string>,
): string {
  const propsName = getPropName(
    node.dataBinding.path,
    propValuesMap,
    component.name,
  )
  const propsVarName = `${propsName}Props`

  let content = `\n      <Frame {...${propsVarName}}>`
  if (Array.isArray(node.children)) {
    node.children.forEach((child) => {
      // Frame children are always regular components (no grandchildren in frames)
      const childPropsName = getPropName(
        child.dataBinding.path,
        propValuesMap,
        component.name,
      )
      const childPropsVarName = `${childPropsName}Props`
      content += `\n        <${child.name} {...${childPropsVarName}} />`
    })
  }
  content += `\n      </Frame>`
  return content
}
