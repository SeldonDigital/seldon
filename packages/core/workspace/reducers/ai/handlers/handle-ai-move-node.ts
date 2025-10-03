import {
  ExtractPayload,
  InstanceId,
  VariantId,
  Workspace,
} from "../../../types"
import { handleMoveNode } from "../../core/handlers/handle-move-node"

export function handleAiMoveNode(
  payload: ExtractPayload<"ai_move_node">,
  workspace: Workspace,
): Workspace {
  const validationOptions = {
    isAiOperation: true,
    strict: true,
    checkCircularDependencies: true,
    validateSchemas: true,
    validateLevels: true,
  }

  return handleMoveNode(
    {
      nodeId: payload.nodeId as InstanceId,
      target: {
        parentId: payload.target.parentId as VariantId | InstanceId,
        index: payload.target.index,
      },
    },
    workspace,
    validationOptions,
  )
}
