import { plural } from "pluralize"
import { getComponentSchema } from "../../components/catalog"
import { ComponentId } from "../../components/constants"
import { getThemeOption } from "../../helpers/theme/get-theme-option"
import { migrateNodePropertiesToTheme } from "../../helpers/theme/migrate-properties-to-theme"
import { isCompoundValue } from "../../helpers/type-guards/compound/is-compound-value"
import { isAtomicValue } from "../../helpers/type-guards/value/is-atomic-value"
import {
  HSLValue,
  Properties,
  PropertyKey,
  SubPropertyKey,
  ValueType,
} from "../../properties"
import { mergeProperties } from "../../properties/helpers/merge-properties"
import { AtomicValue, ThemeValue, Value } from "../../properties/types"
import {
  Theme,
  ThemeId,
  ThemeSwatchKey,
  ThemeValueKey,
} from "../../themes/types"
import { Instance, InstanceId, Variant, VariantId, Workspace } from "../types"
import { nodeRetrievalService } from "./node-retrieval.service"
import { nodeTraversalService } from "./node-traversal.service"
import { handleSchemaError } from "./shared/error-handling.helper"
import { mutateWorkspace } from "./shared/workspace-mutation.helper"
import {
  withBoardMutation,
  withNodeMutation,
} from "./shared/workspace-operation-helpers"
import { typeCheckingService } from "./type-checking.service"

export class WorkspaceMutationService {
  /**
   * Sets the label for a node.
   * @param nodeId - The node ID
   * @param label - The new label
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public setNodeLabel(
    nodeId: VariantId | InstanceId,
    label: string,
    workspace: Workspace,
  ): Workspace {
    return withNodeMutation(nodeId, workspace, (node) => {
      node.label = label
    })
  }

  /**
   * Generates a unique label for a new variant by finding the next available number.
   * @param componentId - The component ID
   * @param byId - The workspace nodes
   * @returns A unique variant label (e.g., "Variant01", "Variant02")
   */
  public getInitialVariantLabel(
    componentId: ComponentId,
    byId: Workspace["byId"],
  ): string {
    const nodes = Object.values(byId).filter(
      (node) =>
        typeCheckingService.isUserVariant(node) &&
        node.component === componentId &&
        node.label,
    )
    const existingLabels = new Set(nodes.map((node) => node.label))

    let number = 1
    let nextLabel = number < 10 ? `Variant0${number}` : `Variant${number}`
    while (existingLabels.has(nextLabel)) {
      number++
      nextLabel = number < 10 ? `Variant0${number}` : `Variant${number}`
    }

    return nextLabel
  }

  /**
   * Gets the initial label for a board based on component schema.
   * @param componentId - The component ID
   * @returns The initial board label
   */
  public getInitialBoardLabel(componentId: ComponentId): string {
    try {
      return plural(getComponentSchema(componentId).name)
    } catch (error) {
      return handleSchemaError(componentId, "getInitialBoardLabel", error)
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
      node.properties = mergeProperties(node.properties, properties, options)
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
   * @param componentId - The component ID
   * @param properties - The properties to set
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public setBoardProperties(
    componentId: ComponentId,
    properties: Properties,
    workspace: Workspace,
  ): Workspace {
    return withBoardMutation(componentId, workspace, (board) => {
      board.properties = mergeProperties(board.properties, properties, {
        mergeSubProperties: true,
      })
    })
  }

  /**
   * Resets a property on a board to its default value.
   * @param componentId - The component ID
   * @param propertyKey - The property key to reset
   * @param subpropertyKey - Optional sub-property key
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public resetBoardProperty(
    componentId: ComponentId,
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
      componentId,
      { propertyKey, subpropertyKey },
      workspace,
    )
  }

  private _resetObjectProperty(
    objectId: VariantId | InstanceId | ComponentId,
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
      const object =
        typeof objectId === "string" && objectId.includes("-")
          ? nodeRetrievalService.getNode(
              objectId as VariantId | InstanceId,
              draft,
            )
          : nodeRetrievalService.getBoard(objectId as ComponentId, draft)

      if (subpropertyKey) {
        delete (object.properties[propertyKey] as any)[subpropertyKey]
      } else {
        delete object.properties[propertyKey]
      }
    })
  }

  /**
   * Sets the theme of a board and migrates properties for variants that inherit from the board.
   * @param componentId - The component ID
   * @param theme - The theme ID
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public setBoardTheme(
    componentId: ComponentId,
    theme: ThemeId,
    workspace: Workspace,
  ): Workspace {
    return withBoardMutation(componentId, workspace, (board, draft) => {
      const currentTheme = board.theme
      board.theme = theme

      board.variants.forEach((variantId: VariantId) => {
        const variant = nodeRetrievalService.getVariant(variantId, draft)

        if (variant.theme === null) {
          migrateNodePropertiesToTheme(variant.id, currentTheme, theme, draft)
        }
      })
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
    theme: ThemeId | null,
    workspace: Workspace,
  ): Workspace {
    return withNodeMutation(nodeId, workspace, (node, draft) => {
      const currentTheme = this.getInheritedTheme(node, draft)
      const newTheme = theme ?? this.getInheritedTheme(node, draft)

      migrateNodePropertiesToTheme(node.id, currentTheme, newTheme, draft)
      node.theme = theme
    })
  }

  /**
   * Gets the theme ID for a node (direct or inherited).
   * @param node - The node
   * @param workspace - The workspace
   * @returns The theme ID
   */
  public getNodeTheme(node: Variant | Instance, workspace: Workspace): ThemeId {
    if (node.theme) {
      return node.theme
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
  ): ThemeId {
    const board = nodeRetrievalService.getBoard(node.component, workspace)
    const parent = nodeTraversalService.findParentNode(node, workspace)

    if (parent) {
      if (parent.theme) {
        return parent.theme
      }
      return this.getNodeTheme(parent, workspace)
    }

    return board.theme
  }

  /**
   * Migrates all nodes using a specific swatch to exact HSL values.
   * @param theme - The theme containing the swatch
   * @param key - The swatch key to migrate
   * @param workspace - The workspace
   * @returns The updated workspace
   */
  public migrateSwatchToExactValue(
    theme: Theme,
    key: ThemeSwatchKey,
    workspace: Workspace,
  ): Workspace {
    const exactValue: HSLValue = {
      type: ValueType.EXACT,
      value: getThemeOption(key, theme).value,
    }

    return mutateWorkspace(workspace, (draft) => {
      const nodes = this._findNodesWithThemeValue(key, draft).filter(
        (node) => this.getNodeTheme(node, draft) === theme.id,
      )

      nodes.forEach((node) => {
        Object.entries(node.properties).forEach(([propertyKey, value]) => {
          if (isCompoundValue(value)) {
            Object.entries(value).forEach(([subPropertyKey, subValue]) => {
              if (this._isThemeValue(subValue) && subValue.value === key) {
                Object.assign(node.properties[propertyKey as PropertyKey]!, {
                  [subPropertyKey]: exactValue,
                })
              }
            })
          } else if (
            isAtomicValue(value) &&
            this._isThemeValue(value) &&
            value.value === key
          ) {
            Object.assign(node.properties, {
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
    return Object.values(workspace.byId).filter((node) =>
      Object.values(node.properties).some((value: Value) => {
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
      }),
    )
  }

  private _isThemeValue(value: AtomicValue): value is ThemeValue {
    return (
      value.type === ValueType.THEME_CATEGORICAL ||
      value.type === ValueType.THEME_ORDINAL
    )
  }
}

export const workspaceMutationService = new WorkspaceMutationService()
