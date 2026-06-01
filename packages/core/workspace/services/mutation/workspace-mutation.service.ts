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
import { getComponentLevelThemeRef } from "../../helpers/components/get-component-level-theme-ref"
import { getNextVariantLabel } from "../../helpers/general/get-next-variant-label"
import { getSpecialComponentVariantLabel } from "../../helpers/general/get-special-component-variant-label"
import { getWorkspaceNodes } from "../../helpers/general/get-workspace-nodes"
import { applyResetUserVariantToDefaultVariant } from "../../helpers/nodes/apply-reset-user-variant-to-default-variant"
import { resolveNodePropertyResetPatch } from "../../helpers/nodes/resolve-node-property-reset"
import { isEntryNodeForRules } from "../../helpers/rules/rules-node-subject"
import { walkComponentTreeRefs } from "../../helpers/components/walk-component-tree-refs"
import {
  ComponentEntry,
  ComponentKey,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "../../types"
import { nodeRetrievalService } from "../nodes/node-retrieval.service"
import { nodeRelationshipService } from "../nodes/node-relationship.service"
import { nodeTraversalService } from "../nodes/node-traversal.service"
import { handleSchemaError } from "../shared/error-handling.helper"
import { mutateWorkspace } from "../shared/workspace-mutation.helper"
import {
  withComponentMutation,
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
      const specialLabel = getSpecialComponentVariantLabel(board, false)
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

  /**
   * Gets the initial label for a board based on component schema.
   * IconSet and Theme use the same pluralization logic as other boards.
   * @param componentId - The component ID
   * @returns The initial board label
   */
  public getInitialComponentLabel(componentId: ComponentId): string {
    try {
      return plural(getComponentSchema(componentId).name)
    } catch (error) {
      return handleSchemaError(componentId, "getInitialComponentLabel", error)
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
   * Sets properties on a board.
   * @param componentKey - Key of the board in `workspace.components`
   * @param properties - The properties to set
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public setComponentProperties(
    componentKey: ComponentKey,
    properties: Properties,
    workspace: Workspace,
  ): Workspace {
    return withComponentMutation(componentKey, workspace, (board, draft) => {
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
   * @param componentKey - Key of the board in `workspace.components`
   * @param propertyKey - The property key to reset
   * @param subpropertyKey - Optional sub-property key
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public resetComponentProperty(
    componentKey: ComponentKey,
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
      componentKey,
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

  private _resetObjectProperty(
    objectId: VariantId | InstanceId | ComponentKey,
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
      const board = draft.components[objectId as ComponentKey]

      if (board) {
        if (subpropertyKey) {
          const overrideBag = board.componentProperties[propertyKey]
          if (Array.isArray(overrideBag) && overrideBag[0]) {
            delete (overrideBag[0] as Record<string, unknown>)[subpropertyKey]
          } else if (
            overrideBag &&
            typeof overrideBag === "object" &&
            !Array.isArray(overrideBag)
          ) {
            delete (overrideBag as Record<string, unknown>)[subpropertyKey]
          }
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
        const overrideBag = node.overrides[propertyKey]
        if (Array.isArray(overrideBag) && overrideBag[0]) {
          delete (overrideBag[0] as Record<string, unknown>)[subpropertyKey]
        } else if (
          overrideBag &&
          typeof overrideBag === "object" &&
          !Array.isArray(overrideBag)
        ) {
          delete (overrideBag as Record<string, unknown>)[subpropertyKey]
        }
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
    componentKey: ComponentKey,
    theme: ThemeInstanceId,
    workspace: Workspace,
  ): Workspace {
    return withComponentMutation(componentKey, workspace, (board, draft) => {
      const currentTheme =
        getComponentLevelThemeRef(board) ?? ("seldon" as ThemeInstanceId)
      board.componentTheme = theme

      for (const ref of board.variants) {
        const variantId = ref.id as VariantId
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
    const board = nodeRelationshipService.findComponentForNode(node, workspace)
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

    return getComponentLevelThemeRef(board) ?? ("seldon" as ThemeInstanceId)
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
    const exactValue = themeSwatchToColorValue(getThemeOption(key, theme))

    return mutateWorkspace(workspace, (draft) => {
      const nodes = this._findNodesWithThemeValue(key, draft).filter(
        (node) => this.getNodeTheme(node, draft) === theme.id,
      )

      nodes.forEach((node) => {
        if (!isEntryNodeForRules(node)) return
        const bag: Properties = node.overrides
        Object.entries(bag).forEach(([propertyKey, rawValue]) => {
          const value = rawValue as Value
          if (isCompoundValue(value)) {
            Object.entries(value).forEach(([subPropertyKey, subValue]) => {
              if (this._isThemeValue(subValue) && subValue.value === key) {
                Object.assign(bag[propertyKey as PropertyKey]!, {
                  [subPropertyKey]: exactValue,
                })
              }
            })
          } else if (
            isAtomicValue(value) &&
            this._isThemeValue(value) &&
            value.value === key
          ) {
            Object.assign(bag, {
              [propertyKey]: exactValue as AtomicValue,
            })
          }
        })
      })
    })
  }

  private _findNodesWithThemeValue(
    key: ThemeValueKey,
    workspace: Workspace,
  ): (Variant | Instance)[] {
    return Object.values(getWorkspaceNodes(workspace)).filter((node) => {
      const props: Properties =
        "properties" in node && (node as { properties?: Properties }).properties
          ? (node as { properties: Properties }).properties
          : "overrides" in node
            ? (node as { overrides: Properties }).overrides
            : {}
      return Object.values(props).some((rawValue) => {
        const value = rawValue as Value
        if (isCompoundValue(value)) {
          return Object.values(value).some((subValue: AtomicValue) => {
            return this._isThemeValue(subValue) && subValue.value === key
          })
        }

        return (
          isAtomicValue(value) &&
          this._isThemeValue(value) &&
          value.value === key
        )
      })
    }) as (Variant | Instance)[]
  }

  private _isThemeValue(value: AtomicValue): value is ThemeValue {
    return (
      value.type === ValueType.THEME_CATEGORICAL ||
      value.type === ValueType.THEME_ORDINAL
    )
  }
}

export const workspaceMutationService = new WorkspaceMutationService()

function collectVariantNodeIdsOnBoard(board: ComponentEntry): Set<string> {
  const ids = new Set<string>()
  walkComponentTreeRefs(board.variants, (ref) => {
    ids.add(ref.id)
  })
  return ids
}
