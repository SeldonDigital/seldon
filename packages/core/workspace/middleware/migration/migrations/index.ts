import { produce } from "immer"
import { seedDefaultThemeBoard } from "../../../helpers/themes/seed-default-theme-board"
import type { Workspace } from "../../../types"

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
]

export const alwaysRunMigrations: AlwaysRunMigrationRecord[] = [
  {
    description: "Ensure the default theme board exists.",
    migrate: (workspace) =>
      produce(workspace, (draft) => {
        seedDefaultThemeBoard(draft)
      }),
  },
]
