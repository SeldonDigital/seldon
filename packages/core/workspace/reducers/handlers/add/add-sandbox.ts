import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  buildSandboxNode,
  getNextSandboxTop,
} from "../../../helpers/nodes/sandbox"
import { isPlaygroundContainer } from "../../../model/playground"

/**
 * Mints a Sandbox root node on a playground. The Sandbox is a `type: "variant"`
 * node templating from `catalog:sandbox`, so it reuses the variant duplication
 * and branching machinery while staying independent of other sandboxes. The new
 * sandbox is placed below existing ones so it does not overlap.
 */
export function addSandbox(
  payload: ExtractPayload<"add_sandbox">,
  workspace: Workspace,
): Workspace {
  if (!rules.mutations.create.userVariant.allowed) {
    return workspace
  }

  const playground = workspace.playgrounds?.[payload.playgroundKey]
  if (!playground || !isPlaygroundContainer(playground)) {
    return workspace
  }

  return produce(workspace, (draft) => {
    const container = draft.playgrounds[payload.playgroundKey]
    const nextTop = getNextSandboxTop(container.variants, draft.nodes)
    const { id, node } = buildSandboxNode(payload.playgroundKey, { top: nextTop })
    draft.nodes[id] = node
    container.variants.push({ id })
  })
}
