import { plural } from "pluralize"

import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import { themeSwatchToColorValue } from "../../../helpers/color/theme-swatch-to-color-value"
import { getThemeOption } from "../../../helpers/theme/get-theme-option"
import { remapNodeThemeTokens } from "../../../helpers/theme/remap-node-theme-tokens"
import { isCompoundValue } from "../../../helpers/type-guards/compound/is-compound-value"
import { isAtomicValue } from "../../../helpers/type-guards/value/is-atomic-value"
import {
  Properties,
  PropertyKey,
  SubPropertyKey,
  ValueType,
} from "../../../properties"
import { mergeProperties } from "../../../properties/helpers/merge-properties"
import { AtomicValue, ThemeValue, Value } from "../../../properties/types"
import {
  Theme,
  ThemeInstanceId,
  ThemeSwatchKey,
  ThemeValueKey,
} from "../../../themes/types"
import { getBoardThemeRef } from "../../helpers/components/get-board-theme-ref"
import { walkBoardTreeRefs } from "../../helpers/components/walk-board-tree-refs"
import { getNextVariantLabel } from "../../helpers/general/get-next-variant-label"
import { getSpecialBoardVariantLabel } from "../../helpers/general/get-special-board-variant-label"
import { getWorkspaceNodes } from "../../helpers/general/get-workspace-nodes"
import { applyResetDefaultVariantToCatalog } from "../../helpers/nodes/apply-reset-default-variant-to-catalog"
import { applyResetUserVariantToDefaultVariant } from "../../helpers/nodes/apply-reset-user-variant-to-default-variant"
import { getNodeSubtreeIds } from "../../helpers/nodes/get-node-subtree-ids"
import { resolveNodePropertyResetPatch } from "../../helpers/nodes/resolve-node-property-reset"
import { isEntryNodeForRules } from "../../helpers/rules/rules-node-subject"
import {
  Board,
  BoardKey,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "../../types"
import { nodeRelationshipService } from "../nodes/node-relationship.service"
import { nodeRetrievalService } from "../nodes/node-retrieval.service"
import { nodeTraversalService } from "../nodes/node-traversal.service"
import { mutateWorkspace } from "../shared/workspace-mutation.helper"
import {
  withBoardMutation,
  withNodeMutation,
} from "../shared/workspace-operation-helpers"
import { typeCheckingService } from "../type-checking/type-checking.service"

export class WorkspaceMutationService {
  public setNodeLabel(
    nodeId: VariantId | InstanceId,
    label: string,
    workspace: Workspace,
  ): Workspace {
    return withNodeMutation(nodeId, workspace, (node) => {
      node.label = label
    })
  }

  public setNodeEditorData(
    nodeId: VariantId | InstanceId,
    editorData: Record<string, unknown> | undefined,
    workspace: Workspace,
  ): Workspace {
    return withNodeMutation(nodeId, workspace, (node) => {
      if (editorData === undefined) delete node.__editor
      else node.__editor = editorData
    })
  }

  /**
   * Picks the next numbered variant label for a component board.
   */
  public getInitialVariantLabel(
    componentId: ComponentId,
    workspace: Workspace,
  ): string {
    const nodesMap = getWorkspaceNodes(workspace)
    const board = workspace.components[componentId]
    if (board) {
      const specialLabel = getSpecialBoardVariantLabel(board, false)
      if (specialLabel) {
        const variantIdsOnBoard = collectVariantNodeIdsOnBoard(board)
        const existingCustomVariants = Object.values(nodesMap).filter(
          (node) =>
            typeCheckingService.isUserVariant(node) &&
            variantIdsOnBoard.has(node.id) &&
            node.label === specialLabel,
        )
        if (existingCustomVariants.length === 0) {
          return specialLabel
        }
      }
    }

    const boardForFilter = workspace.components[componentId]
    const variantIdsOnBoard = boardForFilter
      ? collectVariantNodeIdsOnBoard(boardForFilter)
      : new Set<string>()
    const nodes = Object.values(nodesMap).filter(
      (node) =>
        typeCheckingService.isUserVariant(node) &&
        variantIdsOnBoard.has(node.id) &&
        node.label,
    )
    const existingLabels = new Set(nodes.map((node) => node.label))

    const defaultVariant = boardForFilter
      ? nodeRetrievalService.getDefaultVariant(componentId, workspace)
      : undefined
    const base =
      defaultVariant?.label && defaultVariant.label !== "Default"
        ? defaultVariant.label
        : (boardForFilter?.label ?? defaultVariant?.label ?? "Variant")

    return getNextVariantLabel(base, existingLabels)
  }

  /** Pluralizes the component schema name for a new board label, such as "Buttons". */
  public getInitialComponentLabel(componentId: ComponentId): string {
    try {
      return plural(getComponentSchema(componentId).name)
    } catch {
      return `Unknown Component (${componentId})`
    }
  }

  /**
   * Sets properties on a node.
   * @param nodeId - The node ID
   * @param properties - The properties to set
   * @param workspace - The workspace
   * @param options - Merge options
   * @returns The updated workspace
   */
  public setNodeProperties(
    nodeId: VariantId | InstanceId,
    properties: Properties,
    workspace: Workspace,
    options?: {
      mergeSubProperties?: boolean
    },
  ): Workspace {
    return withNodeMutation(nodeId, workspace, (node) => {
      if (!isEntryNodeForRules(node)) return
      node.overrides = mergeProperties(node.overrides, properties, options)
    })
  }

  /**
   * Resets a property on a node to its default value.
   * @param nodeId - The node ID
   * @param propertyKey - The property key to reset
   * @param subpropertyKey - Optional sub-property key
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public resetNodeProperty(
    nodeId: VariantId | InstanceId,
    {
      propertyKey,
      subpropertyKey,
    }: {
      propertyKey: PropertyKey
      subpropertyKey?: SubPropertyKey
    },
    workspace: Workspace,
  ): Workspace {
    return this._resetObjectProperty(
      nodeId,
      { propertyKey, subpropertyKey },
      workspace,
    )
  }

  /**
   * Clears every override on a node and all descendants in its variant tree,
   * reverting the subtree to its template baseline.
   * @param nodeId - The node ID
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public resetNodeOverrides(
    nodeId: VariantId | InstanceId,
    workspace: Workspace,
  ): Workspace {
    const subtreeIds = getNodeSubtreeIds(nodeId, workspace)
    return mutateWorkspace(workspace, (draft) => {
      const nodes = getWorkspaceNodes(draft)
      for (const id of subtreeIds) {
        const node = nodes[id]
        if (node && isEntryNodeForRules(node)) {
          node.overrides = {}
        }
      }
    })
  }

  /**
   * Sets properties on a board.
   * @param boardKey - Key of the board in `workspace.components`
   * @param properties - The properties to set
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public setComponentProperties(
    boardKey: BoardKey,
    properties: Properties,
    workspace: Workspace,
  ): Workspace {
    return withBoardMutation(boardKey, workspace, (board) => {
      board.componentProperties = mergeProperties(
        board.componentProperties,
        properties,
        {
          mergeSubProperties: true,
        },
      )
    })
  }

  /**
   * Resets a property on a board to its default value.
   * @param boardKey - Key of the board in `workspace.components`
   * @param propertyKey - The property key to reset
   * @param subpropertyKey - Optional sub-property key
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public resetComponentProperty(
    boardKey: BoardKey,
    {
      propertyKey,
      subpropertyKey,
    }: {
      propertyKey: PropertyKey
      subpropertyKey?: SubPropertyKey
    },
    workspace: Workspace,
  ): Workspace {
    return this._resetObjectProperty(
      boardKey,
      { propertyKey, subpropertyKey },
      workspace,
    )
  }

  /**
   * Replaces a user variant’s composition tree with the default variant’s tree for the same board.
   */
  public resetUserVariantToDefaultVariant(
    variantRootId: VariantId,
    workspace: Workspace,
  ): Workspace {
    return applyResetUserVariantToDefaultVariant(workspace, variantRootId)
  }

  /**
   * Rebuilds a default variant’s composition tree to match its catalog schema default.
   */
  public resetDefaultVariantToCatalog(
    defaultVariantRootId: VariantId,
    workspace: Workspace,
  ): Workspace {
    return applyResetDefaultVariantToCatalog(workspace, defaultVariantRootId)
  }

  private _resetObjectProperty(
    objectId: VariantId | InstanceId | BoardKey,
    {
      propertyKey,
      subpropertyKey,
    }: {
      propertyKey: PropertyKey
      subpropertyKey?: SubPropertyKey
    },
    workspace: Workspace,
  ): Workspace {
    return mutateWorkspace(workspace, (draft) => {
      const board = draft.components[objectId as BoardKey]

      if (board) {
        if (subpropertyKey) {
          deleteSubProperty(board.componentProperties, propertyKey, subpropertyKey)
        } else {
          delete board.componentProperties[propertyKey]
        }
        return
      }

      const node = nodeRetrievalService.getNode(
        objectId as VariantId | InstanceId,
        draft,
      )

      if (!isEntryNodeForRules(node)) return

      const patch = resolveNodePropertyResetPatch(
        node,
        draft,
        propertyKey,
        subpropertyKey,
      )

      if (patch.action === "delete") {
        delete node.overrides[propertyKey]
        return
      }

      if (patch.action === "delete-sub" && subpropertyKey) {
        deleteSubProperty(node.overrides, propertyKey, subpropertyKey)
        return
      }

      if (patch.action === "set") {
        node.overrides = mergeProperties(node.overrides, patch.properties, {
          mergeSubProperties: true,
        })
      }
    })
  }

  /**
   * Sets the theme of a board and migrates properties for variants that inherit from the board.
   */
  public setComponentTheme(
    boardKey: BoardKey,
    theme: ThemeInstanceId,
    workspace: Workspace,
  ): Workspace {
    return withBoardMutation(boardKey, workspace, (board, draft) => {
      const currentTheme =
        getBoardThemeRef(board) ?? ("seldon" as ThemeInstanceId)
      board.componentTheme = theme

      for (const ref of board.variants) {
        const variantId = ref.id as VariantId
        // Resource boards (theme, font collection, icon set, media) reference
        // entries outside the node map, so there is no node theme to remap.
        if (!getWorkspaceNodes(draft)[variantId]) {
          continue
        }
        const variant = nodeRetrievalService.getVariant(variantId, draft)

        if (variant.theme === null) {
          remapNodeThemeTokens(variant.id, currentTheme, theme, draft)
        }
      }
    })
  }

  /**
   * Sets theme on a node and migrates properties to the new theme.
   * @param nodeId - The node ID
   * @param theme - The theme ID or null (null means inherit from parent)
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public setNodeTheme(
    nodeId: VariantId | InstanceId,
    theme: ThemeInstanceId | null,
    workspace: Workspace,
  ): Workspace {
    return withNodeMutation(nodeId, workspace, (node, draft) => {
      const currentTheme = this.getInheritedTheme(node, draft)
      const newTheme = theme ?? this.getInheritedTheme(node, draft)

      remapNodeThemeTokens(node.id, currentTheme, newTheme, draft)
      node.theme = theme
    })
  }

  /**
   * Gets the theme ID for a node (direct or inherited).
   * @param node - The node
   * @param workspace - The workspace
   * @returns The theme ID
   */
  public getNodeTheme(
    node: Variant | Instance,
    workspace: Workspace,
  ): ThemeInstanceId {
    if (node.theme) {
      return node.theme as ThemeInstanceId
    }

    return this.getInheritedTheme(node, workspace)
  }

  /**
   * Gets the inherited theme for a node by traversing up the hierarchy.
   * @param node - The node
   * @param workspace - The workspace
   * @returns The inherited theme ID
   */
  public getInheritedTheme(
    node: Variant | Instance,
    workspace: Workspace,
  ): ThemeInstanceId {
    const board = nodeRelationshipService.findBoardForNode(node, workspace)
    const parent = nodeTraversalService.findParentNode(node, workspace)

    if (parent) {
      if (parent.theme) {
        return parent.theme as ThemeInstanceId
      }
      return this.getNodeTheme(parent, workspace)
    }

    if (!board) {
      return "seldon" as ThemeInstanceId
    }

    return getBoardThemeRef(board) ?? ("seldon" as ThemeInstanceId)
  }

  /**
   * Replaces `@swatch.*` override refs with exact HSL for nodes on the given theme.
   * @param theme - The computed theme that resolves the swatch
   * @param key - The swatch token key, such as `@swatch.custom1`
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public replaceSwatchRefsWithExactColor(
    theme: Theme,
    key: ThemeSwatchKey,
    workspace: Workspace,
  ): Workspace {
    const exactValue = themeSwatchToColorValue(
      getThemeOption(key, theme),
    ) as AtomicValue

    return mutateWorkspace(workspace, (draft) => {
      const nodes = this._findNodesWithThemeValue(key, draft).filter(
        (node) => this.getNodeTheme(node, draft) === theme.id,
      )

      for (const node of nodes) {
        if (isEntryNodeForRules(node)) {
          replaceThemeKeyInProperties(node.overrides, key, exactValue)
        }
      }
    })
  }

  private _findNodesWithThemeValue(
    key: ThemeValueKey,
    workspace: Workspace,
  ): (Variant | Instance)[] {
    return Object.values(getWorkspaceNodes(workspace)).filter((node) =>
      Object.values(node.overrides).some((rawValue) =>
        valueReferencesThemeKey(rawValue as Value, key),
      ),
    ) as (Variant | Instance)[]
  }
}

export const workspaceMutationService = new WorkspaceMutationService()

function collectVariantNodeIdsOnBoard(board: Board): Set<string> {
  const ids = new Set<string>()
  walkBoardTreeRefs(board.variants, (ref) => {
    ids.add(ref.id)
  })
  return ids
}

/** Deletes one sub-property facet from a compound or layered-paint property bag. */
function deleteSubProperty(
  bag: Properties,
  propertyKey: PropertyKey,
  subpropertyKey: SubPropertyKey,
): void {
  const overrideBag = bag[propertyKey]
  if (Array.isArray(overrideBag) && overrideBag[0]) {
    delete (overrideBag[0] as Record<string, unknown>)[subpropertyKey]
  } else if (
    overrideBag &&
    typeof overrideBag === "object" &&
    !Array.isArray(overrideBag)
  ) {
    delete (overrideBag as Record<string, unknown>)[subpropertyKey]
  }
}

function isThemeRefValue(value: AtomicValue): value is ThemeValue {
  return (
    value.type === ValueType.THEME_CATEGORICAL ||
    value.type === ValueType.THEME_ORDINAL
  )
}

/** True when an atomic or compound value references the given theme token key. */
function valueReferencesThemeKey(value: Value, key: ThemeValueKey): boolean {
  if (isCompoundValue(value)) {
    return Object.values(value).some(
      (sub: AtomicValue) => isThemeRefValue(sub) && sub.value === key,
    )
  }
  return isAtomicValue(value) && isThemeRefValue(value) && value.value === key
}

/** Rewrites every atomic or compound facet that references `key` to `exactValue`. */
function replaceThemeKeyInProperties(
  bag: Properties,
  key: ThemeSwatchKey,
  exactValue: AtomicValue,
): void {
  for (const [propertyKey, rawValue] of Object.entries(bag)) {
    const value = rawValue as Value
    if (isCompoundValue(value)) {
      for (const [subKey, subValue] of Object.entries(value)) {
        if (isThemeRefValue(subValue) && subValue.value === key) {
          Object.assign(bag[propertyKey as PropertyKey]!, { [subKey]: exactValue })
        }
      }
    } else if (isAtomicValue(value) && isThemeRefValue(value) && value.value === key) {
      Object.assign(bag, { [propertyKey]: exactValue })
    }
  }
}
