import { Workspace } from "../../types"
import { MigrationRecord } from "./migrations"

/**
 * Example migration: Adds metadata field to all nodes.
 */
export const addNodeMetadataMigration: MigrationRecord = {
  version: 2,
  description: "Add metadata field to all nodes",
  migrate: (workspace: Workspace) => {
    const updatedWorkspace = { ...workspace }

    Object.keys(updatedWorkspace.byId).forEach((nodeId) => {
      const node = updatedWorkspace.byId[nodeId]
      // @ts-expect-error - Test migration; ignore types
      node.metadata = {
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      }
    })

    return updatedWorkspace
  },
}

/**
 * Example migration: Renames a property across all nodes.
 */
export const renamePropertyMigration: MigrationRecord = {
  version: 3,
  description: "Rename 'oldProperty' to 'newProperty' in all nodes",
  migrate: (workspace: Workspace) => {
    const updatedWorkspace = { ...workspace }

    Object.keys(updatedWorkspace.byId).forEach((nodeId) => {
      const node = updatedWorkspace.byId[nodeId]
      // @ts-expect-error - Test migration; ignore types
      if (node.properties.oldProperty) {
        // @ts-expect-error - Test migration; ignore types
        node.properties.newProperty = node.properties.oldProperty
        // @ts-expect-error - Test migration; ignore types
        delete node.properties.oldProperty
      }
    })

    return updatedWorkspace
  },
}

/**
 * Example migration: Adds order field to all boards.
 */
export const addBoardOrderMigration: MigrationRecord = {
  version: 4,
  description: "Add order field to all boards",
  migrate: (workspace: Workspace) => {
    const updatedWorkspace = { ...workspace }

    Object.keys(updatedWorkspace.boards).forEach((boardId) => {
      const board =
        updatedWorkspace.boards[boardId as keyof typeof updatedWorkspace.boards]
      if (board && !("order" in board)) {
        // @ts-expect-error - Test migration; ignore types
        board.order = 0
      }
    })

    return updatedWorkspace
  },
}
