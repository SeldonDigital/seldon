import { ComponentId } from "@seldon/core/components/constants"
import { isIconSheetVariant } from "../types/icon-sheet-variant"
import { parseNodeCatalog } from "@seldon/core/workspace/model/template-ref"
import { nodeTraversalService } from "@seldon/core/workspace/services"
import { Instance, Variant, Workspace } from "@seldon/core/workspace/types"
import { isIconSetVariant } from "./is-icon-set-variant"

function entryTemplate(node: Variant | Instance): string | null {
  if ("template" in node && typeof node.template === "string") {
    return node.template
  }
  return null
}

function catalogComponentId(template: string): ComponentId | undefined {
  const parsed = parseNodeCatalog(template)
  if (parsed?.kind === "catalog" && parsed.componentId) {
    return parsed.componentId as ComponentId
  }
  return undefined
}

export function isIconSetInstance(
  instance: Instance,
  workspace: Workspace,
): boolean {
  const instanceTemplate = entryTemplate(instance)
  if (!instanceTemplate || catalogComponentId(instanceTemplate) !== ComponentId.ICON) {
    return false
  }

  const parent = nodeTraversalService.findParentNode(instance.id, workspace)
  if (!parent) {
    return false
  }

  const parentTemplate = entryTemplate(parent)
  if (!parentTemplate || catalogComponentId(parentTemplate) !== ComponentId.FRAME) {
    return false
  }

  const grandparent = nodeTraversalService.findParentNode(parent.id, workspace)
  if (!grandparent) {
    return false
  }

  if (isIconSheetVariant(grandparent)) {
    return isIconSetVariant(grandparent, workspace)
  }

  return false
}
