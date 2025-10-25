import { produce } from "immer"
import { ComponentId } from "../../../../components/constants"
import customTheme from "../../../../themes/custom"
import { Workspace } from "../../../types"
import { deletedComponents } from "../deleted-components"
import { removePropertiesThatArentOverrides } from "../helpers/remove-properties-that-arent-overrides"
import { renameToneToBrightness } from "../helpers/rename-tone-to-brightness"
import { updateComponentId } from "../helpers/update-component-id"
import { updatedComponentIds } from "../updated-component-ids"
import { addBoardComponentField } from "./migration-20251021-add-board-component-field"

// Migration function type
export type MigrationFunction = (workspace: Workspace) => Workspace

// Migration record type
export interface MigrationRecord {
  version: number
  description: string
  migrate: MigrationFunction
}

export interface AlwaysRunMigrationRecord {
  description: string
  migrate: MigrationFunction
}

// Migration registry - make sure you add the latest migration to the start of the array!
export const migrations: MigrationRecord[] = [
  {
    version: 3,
    description:
      "Add component field to all existing boards for Board schema system",
    migrate: addBoardComponentField,
  },
  {
    version: 2,
    description:
      "Migrate from legacy workspaces (version ≤ 20) to version 2 baseline",
    migrate: (workspace: Workspace) => {
      return produce(workspace, (draft) => {
        // Handle version normalization from any legacy version to 2
        if (draft.version <= 20) {
          draft.version = 2
        }

        // Ensure workspace has required structure
        if (!draft.boards) draft.boards = {}
        if (!draft.byId) draft.byId = {}
        // Always replace customTheme with baseline for legacy workspaces
        draft.customTheme = customTheme

        // Ensure all nodes have required fields
        for (const [nodeId, node] of Object.entries(draft.byId)) {
          if (node && typeof node === "object") {
            if (!node.children) node.children = []
            if (!node.properties) node.properties = {}
            // Remove fromSchema if present (not in current schema)
            if ("fromSchema" in node) {
              delete (node as any).fromSchema
            }
          }
        }

        // Handle deleted components - remove boards and nodes
        for (const deletedComponent of deletedComponents) {
          if (draft.boards[deletedComponent as ComponentId]) {
            delete draft.boards[deletedComponent as ComponentId]
          }
          // Remove nodes that reference deleted components
          for (const [nodeId, node] of Object.entries(draft.byId)) {
            if (node && node.component === deletedComponent) {
              delete draft.byId[nodeId]
            }
          }
        }

        // Handle updated component IDs
        for (const [oldId, newId] of Object.entries(updatedComponentIds)) {
          if (draft.boards[oldId as ComponentId]) {
            // Update component ID and merge the result back into draft
            const updatedWorkspace = updateComponentId(
              draft,
              oldId as ComponentId,
              newId,
            )
            Object.assign(draft, updatedWorkspace)
          }
        }

        // Ensure all boards have required fields
        for (const [boardId, board] of Object.entries(draft.boards)) {
          if (board && typeof board === "object") {
            if (!board.variants) board.variants = []
            if (typeof board.order !== "number") board.order = 0
            if (!board.theme) board.theme = "default"
            if (!board.properties) board.properties = {}
          }
        }
      })
    },
  },
  {
    version: 1,
    description: "Baseline migration - ensure workspace has expected structure",
    migrate: (workspace: Workspace) => {
      return produce(workspace, (draft) => {
        // Ensure workspace has required structure
        if (!draft.boards) draft.boards = {}
        if (!draft.byId) draft.byId = {}
        if (!draft.customTheme) draft.customTheme = customTheme

        // Ensure all nodes have required properties
        for (const [nodeId, node] of Object.entries(draft.byId)) {
          if (node && typeof node === "object") {
            if (!node.properties) node.properties = {}
            if (!node.children) node.children = []
          }
        }

        // Ensure all boards have required properties
        for (const [boardId, board] of Object.entries(draft.boards)) {
          if (board && typeof board === "object") {
            if (!board.properties) board.properties = {}
            if (!board.variants) board.variants = []
            if (typeof board.order !== "number") board.order = 0
            if (!board.theme) board.theme = "default"
          }
        }
      })
    },
  },
]

// Always run migrations - these run on every workspace load
export const alwaysRunMigrations: AlwaysRunMigrationRecord[] = [
  {
    description: "Remove properties that aren't overrides",
    migrate: (workspace: Workspace) => {
      return removePropertiesThatArentOverrides(workspace)
    },
  },
  {
    description: "Rename tone to brightness",
    migrate: (workspace: Workspace) => {
      return produce(workspace, (draft) => {
        // Apply tone to brightness renaming to all nodes and boards
        for (const node of Object.values(draft.byId)) {
          renameToneToBrightness(node.properties)
        }
        for (const board of Object.values(draft.boards)) {
          renameToneToBrightness(board.properties)
        }
      })
    },
  },
]

// Export schemaMigrations for backward compatibility
export const schemaMigrations = alwaysRunMigrations
