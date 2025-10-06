import { invariant } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId } from "@seldon/core/components/constants"
import { exportConfig } from "@seldon/core/components/generated"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { Variant, VariantId, Workspace } from "@seldon/core/workspace/types"
import { NodeIdToClass } from "../../css/types"
import { ComponentToExport, ExportOptions } from "../../types"
import { pluralizeLevel } from "../utils/pluralize-level"
import { getComponentName } from "./get-component-name"
import { getJsonTreeFromChildren } from "./get-json-tree-from-children"

/**
 * This is the backbone of the export process. It takes a workspace and some options and returns a list of components to export
 * with all the information needed to export them.
 *
 * @param workspace - Workspace
 * @param options - Export options
 * @returns List of components to export
 */
export function getComponentsToExport(
  workspace: Workspace,
  options: ExportOptions,
  nodeIdToClass: NodeIdToClass,
) {
  const variants = Object.values(workspace.byId).filter(
    // Frame is exported separately
    (item) => item.isChild === false && item.component !== ComponentId.FRAME,
  ) as Variant[]

  const items: ComponentToExport[] = variants.map((variant) => {
    const componentId = variant.component
    const variantId = variant.id

    const schema = getComponentSchema(componentId as ComponentId)
    const name = getComponentName(variant, workspace)
    const outputPath = `${options.output.componentsFolder}/${pluralizeLevel(schema.level)}/${name}.tsx`
    const tree = getJsonTreeFromChildren(variant, workspace, nodeIdToClass)
    const config = exportConfig[componentId as ComponentId]
    invariant(config, `Config of component ${componentId} not found`)

    return {
      componentId: componentId as ComponentId,
      variantId: variantId as VariantId,
      defaultVariantId: workspaceService.getDefaultVariant(
        componentId,
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
