"use client"

import { Display, VariantId, type Workspace } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { getNodeComputeContext } from "@seldon/core/workspace/compute"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import {
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "@lib/workspace/node-tree"
import { ComponentRenderer } from "../ComponentRenderer"

type ThemePreviewNodeProps = {
  nodeId: string
  workspace: Workspace
  /** Per-variant className scope so identical node ids do not share CSS across previews. */
  scope: string
  isRoot?: boolean
}

/**
 * Renders one node of a non-persisted preview tree (e.g. a themed Dialog).
 *
 * Mirrors `CanvasNode` but reads from the passed workspace instead of the
 * editor store, so the same component tree can be drawn once per theme variant.
 */
export function ThemePreviewNode({
  nodeId,
  workspace,
  scope,
  isRoot = false,
}: ThemePreviewNodeProps) {
  const node = workspace.nodes[nodeId]
  if (!node) {
    return null
  }

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
      computeContext={getNodeComputeContext(nodeId, workspace)}
      styleOverrides={isRoot ? { position: "relative" } : undefined}
      componentId={component.id}
      htmlAttributes={{ "data-preview-node-id": node.id }}
      nodeId={`${cssScope}-${nodeId}` as VariantId}
    >
      {childNodeIds.map((childNodeId) => (
        <ThemePreviewNode
          key={childNodeId}
          nodeId={childNodeId}
          workspace={workspace}
          scope={scope}
        />
      ))}
    </ComponentRenderer>
  )
}
