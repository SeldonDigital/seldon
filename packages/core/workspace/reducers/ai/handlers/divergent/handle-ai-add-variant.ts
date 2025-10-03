import { ComponentId } from "../../../../../components/constants"
import { getComponentDescendantIds } from "../../../../helpers/get-descendant-ids"
import { ExtractPayload, Workspace } from "../../../../types"
import { handleAddBoard } from "../../../core/handlers/handle-add-board"
import { handleAddVariant } from "../../../core/handlers/handle-add-variant"

export function handleAiAddVariant(
  payload: ExtractPayload<"ai_add_variant">,
  workspace: Workspace,
): Workspace {
  // First, ensure the main component board exists
  if (!workspace.boards[payload.componentId]) {
    throw new Error(
      `Board for component ${payload.componentId} does not exist. Cannot create variant.`,
    )
  }

  // Then, ensure all descendant components have boards
  // This is the same logic as core handleAddBoard but only for missing boards
  const components = getComponentDescendantIds(payload.componentId)

  let updatedWorkspace = workspace

  // Check if any descendant components need boards created
  for (const componentId of components) {
    if (!updatedWorkspace.boards[componentId as ComponentId]) {
      // Create the board for this component with enhanced validation
      const validationOptions = {
        isAiOperation: true,
        strict: true,
        checkCircularDependencies: true,
        validateSchemas: true,
        validateLevels: true,
      }
      updatedWorkspace = handleAddBoard(
        { componentId },
        updatedWorkspace,
        validationOptions,
      )
    }
  }

  // Now create the variant - this will work because all dependencies exist
  // Enable enhanced validation for AI operations
  const validationOptions = {
    isAiOperation: true,
    strict: true,
    checkCircularDependencies: true,
    validateSchemas: true,
    validateLevels: true,
  }

  return handleAddVariant(
    { componentId: payload.componentId },
    updatedWorkspace,
    validationOptions,
  )
}
