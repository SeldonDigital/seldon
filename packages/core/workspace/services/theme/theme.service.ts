import { invariant } from "../../../helpers/utils/invariant"
import { Theme, ThemeCustomSwatchId, ThemeInstanceId } from "../../../themes/types"
import { computeWorkspaceThemes, getComputedTheme } from "../../compute"
import {
  ComponentEntry,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "../../types"
import { getComponentLevelThemeRef } from "../../helpers/components/get-component-level-theme-ref"
import { nodeRelationshipService } from "../nodes/node-relationship.service"
import { nodeRetrievalService } from "../nodes/node-retrieval.service"
import { nodeTraversalService } from "../nodes/node-traversal.service"
import { typeCheckingService } from "../type-checking/type-checking.service"

export class WorkspaceThemeService {
  /**
   * Gets the theme ID for an object (board, variant, or instance).
   * @param object - The object to get theme ID for
   * @param workspace - The workspace
   * @returns The theme ID
   */
  public getObjectThemeId(
    object: Variant | Instance | ComponentEntry,
    workspace: Workspace,
  ): ThemeInstanceId {
    if (typeCheckingService.isComponentEntry(object)) {
      return getComponentLevelThemeRef(object) ?? ("default" as ThemeInstanceId)
    }

    return this.getNodeThemeId(object.id, workspace)
  }

  /**
   * Gets the theme for an object (board, variant, or instance).
   * @param object - The object to get theme for
   * @param workspace - The workspace
   * @returns The theme
   */
  public getObjectTheme(
    object: Variant | Instance | ComponentEntry,
    workspace: Workspace,
  ): Theme {
    return this.getTheme(this.getObjectThemeId(object, workspace), workspace)
  }

  /**
   * Gets the theme ID for a node with inheritance from parents.
   * @param nodeId - The node ID
   * @param workspace - The workspace
   * @returns The theme ID
   */
  public getNodeThemeId(
    nodeId: InstanceId | VariantId,
    workspace: Workspace,
  ): ThemeInstanceId {
    const childNode = nodeRetrievalService.getNode(
      nodeId as InstanceId | VariantId,
      workspace,
    )

    let currentNode: Variant | Instance | null = childNode

    while (currentNode) {
      if (currentNode.theme) {
        return currentNode.theme as ThemeInstanceId
      }

      currentNode = nodeTraversalService.findParentNode(currentNode.id, workspace)
    }

    const rootNode = nodeRelationshipService.getRootVariant(childNode, workspace)
    const board = nodeRelationshipService.findComponentForVariant(rootNode, workspace)

    invariant(board, `Unable to find board for variant ${rootNode.id}`)

    return getComponentLevelThemeRef(board) ?? ("default" as ThemeInstanceId)
  }

  /**
   * Gets the theme for a node with inheritance from parents.
   * @param nodeId - The node ID
   * @param workspace - The workspace
   * @returns The theme
   */
  public getNodeTheme(
    nodeId: InstanceId | VariantId,
    workspace: Workspace,
  ): Theme {
    const themeId = this.getNodeThemeId(nodeId, workspace)

    return this.getTheme(themeId, workspace)
  }

  /**
   * Gets a theme by ID from available themes.
   * @param themeId - The theme ID
   * @param workspace - The workspace
   * @returns The theme
   */
  public getTheme(themeId: ThemeInstanceId, workspace: Workspace): Theme {
    return getComputedTheme(themeId, workspace as any)
  }

  /**
   * Gets all available themes (custom and stock).
   * @param workspace - The workspace
   * @returns Array of all themes
   */
  public getThemes(workspace: Workspace): Theme[] {
    return computeWorkspaceThemes(workspace as any)
  }

  /**
   * Returns the next `customN` id for a custom-token bag at `themes[themeId].overrides[section]`.
   * Scans existing `customN` keys and returns the next free slot, starting at `custom1`.
   */
  public getNextCustomTokenIdForTheme(
    workspace: Workspace,
    themeId: string,
    section: string,
  ): ThemeCustomSwatchId {
    const entry = workspace.themes[themeId]
    const bag = (entry?.overrides?.[section] ?? {}) as Record<string, unknown>
    const customIds = Object.keys(bag).filter((id) => id.startsWith("custom"))

    if (customIds.length === 0) return "custom1"

    const sortedIds = customIds.sort((a, b) => {
      return parseInt(a.replace("custom", "")) - parseInt(b.replace("custom", ""))
    })

    const highest = parseInt(sortedIds.at(-1)!.replace("custom", ""))

    return `custom${highest + 1}` as ThemeCustomSwatchId
  }

  /**
   * Collects all theme IDs used in the workspace.
   * @param workspace - The workspace
   * @returns Set of used theme IDs
   */
  public collectUsedThemes(workspace: Workspace): Set<ThemeInstanceId> {
    const usedThemeIds = new Set<ThemeInstanceId>()

    Object.values(workspace.components).forEach((board) => {
      const ref = board ? getComponentLevelThemeRef(board) : undefined
      if (ref) {
        usedThemeIds.add(ref)
      }
    })

    Object.values(workspace.nodes).forEach((node) => {
      if (node.theme) {
        usedThemeIds.add(node.theme as ThemeInstanceId)
      }
    })

    if (usedThemeIds.size === 0) {
      usedThemeIds.add("default")
    }

    return usedThemeIds
  }
}

export const workspaceThemeService = new WorkspaceThemeService()

/**
 * @deprecated Use `workspaceThemeService`. Still exported for editor and factory imports.
 */
export const themeService = workspaceThemeService
