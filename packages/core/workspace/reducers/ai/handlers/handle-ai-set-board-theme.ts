import { ExtractPayload, Workspace } from "../../../types"
import { handleSetBoardTheme } from "../../core/handlers/handle-set-board-theme"

export function handleAiSetBoardTheme(
  payload: ExtractPayload<"ai_set_board_theme">,
  workspace: Workspace,
): Workspace {
  return handleSetBoardTheme(payload, workspace)
}
