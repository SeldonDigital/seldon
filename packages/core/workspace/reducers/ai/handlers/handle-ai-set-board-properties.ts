import { ExtractPayload, Workspace } from "../../../types"
import { handleSetBoardProperties } from "../../core/handlers/handle-set-board-properties"

export function handleAiSetBoardProperties(
  payload: ExtractPayload<"ai_set_board_properties">,
  workspace: Workspace,
): Workspace {
  return handleSetBoardProperties(payload, workspace)
}
