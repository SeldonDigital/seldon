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

export const alwaysRunMigrations: AlwaysRunMigrationRecord[] = []
