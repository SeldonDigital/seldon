import { ComponentId } from "../../../../components/constants"
import { rules } from "../../../../rules/config/rules.config"
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
 * Adds a variant by duplicating the default variant of the given component.
 * Adding a variant creates a user variant, so it is gated by
 * `rules.mutations.create.userVariant`. The actual copy then runs through
 * `duplicateNode`, governed by `rules.mutations.duplicate.defaultVariant`.
 * Initial overrides to the default variant properties can be provided.
 */
export function addVariant(
  payload: ExtractPayload<"add_variant">,
  workspace: Workspace,
  options: ValidationOptions = {},
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
          { componentId: componentId as ComponentId },
          nextWorkspace,
          options,
        )
      }
    }
  }

  const defaultVariant = nodeRetrievalService.getDefaultVariant(
    payload.boardKey as ComponentId,
    nextWorkspace,
  )

  return duplicateNode({ nodeId: defaultVariant.id }, nextWorkspace, options)
}
