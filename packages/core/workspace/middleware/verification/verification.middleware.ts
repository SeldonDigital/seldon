import { isComponentId } from "../../../components/constants"
import { ValueType } from "../../../properties"
import { isWorkspaceLoggingEnabled } from "../../../utils/debug-logger"
import { ErrorMessages } from "../../constants"
import { findBoardTreeCycleId } from "../../helpers/components/find-tree-cycle"
import { getBoardKey } from "../../helpers/components/get-board-keys"
import { isResourceType } from "../../helpers/components/is-resource-type"
import { walkBoardTreeRefs } from "../../helpers/components/walk-board-tree-refs"
import { getCompositionContainers } from "../../helpers/general/get-composition-containers"
import { getWorkspaceNodes } from "../../helpers/general/get-workspace-nodes"
import { isVariantNode } from "../../helpers/nodes/is-variant-node"
import {
  SANDBOX_MAX_MAGNITUDE,
  type SandboxRect,
  isExplicitSizeValue,
  isSandboxNode,
  resolveSandboxRect,
  sandboxesOverlap,
} from "../../helpers/nodes/sandbox"
import { isEntryNodeForRules } from "../../helpers/rules/rules-node-subject"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isThemeBoard,
} from "../../model/components"
import { isReservedStateName } from "../../model/node-state"
import { parseNodeLink } from "../../model/template-ref"
import { typeCheckingService } from "../../services"
import { Middleware, Workspace } from "../../types"
import { check } from "../validation/check"
import { WorkspaceValidationError } from "../validation/workspace-validation-error"

function collectBoardTreeNodeIds(workspace: Workspace): Set<string> {
  const ids = new Set<string>()
  for (const board of getCompositionContainers(workspace)) {
    walkBoardTreeRefs(board.variants, (ref) => {
      ids.add(ref.id)
    })
  }
  return ids
}

/** Reports whether a variant override computes from a `#parent` reference. */
function overrideReferencesParentNode(property: unknown): boolean {
  return (
    !!property &&
    typeof property === "object" &&
    "type" in property &&
    property.type === ValueType.COMPUTED &&
    "value" in property &&
    !!property.value &&
    typeof property.value === "object" &&
    "input" in property.value &&
    !!property.value.input &&
    typeof (property.value.input as { basedOn?: string }).basedOn ===
      "string" &&
    (property.value.input as { basedOn: string }).basedOn.startsWith("#parent")
  )
}

const validators = {
  /**
   * Validates that no board variant tree contains a cycle. Runs before the
   * recursive tree walkers so a cyclic tree fails with a clear message instead
   * of overflowing the call stack.
   */
  noCyclicTrees: (workspace: Workspace) => {
    const cycleId = findBoardTreeCycleId(workspace)
    if (cycleId) {
      throw new Error(ErrorMessages.cyclicComponentTree(cycleId))
    }
  },
  /** Validates that every child ref in board trees points at a node row. */
  allChildrenExist: (workspace: Workspace) => {
    const nodes = getWorkspaceNodes(workspace)
    for (const board of getCompositionContainers(workspace)) {
      // Resource boards (theme, icon-set, media) reference their own maps, not nodes.
      if (isResourceType(board)) {
        continue
      }
      walkBoardTreeRefs(board.variants, (ref) => {
        for (const child of ref.children ?? []) {
          check(nodes[child.id], ErrorMessages.nodeNotFound(child.id))
        }
      })
    }
  },
  /** Validates that every tree ref id maps to a node row. */
  allVariantsExist: (workspace: Workspace) => {
    const nodes = getWorkspaceNodes(workspace)
    for (const board of getCompositionContainers(workspace)) {
      // Resource boards (theme, icon-set, media) reference their own maps, not nodes.
      if (isResourceType(board)) {
        continue
      }
      walkBoardTreeRefs(board.variants, (ref) => {
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
    const ids = Object.values(getWorkspaceNodes(workspace)).map(
      (node) => node.id,
    )
    const uniqueIds = new Set(ids)

    if (ids.length !== uniqueIds.size) {
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
      throw new Error(ErrorMessages.duplicateIds(duplicateIds))
    }
  },
  /** Validates that each variant node appears in some board tree. */
  noDanglingVariants: (workspace: Workspace) => {
    const treeIds = collectBoardTreeNodeIds(workspace)
    Object.values(getWorkspaceNodes(workspace))
      .filter(isVariantNode)
      .forEach((variant) => {
        check(
          treeIds.has(variant.id),
          ErrorMessages.danglingVariant(variant.id),
        )
      })
  },
  /** Validates that each instance node appears in some board tree. */
  noDanglingChildNodes: (workspace: Workspace) => {
    const treeIds = collectBoardTreeNodeIds(workspace)
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
          if (overrideReferencesParentNode(property)) {
            throw new Error(
              ErrorMessages.variantRefersToParent(variant.id, key),
            )
          }
        })
      })
  },

  /** Validates that each component board has exactly one default variant root. */
  oneDefaultVariantPerBoard: (workspace: Workspace) => {
    const nodes = getWorkspaceNodes(workspace)
    Object.values(workspace.boards).forEach((board) => {
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

      const boardKey =
        getBoardKey(workspace, board) ??
        ("catalogId" in board ? board.catalogId : "")

      if (defaultVariants.length > 1) {
        throw new Error(
          isComponentId(boardKey)
            ? ErrorMessages.tooManyDefaultVariants(boardKey)
            : `Board ${boardKey} has more than one default variant.`,
        )
      }

      if (defaultVariants.length === 0) {
        throw new Error(
          isComponentId(boardKey)
            ? ErrorMessages.defaultVariantNotFound(boardKey)
            : `Default variant not found for board ${boardKey}.`,
        )
      }
    })
  },

  /**
   * Validates interaction-state integrity: the custom-state registry holds no
   * reserved names and no duplicate keys, and every node state key resolves to a
   * reserved name or a registered custom state.
   */
  statesAreConsistent: (workspace: Workspace) => {
    const customStates = workspace.metadata.customStates ?? []
    const seen = new Set<string>()
    for (const entry of customStates) {
      check(
        !isReservedStateName(entry.key),
        `Custom state "${entry.key}" collides with a reserved interaction-state name.`,
      )
      check(!seen.has(entry.key), `Duplicate custom state key "${entry.key}".`)
      seen.add(entry.key)
    }

    const knownStates = new Set<string>(seen)
    for (const node of Object.values(getWorkspaceNodes(workspace))) {
      if (!node.states) continue
      for (const stateKey of Object.keys(node.states)) {
        check(
          isReservedStateName(stateKey) || knownStates.has(stateKey),
          `Node ${node.id} references unknown interaction state "${stateKey}".`,
        )
      }
    }
  },

  /**
   * Validates each playground's Sandbox roots: width/height overrides must be
   * explicit lengths, position and size stay within the safety cap, and no two
   * sandboxes in the same playground overlap.
   */
  sandboxesAreValid: (workspace: Workspace) => {
    const nodes = getWorkspaceNodes(workspace)
    for (const [key, playground] of Object.entries(
      workspace.playgrounds ?? {},
    )) {
      const placed: Array<{ id: string; rect: SandboxRect }> = []
      for (const ref of playground.variants) {
        const node = nodes[ref.id]
        if (!node || !isSandboxNode(node)) continue

        const overrides = node.overrides as Record<string, unknown>
        for (const sizeKey of ["width", "height"] as const) {
          if (
            sizeKey in overrides &&
            !isExplicitSizeValue(overrides[sizeKey])
          ) {
            throw new Error(
              `Sandbox ${ref.id} in playground ${key} must use an explicit ${sizeKey} (no Fit, Fill, or theme size).`,
            )
          }
        }

        const rect = resolveSandboxRect(node)
        if (!rect) continue

        if (
          Math.abs(rect.top) > SANDBOX_MAX_MAGNITUDE ||
          Math.abs(rect.left) > SANDBOX_MAX_MAGNITUDE ||
          rect.width > SANDBOX_MAX_MAGNITUDE ||
          rect.height > SANDBOX_MAX_MAGNITUDE
        ) {
          throw new Error(
            `Sandbox ${ref.id} in playground ${key} exceeds the ${SANDBOX_MAX_MAGNITUDE}px position and size cap.`,
          )
        }

        for (const other of placed) {
          if (sandboxesOverlap(rect, other.rect)) {
            throw new Error(
              `Sandboxes ${other.id} and ${ref.id} overlap in playground ${key}.`,
            )
          }
        }
        placed.push({ id: ref.id, rect })
      }
    }
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
      if (shouldLogVerification)
        console.groupCollapsed("🔍 Verifying workspace")

      validators.noCyclicTrees(nextWorkspace)
      log("✅ No cyclic component trees")

      validators.allChildrenExist(nextWorkspace)
      log("✅ All children exist")

      validators.allVariantsExist(nextWorkspace)
      log("✅ All variants exist")

      validators.allNodeTemplateTargetsExist(nextWorkspace)
      log("✅ All node template targets exist")

      validators.oneDefaultVariantPerBoard(nextWorkspace)
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

      validators.statesAreConsistent(nextWorkspace)
      log(
        "✅ Interaction states resolve to reserved or registered custom states",
      )

      validators.sandboxesAreValid(nextWorkspace)
      log("✅ Sandboxes are explicitly sized, capped, and non-overlapping")

      if (shouldLogVerification) console.groupEnd()
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

const log = (message: string) => {
  if (!isWorkspaceLoggingEnabled()) return
  console.log(`🐶 verificationMiddleware · ${message}`)
}

const logError = (message: string, error: Error) => {
  if (!isWorkspaceLoggingEnabled()) return
  console.log(`🐶 verificationMiddleware · ${message}`, {
    error: error.message,
  })
}
