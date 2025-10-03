import { ComponentId } from "../../../../components/constants"
import { ExtractPayload, Workspace } from "../../../types"
import { handleReorderBoard } from "../../core/handlers/handle-reorder-board"

export function handleAiReorderBoard(
  payload: ExtractPayload<"ai_reorder_board">,
  workspace: Workspace,
): Workspace {
  return handleReorderBoard(
    {
      componentId: payload.componentId as ComponentId,
      newIndex: payload.newIndex,
    },
    workspace,
  )
}
