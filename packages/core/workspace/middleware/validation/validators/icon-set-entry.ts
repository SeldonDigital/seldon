import type { Workspace } from "../../../types"
import { check } from "../check"

export const iconSetEntryValidators = {
  exists: (workspace: Workspace, id: string | undefined) => {
    if (!id) return
    check(workspace["icon-sets"][id], `Icon set ${id} not found`)
  },
}
