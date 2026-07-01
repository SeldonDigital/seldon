import type { Workspace } from "../../model/workspace"
import { migrateV1Baseline } from "./steps/migrate-00001-baseline"
import { migrateV2InterfaceSwatches } from "./steps/migrate-00002-interface-swatches"
import { migrateV3PopPunkRename } from "./steps/migrate-00003-pop-punk-rename"

/** Current workspace file version after migration steps on load. */
export const CURRENT_WORKSPACE_VERSION = 3

type MigrationStep = (workspace: Workspace) => Workspace

const MIGRATION_STEPS: Partial<Record<number, MigrationStep>> = {
  1: migrateV1Baseline,
  2: migrateV2InterfaceSwatches,
  3: migrateV3PopPunkRename,
}

/** Runs versioned migration steps from storedVersion + 1 through CURRENT. */
export function migrateWorkspace(workspace: Workspace): Workspace {
  const storedVersion = workspace.metadata.version ?? 0
  let current = workspace

  for (
    let targetVersion = storedVersion + 1;
    targetVersion <= CURRENT_WORKSPACE_VERSION;
    targetVersion++
  ) {
    const step = MIGRATION_STEPS[targetVersion]
    if (step) {
      current = step(current)
    }
  }

  return current
}
