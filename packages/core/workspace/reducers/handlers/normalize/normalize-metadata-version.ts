import { produce } from "immer"
import type { ExtractPayload, Workspace } from "../../../../index"
import { CURRENT_WORKSPACE_VERSION } from "../../../middleware/migration/middleware"

export function normalizeMetadataVersion(
  _payload: ExtractPayload<"normalize_metadata_version">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.metadata.version = CURRENT_WORKSPACE_VERSION
  })
}
