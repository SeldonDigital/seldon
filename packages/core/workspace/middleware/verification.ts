import { ValueType } from "../../properties"
import { ErrorMessages } from "../constants"
import { isVariantNode } from "../helpers/is-variant-node"
import { workspaceService } from "../services/workspace.service"
import { Middleware, Workspace } from "../types"
import { WorkspaceValidationError } from "./validation"

/**
 * Assertion function that throws an error if condition is falsy.
 * Unlike invariant, doesn't prefix messages or omit them in production.
 */
function check(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

const validators = {
  /** Validates that all child references in nodes point to existing nodes. */
  allChildrenExist: (workspace: Workspace) => {
    Object.values(workspace.byId).forEach((node) => {
      if (node.children && node.children.length > 0) {
        node.children.forEach((childId) => {
          check(workspace.byId[childId], ErrorMessages.nodeNotFound(childId))
        })
      }
    })
  },
  /** Validates that all variant references in boards point to existing variants. */
  allVariantsExist: (workspace: Workspace) => {
    Object.values(workspace.boards).forEach((board) => {
      board.variants.forEach((variantId) => {
        check(
          workspace.byId[variantId],
          ErrorMessages.missingVariant(variantId),
        )
      })
    })
  },
  /** Validates that all instance references point to existing variants. */
  allInstancesExist: (workspace: Workspace) => {
    Object.values(workspace.byId).forEach((node) => {
      if (workspaceService.isInstance(node)) {
        check(
          workspace.byId[node.instanceOf],
          ErrorMessages.missingInstance(node.id, node.instanceOf),
        )
      }
    })
  },
  /** Validates that all node IDs are unique. */
  uniqueIds: (workspace: Workspace) => {
    const ids = Object.values(workspace.byId).map((node) => node.id)
    const uniqueIds = new Set(ids)

    if (ids.length !== uniqueIds.size) {
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
      throw new Error(ErrorMessages.duplicateIds(duplicateIds))
    }
  },
  /** Validates that all child node IDs are unique across the workspace. */
  uniqueInstanceIds: (workspace: Workspace) => {
    const ids = Object.values(workspace.byId)
      .filter((node) => node.children)
      .flatMap((node) => node.children!)

    const uniqueIds = new Set(ids)

    if (ids.length !== uniqueIds.size) {
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
      throw new Error(ErrorMessages.duplicateInstanceIds(duplicateIds))
    }
  },

  /** Validates that all variants are referenced by at least one board. */
  noDanglingVariants: (workspace: Workspace) => {
    const variants = Object.values(workspace.byId).filter(isVariantNode)
    variants.forEach((variant) => {
      check(
        Object.values(workspace.boards).some((board) =>
          board.variants.includes(variant.id),
        ),
        ErrorMessages.danglingVariant(variant.id),
      )
    })
  },
  /** Validates that all child nodes are referenced by at least one parent node. */
  noDanglingChildNodes: (workspace: Workspace) => {
    const nodes = Object.values(workspace.byId).filter(
      workspaceService.isInstance,
    )
    nodes.forEach((child) => {
      check(
        Object.values(workspace.byId).some((node) =>
          node.children?.includes(child.id),
        ),
        ErrorMessages.danglingChildNode(child.id),
      )
    })
  },

  /** Validates that variants don't have computed properties referencing parent nodes. */
  checkNoVariantsWithComputedProperties: (workspace: Workspace) => {
    Object.values(workspace.byId)
      .filter(isVariantNode)
      .forEach((variant) => {
        Object.entries(variant.properties).forEach(([key, property]) => {
          if (
            "type" in property &&
            property.type === ValueType.COMPUTED &&
            property.value.input.basedOn.startsWith("#parent")
          ) {
            throw new Error(
              ErrorMessages.variantRefersToParent(variant.id, key),
            )
          }
        })
      })
  },

  /** Validates that board order indices are sequential without gaps or duplicates. */
  checkBoardOrder: (workspace: Workspace) => {
    const boards = Object.values(workspace.boards)

    boards
      .sort((a, b) => a.order - b.order)
      .forEach((board, index) => {
        if (board.order !== index) {
          throw new Error(
            ErrorMessages.invalidBoardIndex(board.id, board.order, index),
          )
        }
      })
  },
  /** Validates that each board has exactly one default variant. */
  oneDefaultVariantPerBoard: (workspace: Workspace) => {
    Object.values(workspace.boards).forEach((board) => {
      const defaultVariants = board.variants.filter((variantId) => {
        const variant = workspace.byId[variantId]
        return workspaceService.isDefaultVariant(variant)
      })
      if (defaultVariants.length > 1) {
        throw new Error(ErrorMessages.tooManyDefaultVariants(board.id))
      }

      if (defaultVariants.length === 0) {
        throw new Error(ErrorMessages.defaultVariantNotFound(board.id))
      }
    })
  },
}
/**
 * Middleware that verifies workspace integrity after every action.
 * Runs comprehensive validation checks and logs results in development.
 */
export const workspaceVerificationMiddleware: Middleware =
  (next) => (workspace, action) => {
    const nextWorkspace = next(workspace, action)

    try {
      const isDev = import.meta.env.DEV
      isDev && console.groupCollapsed("🔍 Verifying workspace")

      validators.allChildrenExist(nextWorkspace)
      log("✅ All children exist")

      validators.allVariantsExist(nextWorkspace)
      log("✅ All variants exist")

      validators.allInstancesExist(nextWorkspace)
      log("✅ All instances exist")

      validators.oneDefaultVariantPerBoard(nextWorkspace)
      log("✅ One default variant per board")

      validators.uniqueIds(nextWorkspace)
      log("✅ All ids are unique")

      validators.uniqueInstanceIds(nextWorkspace)
      log("✅ All child ids are unique")

      validators.noDanglingVariants(nextWorkspace)
      log("✅ No dangling variants found")

      validators.noDanglingChildNodes(nextWorkspace)
      log("✅ No dangling child nodes found")

      validators.checkNoVariantsWithComputedProperties(nextWorkspace)
      log("✅ No variants with computed properties referencing parent nodes")
      validators.checkBoardOrder(nextWorkspace)
      log("✅ Board order is valid")

      isDev && console.groupEnd()
    } catch (error) {
      if (error instanceof Error) {
        const actionString = JSON.stringify(action, null, 2)
        logError(
          `The following action caused an error:\n\n${actionString}`,
          error,
        )
        throw new WorkspaceValidationError(error.message, action)
      }
      throw error
    }

    return nextWorkspace
  }

const log = (message: any) => {
  const isDev = import.meta.env.DEV
  isDev && console.log(message)
}

const logError = (message: any, error: Error) => {
  const isDev = import.meta.env.DEV
  isDev && console.error(message)
  isDev && console.error(error)
}
