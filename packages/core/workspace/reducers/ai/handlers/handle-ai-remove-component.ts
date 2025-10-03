import { ExtractPayload, Workspace } from "../../../types"
import { handleRemoveBoard } from "../../core/handlers/handle-remove-board"

export function handleAiRemoveComponent(
  payload: ExtractPayload<"ai_remove_component">,
  workspace: Workspace,
): Workspace {
  return handleRemoveBoard(payload, workspace)
}
