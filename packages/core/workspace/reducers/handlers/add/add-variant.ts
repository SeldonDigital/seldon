import { ComponentId } from "../../../../components/constants"
import { rules } from "../../../../rules/config/rules.config"
import { getComponentDescendantIds } from "../../../helpers/nodes/get-descendant-ids"
import { nodeRetrievalService } from "../../../services"
import { ExtractPayload, Workspace } from "../../../types"
import { addComponent } from "./add-component"
import { duplicateNode } from "../duplicate/duplicate-node"

/**
 * Adds a user variant by duplicating the default variant of the given component.
 * Gated by `rules.mutations.create.userVariant`; the copy runs through
 * `duplicateNode`, governed by `rules.mutations.duplicate.defaultVariant`.
 */
export function addVariant(
  payload: ExtractPayload<"add_variant">,
  workspace: Workspace,
) {
  if (!rules.mutations.create.userVariant.allowed) {
    return workspace
  }

  let nextWorkspace = workspace

  if (payload.ensureDescendantComponents) {
    const components = getComponentDescendantIds(payload.boardKey as ComponentId)
    for (const componentId of components) {
      if (!nextWorkspace.components[componentId as ComponentId]) {
        nextWorkspace = addComponent(
          { boardKey: componentId as ComponentId },
          nextWorkspace,
        )
      }
    }
  }

  const defaultVariant = nodeRetrievalService.getDefaultVariant(
    payload.boardKey as ComponentId,
    nextWorkspace,
  )

  return duplicateNode({ nodeId: defaultVariant.id }, nextWorkspace)
}
