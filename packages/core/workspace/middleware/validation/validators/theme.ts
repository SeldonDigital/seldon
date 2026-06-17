import { getComputedTheme } from "../../../compute"
import type { Workspace } from "../../../types"

export const themeValidators = {
  /** Validates that a raw theme id/ref can be materialized from the workspace/catalog. */
  exists: (workspace: Workspace, themeId: string | null | undefined) => {
    if (!themeId) return
    getComputedTheme(themeId, workspace)
  },
}
