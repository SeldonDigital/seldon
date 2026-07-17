import { isComponentId } from "../../../components/constants"
import { isComputedValue } from "../../../helpers/type-guards/value/is-computed-value"
import { ComputedFunction } from "../../../properties"
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
  isAuthoredBoard,
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

/**
 * Reports whether a variant override depends on an ancestor node. AUTO_FIT scales from an ancestor
 * `buttonSize`/`size`, so it cannot resolve standalone in a variant. HIGH_CONTRAST and MATCH_COLOR
 * read self first, so they are not flagged.
 */
function overrideReferencesParentNode(property: unknown): boolean {
  return (
    isComputedValue(property) && property.value === ComputedFunction.AUTO_FIT
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
        check(nodes[ref.id], ErrorMessages.variantNotFound(ref.id))
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
        isFontCollectionBoard(board) ||
        isAuthoredBoard(board)
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
   * Validates authored board roots. An authored board has exactly one `authored`
   * root at `variants[0]`, and an `authored` node never appears as a variant
   * root of a component or playground board. Authored components reused inside
   * other boards appear as `instance` nodes, so this stays a root-level check.
   */
  authoredRootsAreValid: (workspace: Workspace) => {
    const nodes = getWorkspaceNodes(workspace)

    for (const board of Object.values(workspace.boards)) {
      if (!isAuthoredBoard(board)) continue
      check(
        board.variants.length > 0,
        "Authored board is missing its authored root.",
      )
      const rootId = board.variants[0]?.id
      const rootNode = rootId ? nodes[rootId] : undefined
      check(
        Boolean(rootNode) && rootNode!.type === "authored",
        `Authored board root ${rootId} must be an authored node.`,
      )
      for (let index = 1; index < board.variants.length; index++) {
        const variant = nodes[board.variants[index]!.id]
        check(
          !variant || variant.type !== "authored",
          `Authored board ${rootId} has more than one authored root.`,
        )
      }
    }

    for (const board of getCompositionContainers(workspace)) {
      if (isAuthoredBoard(board) || isResourceType(board)) continue
      for (const ref of board.variants) {
        const variant = nodes[ref.id]
        check(
          !variant || variant.type !== "authored",
          `Authored node ${ref.id} may only be an authored board root.`,
        )
      }
    }
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
/** Payload keys worth surfacing in the verification header, in priority order. */
const ACTION_HINT_KEYS = [
  "nodeId",
  "boardKey",
  "instanceId",
  "variantId",
  "themeId",
  "playgroundKey",
]

/** Short, single-line description of an action for the verification log header. */
function describeAction(action: { type: string; payload?: unknown }): string {
  const hints: string[] = []
  const payload = action.payload
  if (payload && typeof payload === "object") {
    const bag = payload as Record<string, unknown>
    for (const key of ACTION_HINT_KEYS) {
      const value = bag[key]
      if (typeof value === "string") hints.push(`${key}=${value}`)
    }
    const target = bag.target
    if (target && typeof target === "object") {
      const parentId = (target as Record<string, unknown>).parentId
      if (typeof parentId === "string") hints.push(`parentId=${parentId}`)
    }
  }
  return hints.length > 0 ? `${action.type} (${hints.join(", ")})` : action.type
}

/** One-line shape summary of a workspace for orientation in the log. */
function summarizeWorkspace(workspace: Workspace): string {
  const boards = Object.keys(workspace.boards ?? {}).length
  const nodes = Object.keys(workspace.nodes ?? {}).length
  const themes = Object.keys(workspace.themes ?? {}).length
  return `📦 ${boards} boards, ${nodes} nodes, ${themes} themes`
}

/** True when the action produced an effective change to the workspace. */
function workspaceChanged(before: Workspace, after: Workspace): boolean {
  if (before === after) return false
  return JSON.stringify(before) !== JSON.stringify(after)
}

/** Ordered integrity checks. Each throws on failure. */
const VERIFICATION_CHECKS: Array<[string, (workspace: Workspace) => void]> = [
  ["No cyclic component trees", (w) => validators.noCyclicTrees(w)],
  ["All children exist", (w) => validators.allChildrenExist(w)],
  ["All variants exist", (w) => validators.allVariantsExist(w)],
  [
    "All node template targets exist",
    (w) => validators.allNodeTemplateTargetsExist(w),
  ],
  [
    "One default variant per board",
    (w) => validators.oneDefaultVariantPerBoard(w),
  ],
  [
    "Authored board roots are valid",
    (w) => validators.authoredRootsAreValid(w),
  ],
  ["All node map IDs are unique", (w) => validators.uniqueIds(w)],
  ["No dangling variants", (w) => validators.noDanglingVariants(w)],
  ["No dangling child nodes", (w) => validators.noDanglingChildNodes(w)],
  [
    "All instances have an origin classification",
    (w) => validators.instancesHaveOrigin(w),
  ],
  [
    "No variants with computed properties referencing parent nodes",
    (w) => validators.checkNoVariantsWithComputedProperties(w),
  ],
  [
    "Interaction states resolve to reserved or registered custom states",
    (w) => validators.statesAreConsistent(w),
  ],
  [
    "Sandboxes are explicitly sized, capped, and non-overlapping",
    (w) => validators.sandboxesAreValid(w),
  ],
]

/**
 * Middleware that verifies workspace integrity after every action.
 * Runs comprehensive validation checks and logs results in development.
 */
export const workspaceVerificationMiddleware: Middleware =
  (next) => (workspace, action) => {
    const nextWorkspace = next(workspace, action)
    const shouldLog =
      process.env.NODE_ENV === "development" && isWorkspaceLoggingEnabled()
    const startedAt = shouldLog ? performance.now() : 0

    let currentCheck = ""
    try {
      for (const [name, run] of VERIFICATION_CHECKS) {
        currentCheck = name
        run(nextWorkspace)
      }
    } catch (error) {
      if (error instanceof Error) {
        const actionString = JSON.stringify(action, null, 2)
        logError(
          `Check "${currentCheck}" failed for ${describeAction(action)}. The following action caused an error:\n\n${actionString}`,
          error,
        )
        throw new WorkspaceValidationError(error.message, action)
      }
      throw error
    }

    if (shouldLog) {
      const durationMs = (performance.now() - startedAt).toFixed(1)
      const changed = workspaceChanged(workspace, nextWorkspace)
      console.groupCollapsed(
        ...coreTag(
          `🔍 Verifying workspace · ${describeAction(action)}${changed ? "" : " · ⚠️ no change"}`,
        ),
      )
      log(
        `✅ ${VERIFICATION_CHECKS.length}/${VERIFICATION_CHECKS.length} checks passed (${durationMs}ms)`,
      )
      log(summarizeWorkspace(nextWorkspace))
      for (const [name] of VERIFICATION_CHECKS) {
        log(`✅ ${name}`)
      }
      console.groupEnd()
    }

    return nextWorkspace
  }

/** Blue `[seldon/core]` prefix, mirroring the purple `[seldon/ai]` chat logs. */
const CORE_LOG_STYLE = "color:#3b82f6;font-weight:bold"

/** Builds console args for a styled, tagged core log line. */
function coreTag(message: string): [string, string, string] {
  return [`%c[seldon/core]%c ${message}`, CORE_LOG_STYLE, ""]
}

const log = (message: string) => {
  if (!isWorkspaceLoggingEnabled()) return
  console.log(...coreTag(message))
}

const logError = (message: string, error: Error) => {
  if (!isWorkspaceLoggingEnabled()) return
  console.log(...coreTag(message), { error: error.message })
}
