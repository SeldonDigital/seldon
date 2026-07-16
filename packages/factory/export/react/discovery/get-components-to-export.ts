import { invariant } from "@seldon/core"
import {
  getComponentExportConfig,
  getComponentSchema,
} from "@seldon/core/components/catalog"
import {
  ComponentId,
  ComponentLevel,
  isComponentId,
} from "@seldon/core/components/constants"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { getAllVariants } from "@seldon/core/workspace/helpers/general/get-all-variants"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import {
  isAuthoredBoard,
  isComponentBoard,
} from "@seldon/core/workspace/model/components"
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
    if (!board) return false

    // Authored boards export their authored root and user variants regardless
    // of the Container/Frame template they resolve to.
    if (isAuthoredBoard(board)) return true

    if (!isComponentBoard(board)) return false

    const catalogId = getNodeCatalogId(variant, workspace)
    if (!catalogId || !isComponentId(catalogId)) {
      return false
    }

    return !SKIP_EXPORT_CATALOG_IDS.has(catalogId)
  }) as (EntryNode & { type: "default" | "variant" | "authored" })[]

  const items: ComponentToExport[] = variants.map((variant) => {
    const board = getBoardByNodeId(workspace, variant.id)
    invariant(board, `Missing board for ${variant.id}`)

    const componentId = getNodeCatalogId(variant, workspace) as ComponentId
    const variantId = variant.id
    const name = getComponentName(variant, workspace)
    const tree = getJsonTreeFromChildren(variant, workspace, nodeIdToClass)
    const config = getComponentExportConfig(componentId)
    invariant(config, `Config of component ${componentId} not found`)

    if (isAuthoredBoard(board)) {
      const outputPath = `${options.output.componentsFolder}/${pluralizeLevel(board.level as ComponentLevel)}/${name}.tsx`
      return {
        componentId,
        variantId: variantId as VariantId,
        defaultVariantId: board.variants[0]!.id as VariantId,
        name,
        config,
        output: {
          path: outputPath,
        },
        tree,
      }
    }

    invariant(
      isComponentBoard(board),
      `Missing component board for ${variant.id}`,
    )
    const schema = getComponentSchema(componentId)
    const outputPath = `${options.output.componentsFolder}/${pluralizeLevel(schema.level)}/${name}.tsx`

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
