import { ExtractPayload, Workspace } from "../../../types"
import { handleAddBoard } from "../../core/handlers/handle-add-board"

export function handleAiAddComponent(
  payload: ExtractPayload<"ai_add_component">,
  workspace: Workspace,
): Workspace {
  const validationOptions = {
    isAiOperation: true,
    strict: true,
    checkCircularDependencies: true,
    validateSchemas: true,
    validateLevels: true,
  }

  return handleAddBoard(
    { componentId: payload.componentId },
    workspace,
    validationOptions,
  )
}
