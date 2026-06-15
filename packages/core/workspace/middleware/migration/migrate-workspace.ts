import type { Workspace } from "../../model/workspace"
import { migrateV1BackgroundBlendFilter } from "./steps/migrate-00001-background-blend-filter"
import { migrateV2SeedPlaygrounds } from "./steps/migrate-00002-seed-playgrounds"
import { migrateV3BackgroundKind } from "./steps/migrate-00003-background-kind"
import { migrateV4GradientIntoBackground } from "./steps/migrate-00004-gradient-into-background"

/** Current workspace file version after migration steps on load. */
export const CURRENT_WORKSPACE_VERSION = 4

type MigrationStep = (workspace: Workspace) => Workspace

const MIGRATION_STEPS: Partial<Record<number, MigrationStep>> = {
  1: migrateV1BackgroundBlendFilter,
  2: migrateV2SeedPlaygrounds,
  3: migrateV3BackgroundKind,
  4: migrateV4GradientIntoBackground,
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
