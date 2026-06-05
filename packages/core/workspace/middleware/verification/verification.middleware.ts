import { isComponentId } from "../../../components/constants"
import { ValueType } from "../../../properties"
import { isWorkspaceLoggingEnabled } from "../../../utils/debug-logger"
import { ErrorMessages } from "../../constants"
import { getComponentId } from "../../helpers/components/get-component-ids"
import { findComponentTreeCycleId } from "../../helpers/components/find-tree-cycle"
import { walkComponentTreeRefs } from "../../helpers/components/walk-component-tree-refs"
import { getWorkspaceNodes } from "../../helpers/general/get-workspace-nodes"
import { isResourceType } from "../../helpers/components/is-resource-type"
import { isVariantNode } from "../../helpers/nodes/is-variant-node"
import { isEntryNodeForRules } from "../../helpers/rules/rules-node-subject"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isThemeBoard,
} from "../../model/components"
import { parseNodeLink } from "../../model/template-ref"
import { typeCheckingService } from "../../services"
import { Middleware, Workspace } from "../../types"
import { check } from "../validation/check"
import { WorkspaceValidationError } from "../validation/workspace-validation-error"

function collectComponentTreeNodeIds(workspace: Workspace): Set<string> {
  const ids = new Set<string>()
  for (const board of Object.values(workspace.components)) {
    walkComponentTreeRefs(board.variants, (ref) => {
      ids.add(ref.id)
    })
  }
  return ids
}

const validators = {
  /**
   * Validates that no board variant tree contains a cycle. Runs before the
   * recursive tree walkers so a cyclic tree fails with a clear message instead
   * of overflowing the call stack.
   */
  noCyclicTrees: (workspace: Workspace) => {
    const cycleId = findComponentTreeCycleId(workspace)
    if (cycleId) {
      throw new Error(ErrorMessages.cyclicComponentTree(cycleId))
    }
  },
  /** Validates that every child ref in board trees points at a node row. */
  allChildrenExist: (workspace: Workspace) => {
    const nodes = getWorkspaceNodes(workspace)
    for (const board of Object.values(workspace.components)) {
      // Resource boards (theme, icon-set, media) reference their own maps, not nodes.
      if (isResourceType(board)) {
        continue
      }
      walkComponentTreeRefs(board.variants, (ref) => {
        for (const child of ref.children ?? []) {
          check(nodes[child.id], ErrorMessages.nodeNotFound(child.id))
        }
      })
    }
  },
  /** Validates that every tree ref id maps to a node row. */
  allVariantsExist: (workspace: Workspace) => {
    const nodes = getWorkspaceNodes(workspace)
    for (const board of Object.values(workspace.components)) {
      // Resource boards (theme, icon-set, media) reference their own maps, not nodes.
      if (isResourceType(board)) {
        continue
      }
      walkComponentTreeRefs(board.variants, (ref) => {
        check(nodes[ref.id], ErrorMessages.missingVariant(ref.id))
      })
    }
  },
  /** Validates that `node:{id}` templates point at existing entry rows. */
  allNodeTemplateTargetsExist: (workspace: Workspace) => {
    const nodes = getWorkspaceNodes(workspace)
    Object.values(nodes).forEach((node) => {
      if (!isEntryNodeForRules(node)) return
      const link = parseNodeLink(node.template)
      if (link?.kind !== "node") return
      check(
        nodes[link.nodeId],
        ErrorMessages.missingInstance(node.id, link.nodeId),
      )
    })
  },
  /** Validates that all node IDs are unique. */
  uniqueIds: (workspace: Workspace) => {
    const ids = Object.values(getWorkspaceNodes(workspace)).map((node) => node.id)
    const uniqueIds = new Set(ids)

    if (ids.length !== uniqueIds.size) {
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
      throw new Error(ErrorMessages.duplicateIds(duplicateIds))
    }
  },
  /** Validates that each variant node appears in some board tree. */
  noDanglingVariants: (workspace: Workspace) => {
    const treeIds = collectComponentTreeNodeIds(workspace)
    Object.values(getWorkspaceNodes(workspace))
      .filter(isVariantNode)
      .forEach((variant) => {
        check(treeIds.has(variant.id), ErrorMessages.danglingVariant(variant.id))
      })
  },
  /** Validates that each instance node appears in some board tree. */
  noDanglingChildNodes: (workspace: Workspace) => {
    const treeIds = collectComponentTreeNodeIds(workspace)
    Object.values(getWorkspaceNodes(workspace))
      .filter(typeCheckingService.isInstance)
      .forEach((child) => {
        check(treeIds.has(child.id), ErrorMessages.danglingChildNode(child.id))
      })
  },
  /** Validates that each instance node carries a valid origin classification. */
  instancesHaveOrigin: (workspace: Workspace) => {
    Object.values(getWorkspaceNodes(workspace))
      .filter(typeCheckingService.isInstance)
      .forEach((instance) => {
        check(
          instance.origin === "schema" || instance.origin === "user",
          ErrorMessages.instanceMissingOrigin(instance.id),
        )
      })
  },

  /** Validates that variants don't have computed overrides referencing parent nodes. */
  checkNoVariantsWithComputedProperties: (workspace: Workspace) => {
    Object.values(getWorkspaceNodes(workspace))
      .filter(isVariantNode)
      .forEach((variant) => {
        Object.entries(variant.overrides).forEach(([key, property]) => {
          if (
            property &&
            typeof property === "object" &&
            "type" in property &&
            property.type === ValueType.COMPUTED &&
            "value" in property &&
            property.value &&
            typeof property.value === "object" &&
            "input" in property.value &&
            property.value.input &&
            typeof (property.value.input as { basedOn?: string }).basedOn ===
              "string" &&
            (property.value.input as { basedOn: string }).basedOn.startsWith(
              "#parent",
            )
          ) {
            throw new Error(
              ErrorMessages.variantRefersToParent(variant.id, key),
            )
          }
        })
      })
  },

  /** Validates that each component board has exactly one default variant root. */
  oneDefaultVariantPerComponent: (workspace: Workspace) => {
    const nodes = getWorkspaceNodes(workspace)
    Object.values(workspace.components).forEach((board) => {
      if (
        isIconSetBoard(board) ||
        isThemeBoard(board) ||
        isFontCollectionBoard(board)
      ) {
        return
      }

      if (isResourceType(board) && board.variants.length === 0) {
        return
      }

      const defaultVariants = board.variants.filter((ref) => {
        const variant = nodes[ref.id]
        return variant && typeCheckingService.isDefaultVariant(variant)
      })

      const componentKey =
        getComponentId(workspace, board) ??
        ("catalogId" in board ? board.catalogId : "")

      if (defaultVariants.length > 1) {
        throw new Error(
          isComponentId(componentKey)
            ? ErrorMessages.tooManyDefaultVariants(componentKey)
            : `ComponentEntry ${componentKey} has more than one default variant.`,
        )
      }

      if (defaultVariants.length === 0) {
        throw new Error(
          isComponentId(componentKey)
            ? ErrorMessages.defaultVariantNotFound(componentKey)
            : `Default variant not found for board ${componentKey}.`,
        )
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
      const shouldLogVerification =
        process.env.NODE_ENV === "development" && isWorkspaceLoggingEnabled()
      shouldLogVerification && console.groupCollapsed("🔍 Verifying workspace")

      validators.noCyclicTrees(nextWorkspace)
      log("✅ No cyclic component trees")

      validators.allChildrenExist(nextWorkspace)
      log("✅ All children exist")

      validators.allVariantsExist(nextWorkspace)
      log("✅ All variants exist")

      validators.allNodeTemplateTargetsExist(nextWorkspace)
      log("✅ All node template targets exist")

      validators.oneDefaultVariantPerComponent(nextWorkspace)
      log("✅ One default variant per board")

      validators.uniqueIds(nextWorkspace)
      log("✅ All node map ids are unique")

      validators.noDanglingVariants(nextWorkspace)
      log("✅ No dangling variants found")

      validators.noDanglingChildNodes(nextWorkspace)
      log("✅ No dangling child nodes found")

      validators.instancesHaveOrigin(nextWorkspace)
      log("✅ All instances have an origin classification")

      validators.checkNoVariantsWithComputedProperties(nextWorkspace)
      log("✅ No variants with computed properties referencing parent nodes")

      shouldLogVerification && console.groupEnd()
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
  if (!isWorkspaceLoggingEnabled()) return
  console.log(`🐶 verificationMiddleware · ${String(message)}`)
}

const logError = (message: any, error: Error) => {
  if (!isWorkspaceLoggingEnabled()) return
  console.log(`🐶 verificationMiddleware · ${String(message)}`, {
    error: error.message,
  })
}
