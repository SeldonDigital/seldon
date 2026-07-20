import { CSSProperties } from "react"

import { InstanceId, VariantId } from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { ComponentExport } from "@seldon/core/components/types"

import type { ExportAssetReader } from "./asset-reader"

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
  publishAll?: boolean
  debugMode?: boolean
  assetReader?: ExportAssetReader
  skipFormat?: boolean
  /** Opt-in to emitting remote font host links. Off by default to keep exports request-free. */
  enableRemoteFonts?: boolean
  /**
   * Export every icon enabled in the workspace's icon sets, even when no
   * component references it, so the export ships complete icon sets. On by
   * default. Set to `false` to tree-shake to only the icons components use.
   */
  exportAllIconSetIcons?: boolean
  /**
   * Include components hidden with `Display.EXCLUDE` or `Display.MOCK` in the
   * exported trees. Off by default, matching the editor where hidden components
   * do not render.
   */
  includeHiddenComponents?: boolean
  /**
   * Export every workspace theme, even when no node references it. On by
   * default. Set to `false` to emit only themes a node uses, always keeping the
   * default `seldon` theme.
   */
  exportAllThemes?: boolean
  /**
   * Emit remote font links for every enabled font collection family, even when
   * no theme references it. On by default. Set to `false` to emit only families
   * referenced by a theme. Only has an effect when `enableRemoteFonts` is on.
   */
  exportAllFontCollections?: boolean
}

/**
 * Identifier for an export platform. Adding a platform means adding an id here
 * and a matching entry in the platform registry (`platforms/registry.ts`).
 */
export type PlatformId = "react" | "swift" | "vue" | "svelte"

/** Whether a platform can export today or is registered for a future release. */
export type PlatformStatus = "available" | "planned"

/** Styling strategy a platform emits. */
export type ExportStyleId = "css-properties"

type ExportTarget = {
  framework: PlatformId
  styles: ExportStyleId
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
  /**
   * Present only for authored components. Carries the board's own display
   * metadata so generated docs report the board's level, intent, and tags
   * rather than the Container/Frame template the root resolves to.
   */
  authored?: {
    level: ComponentLevel
    intent?: string
    tags?: string[]
  }
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
  componentId: ComponentId
  schemaVariantId: string | null
  nodeId: InstanceId | VariantId
  /** Unique node reference handle, emitted as `data-seldon-ref` when present. */
  ref?: string
  children?: null | string | JSONTreeNode[]
  level: ComponentLevel
  dataBinding: DataBinding
  classNames?: string[]
  /**
   * True when this node (or an ancestor within the same tree) has Display set to
   * Stub. Stub nodes stay in the tree and interface but render as opt-in slots
   * that are empty by default.
   */
  isStub?: boolean
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
