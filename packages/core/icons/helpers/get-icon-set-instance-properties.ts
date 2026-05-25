import { ComponentId } from "@seldon/core/components/constants"
import { Properties } from "@seldon/core/properties/types/properties"
import {
  isIconSetBoard,
  type IconSetBoard,
} from "@seldon/core/workspace/model/components"
import type { IconSheetVariant } from "../types/icon-sheet-variant"
import { nodeTraversalService } from "@seldon/core/workspace/services"
import { Instance, Workspace } from "@seldon/core/workspace/types"
import { getIconSetProperties } from "./get-icon-set-properties"
import { isIconSetInstance } from "./is-icon-set-instance"

export function getIconSetInstanceProperties(
  instance: Instance,
  workspace: Workspace,
): Properties {
  if (!isIconSetInstance(instance, workspace)) {
    return instance.overrides ?? {}
  }

  const parent = nodeTraversalService.findParentNode(instance.id, workspace)
  if (!parent) {
    return instance.overrides ?? {}
  }

  const grandparent = nodeTraversalService.findParentNode(parent.id, workspace)
  if (!grandparent) {
    return instance.overrides ?? {}
  }

  const board = Object.values(workspace.components).find(
    (entry): entry is IconSetBoard => !!entry && isIconSetBoard(entry),
  )
  if (!board) {
    return instance.overrides ?? {}
  }

  const variantProperties = getIconSetProperties(
    grandparent as IconSheetVariant,
    board,
    workspace,
  )
  const instanceOverrides = instance.overrides ?? {}

  return {
    ...variantProperties,
    ...instanceOverrides,
  }
}
