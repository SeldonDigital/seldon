import { ComponentId } from "../../../../components/constants"
import { getComponentDescendantIds } from "../../../helpers/nodes/get-descendant-ids"
import {
  nodeRetrievalService,
  nodeTraversalService,
  nodeRelationshipService,
  nodeOperationsService,
  workspaceMutationService,
  workspaceThemeService,
  workspacePropagationService,
  typeCheckingService,
} from "../../../services"
import { ExtractPayload, Workspace } from "../../../types"
import type { ValidationOptions } from "../../helpers/validation"
import { addComponent } from "./add-component"
import { duplicateNode } from "../duplicate/duplicate-node"

/**
 * Adds a variant by instantiating the default variant of the given component.
 * Initial overrides to the default variant properties can be provided.
 */
export function addVariant(
  payload: ExtractPayload<"add_variant">,
  workspace: Workspace,
  options: ValidationOptions = {},
) {
  let nextWorkspace = workspace

  if (payload.ensureDescendantComponents) {
    const components = getComponentDescendantIds(payload.componentKey as ComponentId)
    for (const componentId of components) {
      if (!nextWorkspace.components[componentId as ComponentId]) {
        nextWorkspace = addComponent(
          { componentId: componentId as ComponentId },
          nextWorkspace,
          options,
        )
      }
    }
  }

  const defaultVariant = nodeRetrievalService.getDefaultVariant(
    payload.componentKey as ComponentId,
    nextWorkspace,
  )

  return duplicateNode({ nodeId: defaultVariant.id }, nextWorkspace, options)
}
