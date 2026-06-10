import { invariant } from "@seldon/core"
import {
  getComponentExportConfig,
  getComponentSchema,
} from "@seldon/core/components/catalog"
import { ComponentId, isComponentId } from "@seldon/core/components/constants"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { getAllVariants } from "@seldon/core/workspace/helpers/general/get-all-variants"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { isComponentBoard } from "@seldon/core/workspace/model/components"
import { nodeRetrievalService } from "@seldon/core/workspace/services"
import type {
  EntryNode,
  VariantId,
  Workspace,
} from "@seldon/core/workspace/types"

import { NodeIdToClass } from "../../css/types"
import { ComponentToExport, ExportOptions } from "../../types"
import { pluralizeLevel } from "../utils/pluralize-level"
import { getComponentName } from "./get-component-name"
import { getJsonTreeFromChildren } from "./get-json-tree-from-children"

const SKIP_EXPORT_CATALOG_IDS = new Set<ComponentId>([ComponentId.FRAME])

export function getComponentsToExport(
  workspace: Workspace,
  options: ExportOptions,
  nodeIdToClass: NodeIdToClass,
) {
  const variants = getAllVariants(workspace).filter((variant) => {
    const board = getBoardByNodeId(workspace, variant.id)
    if (!board || !isComponentBoard(board)) {
      return false
    }

    const catalogId = getNodeCatalogId(variant, workspace)
    if (!catalogId || !isComponentId(catalogId)) {
      return false
    }

    return !SKIP_EXPORT_CATALOG_IDS.has(catalogId)
  }) as (EntryNode & { type: "default" | "variant" })[]

  const items: ComponentToExport[] = variants.map((variant) => {
    const board = getBoardByNodeId(workspace, variant.id)
    invariant(
      board && isComponentBoard(board),
      `Missing component board for ${variant.id}`,
    )

    const componentId = getNodeCatalogId(variant, workspace) as ComponentId
    const variantId = variant.id

    const schema = getComponentSchema(componentId)
    const name = getComponentName(variant, workspace)
    const outputPath = `${options.output.componentsFolder}/${pluralizeLevel(schema.level)}/${name}.tsx`
    const tree = getJsonTreeFromChildren(variant, workspace, nodeIdToClass)
    const config = getComponentExportConfig(componentId)
    invariant(config, `Config of component ${componentId} not found`)

    return {
      componentId,
      variantId: variantId as VariantId,
      defaultVariantId: nodeRetrievalService.getDefaultVariant(
        board.catalogId as ComponentId,
        workspace,
      ).id,
      name,
      config,
      output: {
        path: outputPath,
      },
      tree,
    }
  })

  return items
}
