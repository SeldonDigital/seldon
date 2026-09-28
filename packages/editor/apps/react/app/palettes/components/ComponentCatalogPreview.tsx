"use client"

import { BoardPreviewNode } from "@app/canvas/boards/BoardPreviewNode"
import { ExplodedStage } from "@app/exploded/ExplodedStage"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { Frame } from "@seldon/components/frames/Frame"
import { useCallback, useRef } from "react"

import { getComponentSchema } from "@seldon/core/components/catalog"
import { getBoardVariantRootIds } from "@seldon/core/workspace/helpers/components/get-board-variant-root-ids"
import { makeEntryNode } from "@seldon/core/workspace/helpers/nodes/build-component-variants"
import { formatNodeCatalog } from "@seldon/core/workspace/model/template-ref"

import type { ExplodedSource } from "@app/exploded/ExplodedStage"
import type { ComponentId } from "@seldon/core/components/constants"
import type { SchemaChild } from "@seldon/core/components/types"
import type { EntryNode, Workspace } from "@seldon/core/workspace/types"
import type { CSSProperties } from "react"

const hiddenSourceStyle: CSSProperties = {
  inset: 0,
  pointerEvents: "none",
  position: "absolute",
  visibility: "hidden",
}
const PREVIEW_NODE_ATTRIBUTE = "data-preview-node-id"

interface ComponentCatalogPreviewProps {
  componentId: ComponentId
  variantId?: string
}

export function ComponentCatalogPreview({ componentId, variantId }: ComponentCatalogPreviewProps) {
  const { workspace } = useWorkspace()
  const sourceRef = useRef<HTMLElement | null>(null)
  const board = workspace.boards[componentId]
  const catalogPreview = tryBuildCatalogPreview(componentId, workspace)
  const rootId = variantId ?? (board ? getBoardVariantRootIds(board)[0] : catalogPreview?.rootId)
  const previewWorkspace =
    board || variantId || !catalogPreview ? workspace : catalogPreview.workspace
  const childrenByNodeId =
    board || variantId || !catalogPreview ? undefined : catalogPreview.childrenByNodeId
  const resolveSource = useCallback((): ExplodedSource | null => {
    const element = sourceRef.current

    if (!element || !rootId) return null

    return { element, fit: true, nodeAttribute: PREVIEW_NODE_ATTRIBUTE }
  }, [rootId])
  const source =
    rootId === undefined ? null : (
      <Frame ref={sourceRef} style={hiddenSourceStyle}>
        <BoardPreviewNode
          isRoot
          nodeId={rootId}
          scope={`catalog-preview-${rootId}`}
          childrenByNodeId={childrenByNodeId}
          workspace={previewWorkspace}
        />
      </Frame>
    )
  const stage = <ExplodedStage compact resolveSource={resolveSource} />

  return (
    <>
      {source}
      {stage}
    </>
  )
}

interface CatalogPreview {
  rootId: string
  workspace: Workspace
  childrenByNodeId: Record<string, readonly string[]>
}

function tryBuildCatalogPreview(
  componentId: ComponentId,
  workspace: Workspace,
): CatalogPreview | null {
  try {
    return buildCatalogPreview(componentId, workspace)
  } catch {
    return null
  }
}

function buildCatalogPreview(componentId: ComponentId, workspace: Workspace): CatalogPreview {
  const rootId = `catalog-preview-${componentId}`
  const nodes: Record<string, EntryNode> = {}
  const childrenByNodeId: Record<string, readonly string[]> = {}

  function addNode(
    currentComponentId: ComponentId,
    nodeId: string,
    type: EntryNode["type"],
    overrides: EntryNode["overrides"],
    childSlots: SchemaChild[] | undefined,
  ): void {
    const schema = getComponentSchema(currentComponentId)

    nodes[nodeId] = makeEntryNode({
      id: nodeId,
      type,
      level: schema.level as EntryNode["level"],
      label: schema.name,
      template: formatNodeCatalog(currentComponentId),
      overrides,
    })

    const defaultChildren = "default" in schema ? schema.default.children : undefined
    const slots: SchemaChild[] | undefined = childSlots ?? defaultChildren

    if (!slots?.length) return

    const childIds: string[] = []

    for (const [index, slot] of slots.entries()) {
      const childId = `${nodeId}-${index}`

      try {
        const childSchema = getComponentSchema(slot.component)
        const variant = slot.variant
          ? childSchema.variants?.find((candidate) => candidate.id === slot.variant)
          : undefined

        addNode(
          slot.component,
          childId,
          "instance",
          (slot.overrides ?? {}) as EntryNode["overrides"],
          slot.children ?? variant?.children,
        )
        childIds.push(childId)
      } catch {
        continue
      }
    }

    if (childIds.length) childrenByNodeId[nodeId] = childIds
  }

  addNode(componentId, rootId, "default", {}, undefined)

  return {
    rootId,
    workspace: {
      ...workspace,
      nodes: {
        ...workspace.nodes,
        ...nodes,
      },
    },
    childrenByNodeId,
  }
}
