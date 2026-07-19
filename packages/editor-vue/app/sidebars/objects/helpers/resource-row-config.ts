import type { Action, Board as BoardType } from "@seldon/core"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { isEntryFontCollectionDefault } from "@seldon/core/workspace/model/entry-font-collection"
import { isEntryIconSetDefault } from "@seldon/core/workspace/model/entry-icon-set"
import { isEntryThemeDefault } from "@seldon/core/workspace/model/entry-theme"
import type { Workspace } from "@seldon/core/workspace/types"
import type { ResourceEntryKind } from "@app/workspace/selection-store"

type ResolvedEntry = {
  label: string
  isDefault: boolean
  /** Whether the entry carries its own overrides; gates variant reset. */
  hasOverrides?: boolean
}

/**
 * Per-resource variation points for an entry row. The row body is identical
 * across resources; only data access, selection kind, icon, and the rename
 * action differ. Omitting `buildLabelAction` disables rename (media stub).
 * Ported from the React `resource-row-config`.
 */
export interface ResourceRowConfig {
  kind: ResourceEntryKind
  icon: string
  testId: string
  getEntry: (workspace: Workspace, entryId: string) => ResolvedEntry | undefined
  buildLabelAction?: (entryId: string, label: string) => Action
  buildResetAction?: (entryId: string) => Action
  buildDuplicateAction?: (entryId: string) => Action
  buildDeleteAction?: (entryId: string) => Action
}

const RESOURCE_ROW_CONFIG: Record<ResourceEntryKind, ResourceRowConfig> = {
  theme: {
    kind: "theme",
    icon: "seldon-theme",
    testId: "objects-sidebar-theme-entry",
    getEntry: (workspace, entryId) => {
      const entry = workspace.themes[entryId]
      if (!entry) return undefined
      return {
        label: entry.label,
        isDefault: isEntryThemeDefault(entry),
        hasOverrides: Object.keys(entry.overrides).length > 0,
      }
    },
    buildLabelAction: (entryId, label) => ({
      type: "set_theme_label",
      payload: { themeId: entryId, label },
    }),
    buildResetAction: (entryId) => ({
      type: "reset_theme_tokens",
      payload: { themeId: entryId },
    }),
    buildDuplicateAction: (entryId) => ({
      type: "duplicate_theme",
      payload: { themeId: entryId },
    }),
    buildDeleteAction: (entryId) => ({
      type: "delete_theme",
      payload: { themeId: entryId },
    }),
  },
  fontCollection: {
    kind: "fontCollection",
    icon: "seldon-text",
    testId: "objects-sidebar-font-collection-entry",
    getEntry: (workspace, entryId) => {
      const entry = workspace["font-collections"][entryId]
      if (!entry) return undefined
      return {
        label: entry.label,
        isDefault: isEntryFontCollectionDefault(entry),
      }
    },
    buildLabelAction: (entryId, label) => ({
      type: "set_font_collection_label",
      payload: { fontCollectionId: entryId, label },
    }),
    buildResetAction: (entryId) => ({
      type: "reset_font_collection",
      payload: { fontCollectionId: entryId },
    }),
    buildDuplicateAction: (entryId) => ({
      type: "duplicate_font_collection",
      payload: { fontCollectionId: entryId },
    }),
    buildDeleteAction: (entryId) => ({
      type: "delete_font_collection",
      payload: { fontCollectionId: entryId },
    }),
  },
  iconSet: {
    kind: "iconSet",
    icon: "seldon-icon",
    testId: "objects-sidebar-icon-set-entry",
    getEntry: (workspace, entryId) => {
      const entry = workspace["icon-sets"][entryId]
      if (!entry) return undefined
      return { label: entry.label, isDefault: isEntryIconSetDefault(entry) }
    },
    buildLabelAction: (entryId, label) => ({
      type: "set_icon_set_label",
      payload: { iconSetId: entryId, label },
    }),
    buildResetAction: (entryId) => ({
      type: "reset_icon_set",
      payload: { iconSetId: entryId },
    }),
    buildDuplicateAction: (entryId) => ({
      type: "duplicate_icon_set",
      payload: { iconSetId: entryId },
    }),
    buildDeleteAction: (entryId) => ({
      type: "delete_icon_set",
      payload: { iconSetId: entryId },
    }),
  },
  // Media stub: no label/type yet and no media board renders, so the row is
  // read-only (no rename) and falls back to the id.
  media: {
    kind: "media",
    icon: "seldon-component",
    testId: "objects-sidebar-media-entry",
    getEntry: (workspace, entryId) => {
      const entry = workspace.media[entryId]
      if (!entry) return undefined
      return { label: entry.id, isDefault: true }
    },
  },
}

/**
 * Resource-entry row config for a board, or null when the board's children are
 * component variants rather than resource entries.
 */
export function getBoardResourceRowConfig(
  board: BoardType,
): ResourceRowConfig | null {
  if (isThemeBoard(board)) return RESOURCE_ROW_CONFIG.theme
  if (isFontCollectionBoard(board)) return RESOURCE_ROW_CONFIG.fontCollection
  if (isIconSetBoard(board)) return RESOURCE_ROW_CONFIG.iconSet
  if (isMediaBoard(board)) return RESOURCE_ROW_CONFIG.media
  return null
}
