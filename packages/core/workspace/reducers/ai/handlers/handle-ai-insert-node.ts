import {
  ExtractPayload,
  InstanceId,
  VariantId,
  Workspace,
} from "../../../types"
import { handleInsertNode } from "../../core/handlers/handle-insert-node"

export function handleAiInsertNode(
  payload: ExtractPayload<"ai_insert_node">,
  workspace: Workspace,
): Workspace {
  const validationOptions = {
    isAiOperation: true,
    strict: true,
    checkCircularDependencies: true,
    validateSchemas: true,
    validateLevels: true,
  }

  return handleInsertNode(
    {
      nodeId: payload.nodeId as VariantId | InstanceId,
      target: {
        parentId: payload.target.parentId as VariantId | InstanceId,
        index: payload.target.index,
      },
    },
    workspace,
    validationOptions,
  )
}
