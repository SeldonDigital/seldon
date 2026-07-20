"use client"

import {
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "@seldon/editor/lib/workspace/node-tree"
import { buildRenderParentIndex } from "@seldon/editor/lib/workspace/render-parent-index"

import { Display, VariantId, type Workspace } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { getNodeComputeContext } from "@seldon/core/workspace/compute"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"

import { ComponentRenderer } from "../ComponentRenderer"
import { getPropertyHtmlAttributes } from "../property-html-attributes"

type BoardPreviewNodeProps = {
  nodeId: string
  workspace: Workspace
  /** Per-preview className scope so identical node ids do not share CSS across previews. */
  scope: string
  isRoot?: boolean
  /**
   * Node-id path from the preview root down to this node. Lets a shared child id
   * resolve `#parent.*` against the parent it is drawn under. Defaults to the
   * node id at the root.
   */
  rootPath?: string
}

/**
 * Renders one node of a non-persisted preview tree (e.g. a themed Dialog or a
 * font specimen).
 *
 * Mirrors `CanvasNode` but reads from the passed workspace instead of the
 * editor store, so the same component tree can be drawn once per preview item.
 */
export function BoardPreviewNode({
  nodeId,
  workspace,
  scope,
  isRoot = false,
  rootPath,
}: BoardPreviewNodeProps) {
  const node = workspace.nodes[nodeId]
  if (!node) {
    return null
  }

  const selfPath = rootPath ?? nodeId

  const catalogComponentId = getNodeCatalogComponentId(node, workspace)
  if (!catalogComponentId) {
    return null
  }

  let component
  try {
    component = getComponentSchema(catalogComponentId)
  } catch {
    return null
  }

  const nodeProperties = getNodeProperties(node, workspace)
  if (nodeProperties?.display?.value === Display.EXCLUDE) {
    return null
  }

  const childNodeIds = getNodeChildIds(node, workspace)

  // The scope becomes part of a CSS class name. Resource item scopes such as
  // `font-collection:system:appleSystem` contain colons, which would parse as
  // pseudo-selectors and void the whole rule, so reduce it to a safe identifier.
  const cssScope = scope.replace(/[^a-zA-Z0-9_-]/g, "-")

  return (
    <ComponentRenderer
      computeContext={getNodeComputeContext(nodeId, workspace, {
        parentIndex: buildRenderParentIndex(selfPath),
      })}
      styleOverrides={isRoot ? { position: "relative" } : undefined}
      componentId={component.id}
      htmlAttributes={{
        "data-preview-node-id": node.id,
        ...getPropertyHtmlAttributes(nodeProperties),
      }}
      nodeId={`${cssScope}-${nodeId}` as VariantId}
    >
      {childNodeIds.map((childNodeId) => (
        <BoardPreviewNode
          key={childNodeId}
          nodeId={childNodeId}
          workspace={workspace}
          scope={scope}
          rootPath={`${selfPath}/${childNodeId}`}
        />
      ))}
    </ComponentRenderer>
  )
}
