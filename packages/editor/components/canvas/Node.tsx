"use client"

import { buildContext } from "@seldon/factory/helpers/compute-workspace"
import {
  Board,
  Display,
  Instance,
  InstanceId,
  Properties,
  Variant,
  VariantId,
  invariant,
} from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ThemeId } from "@seldon/core/themes/types"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"
import { themeService } from "@seldon/core/workspace/services/theme.service"
import { useAddNodeFontFamily } from "./hooks/use-add-node-font-family"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { ComponentRenderer } from "./ComponentRenderer"

export type CanvasNodeProps = {
  nodeId: VariantId | InstanceId
  parentNode?: Variant | Instance | Board
  initialThemeId: ThemeId
  isRoot?: boolean
}
export function CanvasNode({
  nodeId,
  initialThemeId,
  isRoot = false,
}: CanvasNodeProps) {
  const { workspace } = useWorkspace()
  const node = workspace.byId[nodeId]

  // Add the font family to the editor fonts - must be called before any early returns
  useAddNodeFontFamily(nodeId)

  /**
   * For the children of the root screen initialThemeId is set to the theme of the screen
   * A node's theme should either be that, unless it's explicitly set. If that's the case
   * We should hold that value until a new 'branch' of the tree is found with a new theme
   *
   * Note: This only works because we're a standard algorithm that traverses the tree from top to bottom
   */
  const themeId = node.theme || initialThemeId
  const theme = themeService.getTheme(themeId, workspace)
  invariant(theme, `Theme ${themeId} not found`)

  let component
  try {
    component = getComponentSchema(node.component)
  } catch (error) {
    console.warn(
      `Skipping node ${nodeId} with invalid component ID in CanvasNode: ${node.component}`,
    )
    return null // Don't render nodes with invalid component IDs
  }

  const nodeProperties = getNodeProperties(node, workspace)

  // Don't render the node at all if it's set to be hidden
  if (nodeProperties?.display?.value === Display.EXCLUDE) {
    return null
  }

  return (
    <ComponentRenderer
      computeContext={buildContext(node, workspace)}
      styleOverrides={isRoot ? { position: "relative" } : undefined}
      componentId={component.id}
      htmlAttributes={getHTMLAttributes(node, nodeProperties)}
      nodeId={nodeId}
    >
      {"children" in node &&
        node.children?.map((childNodeId) => {
          return (
            <CanvasNode
              key={childNodeId}
              parentNode={node}
              nodeId={childNodeId}
              initialThemeId={themeId}
            />
          )
        })}
    </ComponentRenderer>
  )

  /**
   * Some properties must be set as HTML attributes instead of tokens
   * @param node
   * @returns
   */
  function getHTMLAttributes(node: Variant | Instance, properties: Properties) {
    const htmlAttributes: Record<string, string> = {
      "data-canvas-node-id": node.id,
      "data-component-id": node.component,
    }

    // Some properties must be set as HTML attributes instead of tokens
    if (properties.source?.value) {
      htmlAttributes.src = properties.source.value
    }

    if (properties.altText?.value) {
      htmlAttributes.alt = properties.altText.value
    }

    if (properties.placeholder?.value) {
      htmlAttributes.placeholder = properties.placeholder.value
    }

    if (properties.ariaLabel?.value) {
      htmlAttributes["aria-label"] = properties.ariaLabel.value
    }

    if (properties.inputType?.value) {
      htmlAttributes.type = properties.inputType.value
    }

    if (properties.checked?.value) {
      htmlAttributes.checked = "checked"
    }

    if (properties.columns?.value) {
      const columnValue =
        typeof properties.columns.value === "number"
          ? properties.columns.value
          : properties.columns.value.value
      htmlAttributes.colSpan = columnValue.toString()
    }

    if (properties.rows?.value) {
      const rowValue =
        typeof properties.rows.value === "number"
          ? properties.rows.value
          : properties.rows.value.value
      htmlAttributes.rowSpan = rowValue.toString()
    }

    return htmlAttributes
  }
}
