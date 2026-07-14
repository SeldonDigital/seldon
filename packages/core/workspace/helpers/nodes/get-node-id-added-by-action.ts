import { WorkspaceAction } from "../../reducers/types"
import { EntryNodeId, Workspace } from "../../types"
import { getBoardByNodeId } from "../components/get-board-by-node-id"
import { getBoardVariantRootIds } from "../components/get-board-variant-root-ids"
import { getChildrenIds } from "../components/get-children-ids"
import { getImmediateParentId } from "../components/get-parent-ids"
import { fontCollectionBoardKeyFromEntryId } from "../font-collections/font-collection-id"

/**
 * Determines the ID of the node that was added by a workspace action.
 * @param action - The action that was performed
 * @param workspace - The workspace after the action
 * @returns The ID of the node that was added, or null if no node was added
 */
export function getNodeIdAddedByAction(
  action: WorkspaceAction,
  workspace: Workspace,
): EntryNodeId | null {
  const { type, payload } = action
  switch (type) {
    case "insert_variant_instance":
    case "insert_duplicate_instance": {
      const board = getBoardByNodeId(
        workspace,
        payload.target.parentId as EntryNodeId,
      )
      if (!board) return null
      const childIds = getChildrenIds(
        board,
        payload.target.parentId as EntryNodeId,
      )
      if (typeof payload.target.index === "number")
        return childIds[payload.target.index] ?? null
      return childIds.at(-1) ?? null
    }

    case "insert_default_instance": {
      const board = getBoardByNodeId(workspace, payload.parentId as EntryNodeId)
      if (!board) return null
      const childIds = getChildrenIds(board, payload.parentId as EntryNodeId)
      if (typeof payload.index === "number")
        return childIds[payload.index] ?? null
      return childIds.at(-1) ?? null
    }

    case "add_component": {
      const board = workspace.boards[payload.boardKey]
      if (!board) return null
      const lastVariant = getBoardVariantRootIds(board).at(-1)
      if (!lastVariant) {
        return null
      }
      return lastVariant
    }

    case "add_variant":
    case "add_theme":
    case "add_playground": {
      const board = workspace.boards[payload.boardKey]
      if (!board) return null
      const lastVariant = getBoardVariantRootIds(board).at(-1)
      if (!lastVariant) {
        return null
      }
      return lastVariant
    }

    case "add_component_and_insert_default_instance": {
      const board = getBoardByNodeId(
        workspace,
        payload.target.parentId as EntryNodeId,
      )
      if (!board) return null
      const childIds = getChildrenIds(
        board,
        payload.target.parentId as EntryNodeId,
      )
      if (typeof payload.target.index === "number")
        return childIds[payload.target.index] ?? null
      return childIds.at(-1) ?? null
    }

    case "duplicate_node": {
      const sourceId = payload.nodeId as EntryNodeId
      const board = getBoardByNodeId(workspace, sourceId)
      if (!board) return null

      const parentId = getImmediateParentId(board, sourceId)
      if (!parentId) {
        const variantIds = getBoardVariantRootIds(board)
        const sourceIndex = variantIds.indexOf(sourceId)
        if (sourceIndex < 0) return null
        return variantIds[sourceIndex + 1] ?? null
      }

      const siblingIds = getChildrenIds(board, parentId)
      const sourceIndex = siblingIds.indexOf(sourceId)
      if (sourceIndex < 0) return null
      return siblingIds[sourceIndex + 1] ?? null
    }
    case "duplicate_component": {
      const board = workspace.boards[payload.newBoardKey]
      if (!board) return null
      return getBoardVariantRootIds(board).at(-1) ?? null
    }

    case "add_font_collection":
    case "add_media":
    case "add_icon_set": {
      const board = workspace.boards[payload.catalogId]
      if (!board) return null
      const lastVariant = getBoardVariantRootIds(board).at(-1)
      if (!lastVariant) return null
      return lastVariant
    }

    case "duplicate_theme": {
      const id = payload.themeId
      const afterTheme = id.startsWith("theme-")
        ? id.slice("theme-".length)
        : ""
      const boardKey = afterTheme.includes("-")
        ? afterTheme.slice(0, afterTheme.lastIndexOf("-"))
        : null
      if (!boardKey) return null
      const board = workspace.boards[boardKey]
      if (!board || board.type !== "theme") return null
      return board.variants.at(-1)?.id ?? null
    }

    case "duplicate_font_collection": {
      const boardKey = fontCollectionBoardKeyFromEntryId(
        payload.fontCollectionId,
      )
      if (!boardKey) return null
      const board = workspace.boards[boardKey]
      if (!board || board.type !== "font-collection") return null
      return board.variants.at(-1)?.id ?? null
    }

    case "set_theme_override":
    case "reset_theme_tokens":
    case "reset_theme_label":
    case "reset_theme_editor_data":
    case "reset_theme_override":
    case "add_theme_custom_swatch":
    case "add_theme_custom_font":
    case "add_theme_custom_border":
    case "add_theme_custom_gradient":
    case "add_theme_custom_shadow":
    case "add_theme_custom_scrollbar":
    case "add_theme_custom_size":
    case "add_theme_custom_dimension":
    case "add_theme_custom_margin":
    case "add_theme_custom_padding":
    case "add_theme_custom_gap":
    case "add_theme_custom_corners":
    case "add_theme_custom_borderWidth":
    case "add_theme_custom_blur":
    case "add_theme_custom_spread":
    case "add_theme_custom_fontSize":
    case "add_theme_custom_fontWeight":
    case "add_theme_custom_lineHeight":
    case "remove_theme_custom_swatch":
    case "remove_theme_custom_font":
    case "remove_theme_custom_border":
    case "remove_theme_custom_gradient":
    case "remove_theme_custom_shadow":
    case "remove_theme_custom_scrollbar":
    case "remove_theme_custom_size":
    case "remove_theme_custom_dimension":
    case "remove_theme_custom_margin":
    case "remove_theme_custom_padding":
    case "remove_theme_custom_gap":
    case "remove_theme_custom_corners":
    case "remove_theme_custom_borderWidth":
    case "remove_theme_custom_blur":
    case "remove_theme_custom_spread":
    case "remove_theme_custom_fontSize":
    case "remove_theme_custom_fontWeight":
    case "remove_theme_custom_lineHeight":
    case "set_workspace_owner":
    case "set_workspace_label":
    case "set_workspace_version":
    case "set_workspace_last_update":
    case "set_workspace_intent":
    case "set_workspace_tags":
    case "set_workspace_license":
    case "reset_workspace_owner":
    case "reset_workspace_label":
    case "normalize_metadata_version":
    case "reset_workspace_last_update":
    case "reset_workspace_intent":
    case "reset_workspace_tags":
    case "reset_workspace_license":
    case "set_board_label":
    case "set_board_intent":
    case "set_board_tags":
    case "set_board_license":
    case "set_board_author":
    case "set_board_credentials":
    case "set_board_preview":
    case "set_board_editor_data":
    case "reset_board_label":
    case "reset_board_intent":
    case "reset_board_tags":
    case "reset_board_license":
    case "reset_board_author":
    case "reset_board_credentials":
    case "reset_board_preview":
    case "reset_board_editor_data":
    case "set_theme_label":
    case "set_theme_editor_data":
    case "set_node_editor_data":
    case "reset_node_label":
    case "reset_node_editor_data":
    case "reorder_variant_in_board":
    case "delete_theme":
    case "stubs_add_font_collection_row":
    case "stubs_remove_font_collection_row":
    case "stubs_set_font_collection_field":
    case "stubs_duplicate_font_collection_row":
    case "stubs_add_media_row":
    case "stubs_remove_media_row":
    case "stubs_set_media_field":
    case "stubs_duplicate_media_row":
    case "set_workspace":
    case "remove_component":
    case "remove_font_collection":
    case "remove_media":
    case "remove_icon_set":
    case "remove_theme":
    case "remove_playground":
    case "reorder_board":
    case "set_node_properties":
    case "reset_node_property":
    case "reset_variant_to_catalog":
    case "reset_instance_to_source":
    case "reset_instance_to_original":
    case "set_component_properties":
    case "reset_component_property":
    case "set_node_label":
    case "set_node_theme":
    case "set_component_theme":
    case "move_instance":
    case "reorder_instance_in_parent":
    case "remove_instance":
    case "remove_variant":
      return null

    default:
      return null
  }
}
