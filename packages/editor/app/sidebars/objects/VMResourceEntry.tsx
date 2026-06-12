"use client"

import { MenuEntry } from "@lib/menus"
import { useCallback, useRef } from "react"
import { Board as BoardType, Variant } from "@seldon/core"
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
import { useRowHighlightStyle } from "@lib/workspace/hooks/use-object-hover"
import {
  ResourceEntryKind,
  useIsResourceEntrySelected,
  useSelection,
} from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useTool } from "@lib/hooks/use-tool"
import { useSidebarRowStyling } from "../../tracking/hooks/use-sidebar-row-styling"
import { useRowActionsMenu } from "../shared/use-row-actions-menu"
import { useResourceEntryRow } from "./hooks/use-resource-entry-row"
import { useRowClick } from "./hooks/use-row-click"
import { SelectionKind } from "@lib/workspace/selection-target"
import { RowSelectionTarget } from "./RowSelectionTarget"
import { ItemNodeRow } from "@seldon/components/elements/ItemNodeRow"
import { IconProps } from "@seldon/components/primitives/Icon"
import { TextLabelProps } from "@seldon/components/primitives/TextLabel"
import { rowWrapperStyle } from "../helpers/sidebar-row-styles"
import { useInlineRename } from "../hooks/use-inline-rename"

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
}

type VMResourceEntryProps = {
  config: ResourceRowConfig
  entryId: string
  show?: boolean
  parentIsSelected?: boolean
}

/**
 * View-model for one resource board variant entry (theme, font collection,
 * icon set, or media). Renders as a leaf row: the board shows its default
 * entry and custom variants. Selecting the row highlights and scrolls to its
 * canvas preview.
 */
export function VMResourceEntry({
  config,
  entryId,
  show = true,
  parentIsSelected = false,
}: VMResourceEntryProps) {
  const { workspace } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()
  const { selectResourceEntry } = useSelection()
  const isSelected = useIsResourceEntrySelected(config.kind, entryId)
  const entry = config.getEntry(workspace, entryId)

  const { isEditingName, setEditingName, submitLabel, resetActions } =
    useResourceEntryRow({
      config,
      entryId,
      entry,
      isSelected,
    })
  const isActive = parentIsSelected || isSelected

  const onClick = useRowClick({
    activeTool,
    onSelect: () => selectResourceEntry(config.kind, entryId),
  })

  const canRename = Boolean(config.buildLabelAction) && !entry?.isDefault

  const onDoubleClick = useCallback(() => {
    if (canRename) {
      setEditingName(true)
    }
  }, [canRename, setEditingName])

  const { rowStyle, iconColor, labelColor } = useSidebarRowStyling(
    { id: entryId } as unknown as Variant,
    { isSelected },
  )
  const hoverStyle = useRowHighlightStyle(entryId, isSelected)
  const combinedRowStyle = { ...hoverStyle, ...rowStyle }

  const rowRef = useRef<HTMLDivElement>(null)

  const actionsMenu = useRowActionsMenu(resetActions, {
    color: iconColor,
    focusTargetRef: rowRef,
  })

  if (!show || !entry) return null

  const icon2: IconProps = {
    icon: config.icon,
    ...(iconColor ? { style: { color: iconColor } } : {}),
  }

  const { labelChildren: renameLabel } = useInlineRename({
    label: entry?.label ?? "",
    isEditing: isEditingName && Boolean(config.buildLabelAction),
    setEditing: setEditingName,
    onSubmit: submitLabel,
  })

  const labelChildren =
    isEditingName && config.buildLabelAction ? renameLabel : entry.label

  const textLabel = {
    children: labelChildren,
    ...(labelColor ? { style: { color: labelColor } } : {}),
  } as unknown as TextLabelProps

  return (
    <>
      <RowSelectionTarget
        ref={rowRef}
        style={rowWrapperStyle}
        selectionId={entryId}
        selectionKind={config.selectionKind}
      >
        <ItemNodeRow
          buttonIconic={{}}
          icon={{
            icon: "material-chevronRight",
            style: { color: "transparent" },
          }}
          icon2={icon2}
          textLabel={textLabel}
          buttonIconic2={null}
          icon3={null}
          buttonIconic3={actionsMenu.buttonIconic}
          icon4={actionsMenu.icon}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          data-testid={config.testId}
          data-resource-entry-id={entryId}
          data-resource-kind={config.kind}
          data-active={isActive}
          style={combinedRowStyle}
        />
      </RowSelectionTarget>
      {actionsMenu.menu}
    </>
  )
}

/** Per-kind row configuration. Keyed by resource board type. */
export const RESOURCE_ROW_CONFIG: Record<ResourceEntryKind, ResourceRowConfig> =
  {
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
