import { Board as BoardType } from "@seldon/core"
import { Action } from "@seldon/core/index"
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
import { ResourceEntryKind } from "@lib/workspace/hooks/use-selection"
import { SelectionKind } from "@lib/workspace/selection-target"
import { IconProps } from "@seldon/components/primitives/Icon"

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
 */
export interface ResourceRowConfig {
  kind: ResourceEntryKind
  selectionKind: SelectionKind
  icon: IconProps["icon"]
  testId: string
  getEntry: (workspace: Workspace, entryId: string) => ResolvedEntry | undefined
  buildLabelAction?: (entryId: string, label: string) => Action
  /**
   * Gives the selected entry a reset row action, mirroring resettable variant
   * nodes: "Reset to Catalog" on the default entry, "Reset to Default" on a
   * variant entry with overrides. Omitting it disables reset.
   */
  buildResetAction?: (entryId: string) => Action
  /** Duplicates the entry into a new variant. Available on default and custom entries. */
  buildDuplicateAction?: (entryId: string) => Action
  /** Deletes a custom variant entry. Never offered on the default entry. */
  buildDeleteAction?: (entryId: string) => Action
}

/** Per-kind row configuration. Keyed by resource board type. */
const RESOURCE_ROW_CONFIG: Record<ResourceEntryKind, ResourceRowConfig> = {
  theme: {
    kind: "theme",
    selectionKind: "theme",
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
    selectionKind: "fontCollection",
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
    selectionKind: "iconSet",
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
  // Media stub: the media entry model has no label/type yet and no media board
  // renders, so the row is read-only (no rename) and falls back to the id.
  media: {
    kind: "media",
    selectionKind: "media",
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
 * Resolves the resource-entry row config for a board, or null when the board's
 * children are component variants rather than resource entries.
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
