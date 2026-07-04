import type { Workspace } from "../../model/workspace"
import { migrateV1Baseline } from "./steps/migrate-00001-baseline"
import { migrateV2InterfaceSwatches } from "./steps/migrate-00002-interface-swatches"
import { migrateV3ThemeRenames } from "./steps/migrate-00003-theme-renames"
import { migrateV4EnableDefaultFonts } from "./steps/migrate-00004-enable-default-fonts"
import { migrateV5EnableQuicksandFont } from "./steps/migrate-00005-enable-quicksand-font"
import { migrateV6IconSetRenames } from "./steps/migrate-00006-icon-set-renames"
import { migrateV7ThemeModeChroma } from "./steps/migrate-00007-theme-mode-chroma"

/** Current workspace file version after migration steps on load. */
export const CURRENT_WORKSPACE_VERSION = 7

type MigrationStep = (workspace: Workspace) => Workspace

const MIGRATION_STEPS: Partial<Record<number, MigrationStep>> = {
  1: migrateV1Baseline,
  2: migrateV2InterfaceSwatches,
  3: migrateV3ThemeRenames,
  4: migrateV4EnableDefaultFonts,
  5: migrateV5EnableQuicksandFont,
  6: migrateV6IconSetRenames,
  7: migrateV7ThemeModeChroma,
}

if (!MIGRATION_STEPS[CURRENT_WORKSPACE_VERSION]) {
  throw new Error(
    `CURRENT_WORKSPACE_VERSION is ${CURRENT_WORKSPACE_VERSION} but no migration step is registered for it.`,
  )
}

/**
 * Idempotent repairs that run on every load, regardless of stored version.
 *
 * Versioned steps only run once, when a file crosses their version. Stock theme
 * and icon set renames must also reach files already stamped at the current
 * version: a persisted workspace that still points at a renamed template, or
 * that keeps two boards under the same catalog key, would otherwise fail to
 * open or select the wrong board. Each repair guards itself and only rewrites
 * the references it matches, so it is safe to re-run and applies each rename
 * independently rather than all-or-nothing.
 */
const REPAIR_STEPS: MigrationStep[] = [
  migrateV3ThemeRenames,
  migrateV6IconSetRenames,
]

/**
 * Runs versioned migration steps from storedVersion + 1 through CURRENT, then
 * applies idempotent repair steps on every load. Throws when the file was
 * saved by a newer app version, because stamping it down would silently
 * discard data this version cannot understand.
 */
export function migrateWorkspace(workspace: Workspace): Workspace {
  const storedVersion = workspace.metadata.version ?? 0

  if (storedVersion > CURRENT_WORKSPACE_VERSION) {
    throw new Error(
      `Workspace file version ${storedVersion} is newer than the supported version ${CURRENT_WORKSPACE_VERSION}. Update the app to open this file.`,
    )
  }

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

  for (const repair of REPAIR_STEPS) {
    current = repair(current)
  }

  return current
}
