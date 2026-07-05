import type { ComponentId } from "../../../../components/constants"
import { isMatchColorValue } from "../../../../helpers/type-guards/value/is-computed-value"
import {
  COLOR_SIBLING_COMPOUND_KEYS,
  COLOR_SIBLING_KEYS,
  COLOR_SIBLING_LAYER_KEYS,
  ValueType,
} from "../../../../properties"
import { mergeProperties } from "../../../../properties/helpers/merge-properties"
import { rules } from "../../../../rules/config/rules.config"
import { getComputedTheme } from "../../../compute"
import { DEFAULT_THEME_ID, ErrorMessages } from "../../../constants"
import { getBoardVariantRootIds } from "../../../helpers/components/get-board-variant-root-ids"
import { collectExternalVariantUsage } from "../../../helpers/general/collect-external-variant-usage"
import { isUserVariant } from "../../../helpers/general/is-user-variant"
import { findBoardContainingTreeNodeId } from "../../../helpers/nodes/duplicate-entry-variant-subtree"
import {
  MAX_REPEAT_COUNT,
  MAX_REPEAT_EXPANSION,
  getNodeRepeat,
} from "../../../helpers/nodes/node-repeat"
import {
  SANDBOX_MAX_MAGNITUDE,
  findPlaygroundKeyForSandbox,
  getPlaygroundSandboxIds,
  isExplicitSizeValue,
  isSandboxNode,
  resolveSandboxRect,
  sandboxesOverlap,
} from "../../../helpers/nodes/sandbox"
import { getEffectiveProperties } from "../../../helpers/properties"
import { hasEffectiveThemeReference } from "../../../helpers/removal/effective-theme-references"
import { isComponentBoard, isPlaygroundBoard } from "../../../model/components"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import {
  nodeRelationshipService,
  nodeRetrievalService,
  nodeTraversalService,
  typeCheckingService,
  workspaceMutationService,
} from "../../../services"
import type {
  Action,
  EntryNode,
  InstanceId,
  VariantId,
  Workspace,
} from "../../../types"
import { check } from "../check"
import { getNodeComponentId } from "../node-component-id"
import {
  assertInsertTargetAllowed,
  assertMoveTargetAllowed,
  boardValidators,
  nodeValidators,
  propertyValidators,
  themeEntryValidators,
  themeValidators,
  variantValidators,
} from "../validators"
import { WorkspaceValidationError } from "../workspace-validation-error"

export function validateInsertMutation(
  workspace: Workspace,
  action: Action,
): void {
  switch (action.type) {
    case "add_component_and_insert_default_instance": {
      const boardKey = action.payload.boardKey
      const parentId = action.payload.target.parentId as InstanceId | VariantId
      boardValidators.doesNotExist(workspace, boardKey)
      nodeValidators.exists(workspace, parentId)
      nodeValidators.canHaveChildren(workspace, parentId)
      nodeValidators.isNotInstanceOfSelf(
        workspace,
        boardKey as ComponentId,
        parentId,
      )
      const parent = nodeRetrievalService.getNode(parentId, workspace)
      assertInsertTargetAllowed(parent, action)
      break
    }
    case "insert_variant_instance": {
      const nodeId = action.payload.variantId as VariantId
      const parentId = action.payload.target.parentId as InstanceId | VariantId
      validateInsertSource(workspace, action, nodeId, parentId, "variant")
      break
    }
    case "insert_duplicate_instance": {
      const nodeId = action.payload.instanceId as InstanceId
      const parentId = action.payload.target.parentId as InstanceId | VariantId
      validateInsertSource(workspace, action, nodeId, parentId, "instance")
      break
    }
    case "insert_default_instance": {
      const parentId = action.payload.parentId as InstanceId | VariantId
      const boardKey = action.payload.boardKey
      nodeValidators.exists(workspace, parentId)
      nodeValidators.canHaveChildren(workspace, parentId)
      boardValidators.exists(workspace, boardKey)
      const defaultVariant = nodeRetrievalService.getDefaultVariant(
        boardKey as ComponentId,
        workspace,
      )
      nodeValidators.isNotInstanceOfSelf(workspace, defaultVariant.id, parentId)
      nodeValidators.canBeParentOf(workspace, parentId, defaultVariant.id)
      const parent = nodeRetrievalService.getNode(parentId, workspace)
      assertInsertTargetAllowed(parent, action)
      break
    }
    case "move_instance": {
      const instanceId = action.payload.instanceId as InstanceId
      const parentId = action.payload.target.parentId as InstanceId | VariantId
      nodeValidators.exists(workspace, instanceId)
      nodeValidators.exists(workspace, parentId)
      const instance = nodeRetrievalService.getNode(instanceId, workspace)
      const parent = nodeRetrievalService.getNode(parentId, workspace)
      if (!typeCheckingService.isInstance(instance)) {
        throw new WorkspaceValidationError(
          ErrorMessages.nodeNotInstance(instanceId),
          action,
        )
      }
      assertMoveTargetAllowed(
        parent,
        "Cannot move an instance into a default catalog variant",
      )
      assertNodeNotInDefaultVariant(
        workspace,
        instance,
        "Cannot move instances in a default variant. Only property overrides allowed. To restructure components, make a custom variant and make changes on it.",
      )
      nodeValidators.canHaveChildren(workspace, parentId)
      nodeValidators.isNotInstanceOfSelf(workspace, instanceId, parentId)
      nodeValidators.notIntoOwnSubtree(workspace, instanceId, parentId)
      nodeValidators.isWithinSameVariant(workspace, instanceId, parentId)
      nodeValidators.canBeParentOf(workspace, parentId, instanceId)
      break
    }
  }
}

function validateInsertSource(
  workspace: Workspace,
  action: Action,
  sourceId: VariantId | InstanceId,
  parentId: InstanceId | VariantId,
  expected: "variant" | "instance",
): void {
  nodeValidators.exists(workspace, sourceId)
  nodeValidators.exists(workspace, parentId)
  nodeValidators.canHaveChildren(workspace, parentId)
  nodeValidators.isNotInstanceOfSelf(workspace, sourceId, parentId)
  // Inserting a node into its own subtree would make propagation re-apply the
  // insert into every copy it just created, recursing until the stack overflows.
  nodeValidators.notIntoOwnSubtree(workspace, sourceId, parentId)
  nodeValidators.canBeParentOf(workspace, parentId, sourceId)
  const sourceNode = nodeRetrievalService.getNode(sourceId, workspace)
  if (expected === "variant") {
    check(
      typeCheckingService.isVariant(sourceNode),
      "insert_variant_instance source must be a variant",
    )
  } else {
    check(
      typeCheckingService.isInstance(sourceNode),
      "insert_duplicate_instance source must be an instance",
    )
  }
  const parent = nodeRetrievalService.getNode(parentId, workspace)
  assertInsertTargetAllowed(parent, action)
}

export function validateNodeMutation(
  workspace: Workspace,
  action: Action,
): void {
  switch (action.type) {
    case "reorder_instance_in_parent": {
      const nodeId = action.payload.instanceId as InstanceId
      const node = getInstanceNodeOrThrow(workspace, action, nodeId)
      assertNodeNotInDefaultVariant(
        workspace,
        node,
        "Cannot reorder instances in a default variant. Only property overrides allowed. To reorder components, make a custom variant and make changes on it.",
      )
      nodeValidators.moveAllowed(workspace, nodeId)
      variantValidators.notToDefaultPosition(
        workspace,
        nodeId,
        action.payload.newIndex,
      )
      break
    }
    case "move_instance_directional": {
      // The resolver only returns a placement allowed by the level rules, so the
      // remaining guards are that the subject is a real instance outside any
      // default variant. A null resolution is a no-op handled by the reducer.
      const nodeId = action.payload.instanceId as InstanceId
      const node = getInstanceNodeOrThrow(workspace, action, nodeId)
      assertNodeNotInDefaultVariant(
        workspace,
        node,
        "Cannot move instances in a default variant. Only property overrides allowed. To restructure components, make a custom variant and make changes on it.",
      )
      break
    }
    case "remove_instance": {
      // Removal inside the default variant is allowed; the reducer resolves
      // it to a hide (display EXCLUDE) for schema-defined instances instead
      // of a structural delete.
      const nodeId = action.payload.instanceId as InstanceId
      nodeValidators.canBeRemoved(workspace, nodeId)
      getInstanceNodeOrThrow(workspace, action, nodeId)
      break
    }
    case "remove_variant": {
      const nodeId = action.payload.variantRootId as VariantId
      nodeValidators.canBeRemoved(workspace, nodeId)
      nodeValidators.exists(workspace, nodeId)
      const node = nodeRetrievalService.getNode(nodeId, workspace)
      check(
        typeCheckingService.isVariant(node),
        "remove_variant target must be a variant",
      )
      check(
        !typeCheckingService.isDefaultVariant(node),
        "Cannot remove a default catalog variant",
      )
      break
    }
    case "set_node_properties": {
      const nodeId = action.payload.nodeId as InstanceId | VariantId
      nodeValidators.exists(workspace, nodeId)
      const node = nodeRetrievalService.getNode(nodeId, workspace)
      // Use the node's effective theme (its own assignment first, then inherited)
      // so token refs validate against the theme that actually renders the node.
      const themeId = workspaceMutationService.getNodeTheme(node, workspace)
      propertyValidators.keys(
        action.payload.properties,
        getNodeComponentId(node, workspace),
      )
      propertyValidators.values(action.payload.properties, workspace, themeId)
      assertMatchColorSiblingsLocked(
        workspace,
        nodeId,
        themeId,
        action.payload.properties as Record<string, unknown>,
      )
      if (isSandboxNode(node)) {
        assertSandboxConstraints(workspace, action, node as EntryNode, nodeId)
      }
      break
    }
    case "reset_node_property": {
      const nodeId = action.payload.nodeId as InstanceId | VariantId
      nodeValidators.exists(workspace, nodeId)
      const node = nodeRetrievalService.getNode(nodeId, workspace)
      propertyValidators.keys(
        {
          [action.payload.propertyKey]: {
            type: ValueType.EMPTY,
            value: null,
          },
        },
        getNodeComponentId(node, workspace),
      )
      break
    }
    case "set_node_theme": {
      const nodeId = action.payload.nodeId as InstanceId | VariantId
      nodeValidators.exists(workspace, nodeId)
      themeValidators.exists(workspace, action.payload.theme)
      break
    }
    case "set_node_label": {
      const nodeId = action.payload.nodeId as InstanceId | VariantId
      nodeValidators.exists(workspace, nodeId)
      variantValidators.labelIsUnique(workspace, {
        nodeId,
        label: action.payload.label,
      })
      break
    }
    case "set_node_ref": {
      const nodeId = action.payload.nodeId as InstanceId | VariantId
      nodeValidators.exists(workspace, nodeId)
      nodeValidators.refIsUnique(workspace, {
        nodeId,
        ref: action.payload.ref,
      })
      break
    }
    case "set_node_editor_data":
    case "reset_node_label":
    case "reset_node_editor_data":
    case "reset_node":
      nodeValidators.exists(workspace, action.payload.nodeId)
      break
    case "set_node_repeat": {
      const nodeId = action.payload.nodeId as InstanceId | VariantId
      nodeValidators.exists(workspace, nodeId)
      assertRepeatConstraints(workspace, action, nodeId)
      break
    }
    case "reset_variant_to_catalog": {
      const variantRootId = action.payload.variantRootId as VariantId
      nodeValidators.exists(workspace, variantRootId)
      const node = nodeRetrievalService.getNode(variantRootId, workspace)
      check(
        isUserVariant(node),
        "Only a user variant can reset to its catalog schema variant",
      )
      const index = locateResettableBoardVariantIndex(workspace, variantRootId)
      check(index > 0, "The catalog default variant does not use this action")
      break
    }
    case "reset_variant_instances": {
      const variantRootId = action.payload.variantRootId as VariantId
      nodeValidators.exists(workspace, variantRootId)
      const node = nodeRetrievalService.getNode(variantRootId, workspace)
      check(isUserVariant(node), "Only a user variant can reset its instances")
      break
    }
    case "reset_instance_to_source":
    case "reset_instance_to_original": {
      const instanceId = action.payload.instanceId as InstanceId
      nodeValidators.exists(workspace, instanceId)
      const node = nodeRetrievalService.getNode(instanceId, workspace)
      check(
        typeCheckingService.isInstance(node),
        "Only an instance can reset to its source or original",
      )
      break
    }
    case "reset_default_variant_to_catalog": {
      const rootId = action.payload.defaultVariantRootId as VariantId
      nodeValidators.exists(workspace, rootId)
      const node = nodeRetrievalService.getNode(rootId, workspace)
      check(
        typeCheckingService.isDefaultVariant(node),
        "Only a default catalog variant can reset to catalog",
      )
      const index = locateResettableBoardVariantIndex(workspace, rootId)
      check(index === 0, "Reset to catalog only runs on the default variant")
      break
    }
  }
}

export function validateResetComponentToCatalog(
  workspace: Workspace,
  action: Extract<Action, { type: "reset_component_to_catalog" }>,
): void {
  boardValidators.exists(workspace, action.payload.boardKey)
  const usages = collectExternalVariantUsage(action.payload.boardKey, workspace)
  if (usages.length > 0) {
    throw new WorkspaceValidationError(
      ErrorMessages.variantsInUseForReset(usages),
      action,
    )
  }
}

export function validateAddVariant(
  workspace: Workspace,
  action: Extract<Action, { type: "add_variant" }>,
): void {
  boardValidators.exists(workspace, action.payload.boardKey)
  const board = workspace.boards[action.payload.boardKey]
  check(
    board && (isComponentBoard(board) || isPlaygroundBoard(board)),
    "add_variant requires a component or playground board",
  )
}

export function validateDuplicateNode(
  workspace: Workspace,
  action: Extract<Action, { type: "duplicate_node" }>,
): void {
  nodeValidators.exists(workspace, action.payload.nodeId)
  const node = nodeRetrievalService.getNode(action.payload.nodeId, workspace)
  const entity = typeCheckingService.getEntityType(node)
  check(
    rules.mutations.duplicate[entity].allowed,
    `Cannot duplicate node of entity type ${entity}`,
  )
  if (typeCheckingService.isInstance(node)) {
    const parent = nodeTraversalService.findParentNode(node, workspace)
    check(
      !parent || !typeCheckingService.isDefaultVariant(parent),
      "Cannot duplicate an instance in a default catalog variant",
    )
  }
}

export function validateReorderBoard(
  workspace: Workspace,
  action: Extract<Action, { type: "reorder_board" }>,
): void {
  boardValidators.exists(workspace, action.payload.boardKey)
}

export function validateReorderVariantInBoard(
  workspace: Workspace,
  action: Extract<Action, { type: "reorder_variant_in_board" }>,
): void {
  boardValidators.exists(workspace, action.payload.boardKey)
  const board = workspace.boards[action.payload.boardKey]
  check(Boolean(board), "Board missing after exists check")
  const roots = getBoardVariantRootIds(board!)
  const oldIndex = roots.indexOf(action.payload.variantRootId)
  check(oldIndex >= 0, "Variant is not in the board variant list")
  // Index 0 is the default variant slot: a move may only touch it as a no-op.
  check(
    (oldIndex === 0) === (action.payload.newIndex === 0),
    "Cannot move the default variant from index 0",
  )
}

export function validateThemeMutation(
  workspace: Workspace,
  action: Action,
): void {
  switch (action.type) {
    case "reset_theme_tokens":
    case "reset_theme_label":
    case "reset_theme_editor_data":
    case "reset_theme_override":
    case "set_theme_label":
    case "set_theme_editor_data":
      themeEntryValidators.exists(workspace, themeIdOf(action))
      break
    case "set_theme_override":
      themeEntryValidators.exists(workspace, themeIdOf(action))
      assertThemeOverridePathValid(action)
      break
    case "delete_theme":
      themeEntryValidators.exists(workspace, action.payload.themeId)
      assertThemeDeletable(workspace, action.payload.themeId, action)
      break
    case "duplicate_theme":
      themeEntryValidators.exists(workspace, action.payload.themeId)
      break
  }
}

function themeIdOf(action: Action): string {
  return (action.payload as { themeId: string }).themeId
}

/**
 * Rejects a `set_theme_override` whose path is empty or not a string. The theme
 * override tree accepts authoring roots such as `color` and `core` that are not
 * literal keys on a materialized theme, so this guard stays at the structural
 * level and does not restrict the section.
 */
function assertThemeOverridePathValid(action: Action): void {
  const path = (action.payload as { path?: unknown }).path
  if (typeof path !== "string" || path.length === 0) {
    throw new WorkspaceValidationError(
      "Theme override path must be a non-empty string",
      action,
    )
  }
}

/** Loads an instance node, throwing when the id is missing or not an instance. */
function getInstanceNodeOrThrow(
  workspace: Workspace,
  action: Action,
  instanceId: InstanceId,
) {
  nodeValidators.exists(workspace, instanceId)
  const node = nodeRetrievalService.getNode(instanceId, workspace)
  if (!typeCheckingService.isInstance(node)) {
    throw new WorkspaceValidationError(
      ErrorMessages.nodeNotInstance(instanceId),
      action,
    )
  }
  return node
}

/**
 * Enforces the editor-only repeat preview cap: a whole count within
 * 1..{@link MAX_REPEAT_COUNT}, and a nested-expansion ceiling so a repeat set
 * inside other repeats does not multiply into an unmanageable number of echoes.
 */
function assertRepeatConstraints(
  workspace: Workspace,
  action: Extract<Action, { type: "set_node_repeat" }>,
  nodeId: InstanceId | VariantId,
): void {
  const repeat = action.payload.repeat
  if (!repeat) return

  // A data-only override omits count and inherits it from the template, so there
  // is no count constraint to enforce on this write.
  const count = repeat.count
  if (count == null) return

  if (!Number.isInteger(count) || count < 1) {
    throw new WorkspaceValidationError(
      "Repeat count must be a whole number of at least 1.",
      action,
    )
  }
  if (count > MAX_REPEAT_COUNT) {
    throw new WorkspaceValidationError(
      `Repeat count cannot exceed ${MAX_REPEAT_COUNT}.`,
      action,
    )
  }

  let expansion = count
  let ancestor = nodeTraversalService.findParentNode(nodeId, workspace)
  while (ancestor) {
    const ancestorRepeat = getNodeRepeat(ancestor)
    if (ancestorRepeat?.count != null && ancestorRepeat.count > 1) {
      expansion *= ancestorRepeat.count
    }
    ancestor = nodeTraversalService.findParentNode(ancestor, workspace)
  }

  if (expansion > MAX_REPEAT_EXPANSION) {
    throw new WorkspaceValidationError(
      `Nested repeats would render ${expansion} copies, above the ${MAX_REPEAT_EXPANSION} limit. Lower a repeat count.`,
      action,
    )
  }
}

/**
 * Enforces the sandbox geometry rules on a `set_node_properties` payload:
 * explicit-only width/height, the position/size safety cap, and no overlap with
 * a sibling sandbox in the same playground.
 */
function assertSandboxConstraints(
  workspace: Workspace,
  action: Extract<Action, { type: "set_node_properties" }>,
  node: EntryNode,
  nodeId: InstanceId | VariantId,
): void {
  const props = action.payload.properties as Record<string, unknown>

  for (const key of ["width", "height"] as const) {
    if (key in props && !isExplicitSizeValue(props[key])) {
      throw new WorkspaceValidationError(
        "Sandbox width and height must be an explicit size. Fit, Fill, and theme sizes are not allowed on a sandbox.",
        action,
      )
    }
  }

  // Mirror the reducer's merge so a partial facet patch (e.g. only
  // `position.left`) layers over the stored overrides instead of replacing the
  // whole compound. A shallow spread would drop the stored `position.top` and
  // resolve the rect against the schema default, causing a false overlap.
  const merged: EntryNode = {
    ...node,
    overrides: mergeProperties(
      node.overrides,
      action.payload.properties,
      action.payload.options,
    ),
  }
  const rect = resolveSandboxRect(merged)
  if (!rect) return

  if (
    Math.abs(rect.top) > SANDBOX_MAX_MAGNITUDE ||
    Math.abs(rect.left) > SANDBOX_MAX_MAGNITUDE ||
    rect.width > SANDBOX_MAX_MAGNITUDE ||
    rect.height > SANDBOX_MAX_MAGNITUDE
  ) {
    throw new WorkspaceValidationError(
      `Sandbox position and size must stay within ${SANDBOX_MAX_MAGNITUDE}px.`,
      action,
    )
  }

  const playgroundKey = findPlaygroundKeyForSandbox(workspace, nodeId)
  if (!playgroundKey) return
  for (const siblingId of getPlaygroundSandboxIds(workspace, playgroundKey)) {
    if (siblingId === nodeId) continue
    const sibling = workspace.nodes[siblingId]
    if (!sibling) continue
    if (sandboxesOverlap(rect, resolveSandboxRect(sibling))) {
      throw new WorkspaceValidationError(
        "Sandboxes cannot overlap. Adjust the position or size so this sandbox does not cover another.",
        action,
      )
    }
  }
}

/** Rejects mutating an instance anywhere inside a default catalog variant tree. */
function assertNodeNotInDefaultVariant(
  workspace: Workspace,
  node: ReturnType<typeof nodeRetrievalService.getNode>,
  message: string,
): void {
  const root = nodeRelationshipService.getRootVariant(node, workspace)
  check(!typeCheckingService.isDefaultVariant(root), message)
}

/**
 * Finds the position of a variant root within its board, requiring the board to
 * be a component or playground board that supports variant resets.
 */
function locateResettableBoardVariantIndex(
  workspace: Workspace,
  variantRootId: VariantId,
): number {
  const located = findBoardContainingTreeNodeId(workspace, variantRootId)
  check(
    located &&
      (isComponentBoard(located.board) || isPlaygroundBoard(located.board)),
    "That reset only runs on component or playground boards",
  )
  return located!.board.variants.findIndex((ref) => ref.id === variantRootId)
}

/** Rejects deleting a default theme entry or one still referenced as an effective theme. */
function assertThemeDeletable(
  workspace: Workspace,
  themeId: string,
  action: Action,
): void {
  const entry = workspace.themes[themeId]
  if (entry && isEntryThemeDefault(entry)) {
    throw new WorkspaceValidationError(
      "Cannot remove default theme entry",
      action,
    )
  }
  if (hasEffectiveThemeReference(workspace, themeId)) {
    throw new WorkspaceValidationError(
      `Theme ${themeId} is still in use (effective theme)`,
      action,
    )
  }
}

/**
 * Rejects setting `brightness`/`opacity` whose sibling `color` is already Match Color while the
 * matching theme toggle is on. Covers every color container the same way: the top-level color group,
 * single-color compounds (`border*`), and layered paints (`background`, `shadow`, gradient stops).
 * Those facets mirror the matched source at compute time and must not be edited directly. The lock
 * reads the effective color, so a partial patch that touches only brightness or opacity is still
 * checked. A container that does not expose these facets has nothing in the patch, so it is a no-op.
 *
 * A patch that sets the `color` facet in the same commit is always allowed: switching a facet to
 * Match Color resends the container's existing brightness/opacity, and switching away replaces the
 * color outright. Either way the mirror reconciles the siblings at compute time.
 */
function assertMatchColorSiblingsLocked(
  workspace: Workspace,
  nodeId: InstanceId | VariantId,
  themeId: string | undefined,
  properties: Record<string, unknown>,
): void {
  const theme = getComputedTheme(themeId ?? DEFAULT_THEME_ID, workspace) as {
    matchColor?: {
      parameters?: { includeBrightness?: boolean; includeOpacity?: boolean }
    }
  }
  const includeBrightness = !!theme.matchColor?.parameters?.includeBrightness
  const includeOpacity = !!theme.matchColor?.parameters?.includeOpacity
  if (!includeBrightness && !includeOpacity) return

  const effective = getEffectiveProperties(nodeId, workspace) as Record<
    string,
    unknown
  >

  const checkFacets = (
    patch: Record<string, unknown>,
    effectiveFacets: Record<string, unknown> | undefined,
  ): void => {
    for (const [colorKey, siblingKeys] of Object.entries(COLOR_SIBLING_KEYS)) {
      // When the same patch sets the color facet, allow any sibling brightness/
      // opacity that rides along. The lock only guards edits made while the color
      // is already Match Color from the effective properties.
      if (colorKey in patch) continue

      const color = effectiveFacets?.[colorKey]
      if (!isMatchColorValue(color)) continue

      if (includeBrightness && siblingKeys.brightness in patch) {
        check(
          false,
          "Brightness cannot be changed while color is set to Match Color.",
        )
      }
      if (includeOpacity && siblingKeys.opacity in patch) {
        check(
          false,
          "Opacity cannot be changed while color is set to Match Color.",
        )
      }
    }
  }

  // Top-level color group: the root `color`/`brightness`/`opacity` triple.
  checkFacets(properties, effective)

  for (const key of COLOR_SIBLING_COMPOUND_KEYS) {
    const patch = properties[key]
    if (patch && typeof patch === "object" && !Array.isArray(patch)) {
      checkFacets(
        patch as Record<string, unknown>,
        effective[key] as Record<string, unknown> | undefined,
      )
    }
  }

  for (const key of COLOR_SIBLING_LAYER_KEYS) {
    const patchLayers = properties[key]
    if (!Array.isArray(patchLayers)) continue
    const effectiveLayers = effective[key]
    patchLayers.forEach((layerPatch, index) => {
      if (!layerPatch || typeof layerPatch !== "object") return
      const effectiveLayer = Array.isArray(effectiveLayers)
        ? (effectiveLayers[index] as Record<string, unknown> | undefined)
        : undefined
      checkFacets(layerPatch as Record<string, unknown>, effectiveLayer)
    })
  }
}
