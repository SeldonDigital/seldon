import { Display, invariant } from "@seldon/core"
import { getComponentExportConfig, getComponentSchema } from "@seldon/core/components/catalog"
import {
  ComponentId,
  NATIVE_REACT_PRIMITIVES,
  isComponentId,
} from "@seldon/core/components/constants"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { getAllVariants } from "@seldon/core/workspace/helpers/general/get-all-variants"
import { getKeptMockVariantIds } from "@seldon/core/workspace/helpers/general/get-display-export-conflicts"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { isAuthoredBoard, isComponentBoard } from "@seldon/core/workspace/model/components"
import { nodeRetrievalService } from "@seldon/core/workspace/services"

import { pluralizeLevel } from "../utils/pluralize-level"
import { getComponentName } from "./get-component-name"
import { getJsonTreeFromChildren } from "./get-json-tree-from-children"

import type { NodeIdToClass } from "../../css/types"
import type { ComponentToExport, ExportOptions, JSONTreeNode } from "../../types"
import type { ComponentLevel } from "@seldon/core/components/constants"
import type { ComponentExport, NativeReactPrimitive } from "@seldon/core/components/types"
import type { EntryNode, VariantId, Workspace } from "@seldon/core/workspace/types"

const SKIP_EXPORT_CATALOG_IDS = new Set<ComponentId>([ComponentId.FRAME])

/**
 * Return primitive for an authored component's root element, derived from its
 * `wrapperElement`. Authored roots template a Container or Frame, whose export
 * config is a passthrough wrapper that drops the composed subtree. Returning a
 * native primitive routes generation through the slot-tree path so the authored
 * children compose, matching how catalog modules export.
 */
function getAuthoredReturnPrimitive(tree: JSONTreeNode): NativeReactPrimitive {
  const wrapper = tree.dataBinding.props?.wrapperElement?.defaultValue

  if (typeof wrapper === "string") {
    const hit = Object.entries(NATIVE_REACT_PRIMITIVES).find(
      ([, meta]) => meta.wrapperElementOption === wrapper,
    )

    if (hit) return hit[0] as NativeReactPrimitive
  }

  return "HTMLDiv"
}

export function getComponentsToExport(
  workspace: Workspace,
  options: ExportOptions,
  nodeIdToClass: NodeIdToClass,
) {
  // Mock and exclude variants are authoring-only and not emitted, unless a shown
  // instance still copies one, in which case it is kept so the export never
  // dangles an import. `includeHiddenComponents` opts back into emitting all.
  const includeHidden = options.includeHiddenComponents === true
  const keptMockVariantIds = getKeptMockVariantIds(workspace)

  const variants = getAllVariants(workspace).filter((variant) => {
    const board = getBoardByNodeId(workspace, variant.id)

    if (!board) return false

    if (!includeHidden && !keptMockVariantIds.has(variant.id)) {
      const display = getNodeProperties(variant, workspace).display?.value

      if (display === Display.MOCK || display === Display.EXCLUDE) return false
    }

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
    const tree = getJsonTreeFromChildren(
      variant,
      workspace,
      nodeIdToClass,
      options.includeHiddenComponents === true,
    )
    const config = getComponentExportConfig(componentId)

    invariant(config, `Config of component ${componentId} not found`)

    if (isAuthoredBoard(board)) {
      const outputPath = `${options.output.componentsFolder}/${pluralizeLevel(board.level as ComponentLevel)}/${name}.tsx`
      // Authored roots template a Container or Frame, whose passthrough export
      // config drops the composed subtree. Synthesize a composing config and
      // carry the board's own level, intent, and tags for the generated docs.
      const authoredConfig: ComponentExport = {
        react: { returns: getAuthoredReturnPrimitive(tree) },
      }

      // The root now renders a fixed primitive tag, so the inherited
      // `wrapperElement` root prop is dead surface. Drop it to flatten the root
      // like a normal component, whose Part or Module root never exposes it.
      // Child Frames keep their own `wrapperElement`, matching normal output.
      delete tree.dataBinding.props.wrapperElement

      return {
        componentId,
        variantId: variantId as VariantId,
        defaultVariantId: board.variants[0]!.id as VariantId,
        name,
        config: authoredConfig,
        authored: {
          level: board.level as ComponentLevel,
          intent: board.intent,
          tags: board.tags,
        },
        output: {
          path: outputPath,
        },
        tree,
      }
    }

    invariant(isComponentBoard(board), `Missing component board for ${variant.id}`)
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
