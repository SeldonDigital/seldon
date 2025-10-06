import { CSSProperties } from "react"
import { InstanceId, VariantId } from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { ComponentExport } from "@seldon/core/components/types"

/**
 * Export options
 */

export type ExportOptions = {
  rootDirectory: string
  token?: string
  target: ExportTarget
  output: {
    assetsFolder: string
    componentsFolder: string
    assetPublicPath: string
  }
}

type ExportTarget = {
  framework: "react"
  styles: "css-properties"
}

/**
 * This is the component to export. Each variant in a workspace will be added to a list of these before exporting.
 */
export type ComponentToExport = {
  name: string
  componentId: ComponentId
  variantId: VariantId
  defaultVariantId: VariantId
  config: ComponentExport
  output: {
    path: string
  }
  tree: JSONTreeNode
}

/**
 * This is the export return type (as array)
 */
export type FileToExport = {
  path: string
  content: string | ArrayBuffer
}

/**
 * This a map of images to export. When exporting a workspace, the same image can be used in multiple components.
 * So we make a map with {originalUrl: {relativePath: string, uploadPath: string}}.
 * This way we can replace the original url with the relative path and upload the image to the correct path.
 * So uploadPath the file will be uploaded to. The relativePath is the path we will replace the full url with.
 * E.g. relativePath = '/assets/' -> https://url.com/image.png becomes /assets/image.png
 */
export type ImageToExportMap = Record<
  string,
  { relativePath: string; uploadPath: string }
>

/**
 * This is used to create a JSON representation of the entire tree that needs to be exported.
 * For example for a ButtonBar it will look like this:
 *
 * {
 *   name: "ButtonBar",
 *   nodeId: "variant-buttonBar-default",
 *   level: "element",
 *   dataBinding: {
 *     interfaceName: "ButtonBarProps",
 *     propsName: "buttonBarProps",
 *     props: {
 *       buttonProps: {}
 *     }
 *   },
 *   children: [
 *     {
 *       name: "Button",
 *       nodeId: "child-button-ntWS0r",
 *       level: "element",
 *       dataBinding: {
 *         interfaceName: "ButtonProps",
 *         propsName: "buttonProps",
 *         props: {
 *           style: {
 *             backgroundColor: "hsl(0deg 0% 15%)",
 *           }
 *         },
 *         children: [
 *           {
 *             name: "Icon",
 *             nodeId: "child-icon-gOJmYH",
 *             level: "primitive",
 *             dataBinding: {
 *               interfaceName: "IconProps",
 *               propsName: "iconProps",
 *               props: {
 *                 icon: "__default__"
 *               }
 *             }
 *           }
 *       }
 *     }
 *   ]
 * }
 */
export type JSONTreeNode = {
  name: string
  nodeId: InstanceId | VariantId
  children?: null | string | JSONTreeNode[]
  level: ComponentLevel
  dataBinding: DataBinding
  classNames?: string[]
}

/**
 * This is used to bind and correctly type props to a component.
 * It's part of the JSONTreeNode.
 */
export type DataBinding = {
  interfaceName: string
  referenceName?: string // If there are multiple children with the same name, we have to distinguish every child by index
  path: string
  props: Record<
    string,
    {
      type?: string
      value?: string | boolean | number | object | string[] | number[]
      defaultValue: string | CSSProperties
      options?: string[]
    }
  >
}
