import { produce } from "immer"
import { seedDefaultIconSetBoard } from "../../../helpers/icon-sets/seed-default-icon-set-board"
import { seedDefaultThemeBoard } from "../../../helpers/themes/seed-default-theme-board"
import type { Workspace } from "../../../types"
import { backfillInstanceOrigin } from "./backfill-instance-origin"

export type MigrationFunction = (workspace: Workspace) => Workspace

export interface MigrationRecord {
  version: number
  description: string
  migrate: MigrationFunction
}

export interface AlwaysRunMigrationRecord {
  description: string
  migrate: MigrationFunction
}

export const migrations: MigrationRecord[] = [
  {
    version: 5,
    description: "Backfill instance origin classification (schema vs user).",
    migrate: backfillInstanceOrigin,
  },
]

export const alwaysRunMigrations: AlwaysRunMigrationRecord[] = [
  {
    description: "Ensure the default theme board exists.",
    migrate: (workspace) =>
      produce(workspace, (draft) => {
        seedDefaultThemeBoard(draft)
      }),
  },
  {
    description: "Ensure the default Seldon icon set board exists.",
    migrate: (workspace) =>
      produce(workspace, (draft) => {
        seedDefaultIconSetBoard(draft)
      }),
  },
]
