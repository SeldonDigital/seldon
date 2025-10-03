import { invariant } from "../../helpers/utils/invariant"
import { stockThemes } from "../../themes"
import { Theme, ThemeCustomSwatchId, ThemeId } from "../../themes/types"
import {
  Board,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "../types"
import { workspaceService } from "./workspace.service"

export class ThemeService {
  /**
   * Gets the theme ID for an object (board, variant, or instance).
   * @param object - The object to get theme ID for
   * @param workspace - The workspace
   * @returns The theme ID
   */
  public getObjectThemeId(
    object: Variant | Instance | Board,
    workspace: Workspace,
  ): ThemeId {
    if (workspaceService.isBoard(object)) {
      return object.theme
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
    object: Variant | Instance | Board,
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
  ): ThemeId {
    const childNode = workspaceService.getNode(
      nodeId as InstanceId | VariantId,
      workspace,
    )

    let currentNode: Variant | Instance | null = childNode

    while (currentNode) {
      if (currentNode.theme) {
        return currentNode.theme
      }

      currentNode = workspaceService.findParentNode(currentNode.id, workspace)
    }

    const rootNode = workspaceService.getRootVariant(childNode, workspace)
    const board = workspaceService.findBoardForVariant(rootNode, workspace)

    invariant(board, `Unable to find board for variant ${rootNode.id}`)

    return board.theme
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
  public getTheme(themeId: ThemeId, workspace: Workspace): Theme {
    const theme = this.getThemes(workspace).find(
      (theme) => theme.id === themeId,
    )

    invariant(theme, `Theme ${themeId} not found`)

    return theme
  }

  /**
   * Gets all available themes (custom and stock).
   * @param workspace - The workspace
   * @returns Array of all themes
   */
  public getThemes(workspace: Workspace): Theme[] {
    return [workspace.customTheme, ...stockThemes].filter(
      (theme): theme is Theme => theme !== null,
    )
  }

  /**
   * Generates the next available custom swatch ID.
   * @param workspace - The workspace
   * @returns The next custom swatch ID
   */
  public getNextCustomSwatchId(workspace: Workspace): ThemeCustomSwatchId {
    const customSwatchIds = Object.keys(workspace.customTheme.swatch).filter(
      (id) => id.startsWith("custom"),
    )

    if (customSwatchIds.length === 0) return "custom1"

    const sortedIds = customSwatchIds.sort((a, b) => {
      const aIndex = parseInt(a.replace("custom", ""))
      const bIndex = parseInt(b.replace("custom", ""))
      return aIndex - bIndex
    })

    const highestNumber = parseInt(sortedIds.at(-1)!.replace("custom", ""))

    return `custom${highestNumber + 1}` as ThemeCustomSwatchId
  }

  /**
   * Collects all theme IDs used in the workspace.
   * @param workspace - The workspace
   * @returns Set of used theme IDs
   */
  public collectUsedThemes(workspace: Workspace): Set<ThemeId> {
    const usedThemeIds = new Set<ThemeId>()

    Object.values(workspace.boards).forEach((board) => {
      if (board?.theme) {
        usedThemeIds.add(board.theme)
      }
    })

    Object.values(workspace.byId).forEach((node) => {
      if (node.theme) {
        usedThemeIds.add(node.theme)
      }
    })

    if (usedThemeIds.size === 0) {
      usedThemeIds.add("default")
    }

    return usedThemeIds
  }
}

export const themeService = new ThemeService()
