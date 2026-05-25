import type { Workspace } from "../../../types"
import { migrateConsolidateAdComponents } from "./migrate-consolidate-ad-components"

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
    version: 1,
    description:
      "Consolidate legacy per-platform ad component boards into adSocialMedia.",
    migrate: migrateConsolidateAdComponents,
  },
]

export const alwaysRunMigrations: AlwaysRunMigrationRecord[] = []
