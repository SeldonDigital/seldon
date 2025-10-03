import {
  ExtractPayload,
  InstanceId,
  VariantId,
  Workspace,
} from "../../../types"
import { handleDuplicateNode } from "../../core/handlers/handle-duplicate-node"

export function handleAiDuplicateNode(
  payload: ExtractPayload<"ai_duplicate_node">,
  workspace: Workspace,
): Workspace {
  const validationOptions = {
    isAiOperation: true,
    strict: true,
    checkCircularDependencies: true,
    validateSchemas: true,
    validateLevels: true,
  }

  return handleDuplicateNode(
    {
      nodeId: payload.nodeId as InstanceId | VariantId,
    },
    workspace,
    validationOptions,
  )
}
