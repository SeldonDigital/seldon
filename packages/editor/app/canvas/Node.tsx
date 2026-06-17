"use client"

import { isWorkspaceIconUnavailable } from "@lib/icon-sets/icon-availability"
import { buildContext } from "@seldon/factory/helpers/compute-workspace"
import { memo, useMemo } from "react"
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
import { ComponentId } from "@seldon/core/components/constants"
import type { IconId } from "@seldon/core/icon-sets"
import { ThemeInstanceId } from "@seldon/core/themes/types"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useAddNodeFontFamily } from "./hooks/use-add-node-font-family"
import { collectDescendantNodeIds } from "@lib/workspace/component-tree"
import {
  findComponentForNode,
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "@lib/workspace/node-tree"
import { buildRenderParentIndex } from "@lib/workspace/render-parent-index"
import {
  CanvasHtmlAttributes,
  ComponentRenderer,
} from "./ComponentRenderer"

export type CanvasNodeProps = {
  nodeId: VariantId | InstanceId
  parentNode?: Variant | Instance | Board
  initialThemeId: ThemeInstanceId
  isRoot?: boolean
  /**
   * Node-id path of this copy, from the variant-root down to this node, joined
   * by "/". Stamped as `data-selection-root-id` so a child id shared across
   * columns resolves to the clicked copy. Defaults to the node id at a root.
   */
  rootPath?: string
}
export const CanvasNode = memo(function CanvasNode({
  nodeId,
  initialThemeId,
  isRoot = false,
  rootPath,
}: CanvasNodeProps) {
  const { workspace } = useWorkspace()
  const node = workspace.nodes[nodeId]

  if (!node) {
    return null
  }

  // Add the font family to the editor fonts - must be called before any early returns
  useAddNodeFontFamily(nodeId)

  // Node-id path from the variant root down to this node. A shared child id can
  // appear under several variant trees, so this render-position path tells the
  // compute pipeline which parent to resolve `#parent.*` against.
  const selfPath = rootPath ?? nodeId
  const renderParentIndex = useMemo(
    () => buildRenderParentIndex(selfPath),
    [selfPath],
  )

  // Memoize the compute context so it stays referentially stable while the node
  // and workspace are unchanged, letting ComponentRenderer's CSS memo hit.
  const computeContext = useMemo(
    () => buildContext(node, workspace, renderParentIndex),
    [node, workspace, renderParentIndex],
  )

  /**
   * For the children of the root screen initialThemeId is set to the theme of the screen
   * A node's theme should either be that, unless it's explicitly set. If that's the case
   * We should hold that value until a new 'branch' of the tree is found with a new theme
   *
   * Note: This only works because we're a standard algorithm that traverses the tree from top to bottom
   */
  const themeId = node.theme || initialThemeId
  const theme = workspaceThemeService.getTheme(themeId, workspace)
  invariant(theme, `Theme ${themeId} not found`)

  const catalogComponentId = getNodeCatalogComponentId(node, workspace)
  if (!catalogComponentId) {
    console.warn(`Skipping node ${nodeId} with no catalog component id`)
    return null
  }

  let component
  try {
    component = getComponentSchema(catalogComponentId)
  } catch (error) {
    console.warn(
      `Skipping node ${nodeId} with invalid component ID in CanvasNode: ${catalogComponentId}`,
    )
    return null // Don't render nodes with invalid component IDs
  }

  const nodeProperties = getNodeProperties(node, workspace)

  // Don't render the node at all if it's set to be hidden
  if (nodeProperties?.display?.value === Display.EXCLUDE) {
    return null
  }

  const childNodeIds = getNodeChildIds(node, workspace)
  const board = findComponentForNode(node, workspace)
  const renderAsDiv =
    catalogComponentId === ComponentId.BUTTON &&
    board !== null &&
    collectDescendantNodeIds(board, nodeId).some((descendantId) => {
      const descendant = workspace.nodes[descendantId]
      if (!descendant) {
        return false
      }
      return (
        getNodeCatalogComponentId(descendant, workspace) === ComponentId.BUTTON
      )
    })

  const iconUnavailable =
    catalogComponentId === ComponentId.ICON &&
    isWorkspaceIconUnavailable(
      nodeProperties?.symbol?.value as IconId | undefined,
      workspace,
    )

  // A shared child id renders once per variant column. Scope the style class by
  // render position so each copy's computed CSS (e.g. an icon sized from its own
  // parent's buttonSize) does not collide on a single `node-<id>` selector.
  const styleScopeId = selfPath.replace(/[^a-zA-Z0-9_-]/g, "-") as
    | InstanceId
    | VariantId

  return (
    <ComponentRenderer
      computeContext={computeContext}
      styleOverrides={
        isRoot
          ? catalogComponentId === ComponentId.SANDBOX
            ? { position: "absolute" }
            : { position: "relative" }
          : undefined
      }
      componentId={component.id}
      htmlAttributes={getHTMLAttributes(node, nodeProperties)}
      nodeId={styleScopeId}
      renderAsDiv={renderAsDiv}
      iconUnavailable={iconUnavailable}
    >
      {childNodeIds.map((childNodeId) => (
        <CanvasNode
          key={childNodeId}
          parentNode={node}
          nodeId={childNodeId as InstanceId | VariantId}
          initialThemeId={themeId as ThemeInstanceId}
          rootPath={`${selfPath}/${childNodeId}`}
        />
      ))}
    </ComponentRenderer>
  )

  /**
   * Some properties must be set as HTML attributes instead of tokens
   * @param node
   * @returns
   */
  function getHTMLAttributes(node: Variant | Instance, properties: Properties) {
    const componentId =
      getNodeCatalogComponentId(node, workspace) ?? catalogComponentId
    const htmlAttributes: CanvasHtmlAttributes = {
      "data-canvas-node-id": node.id,
      "data-canvas-selection-id": node.id,
      "data-selection-id": node.id,
      "data-selection-kind": "node",
      "data-selection-root-id": selfPath,
      "data-component-id": componentId ?? "",
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
      htmlAttributes.defaultChecked = true
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
})
