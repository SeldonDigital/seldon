"use client"

import { MenuEntry } from "@lib/menus"
import { CSSProperties, useCallback } from "react"
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
import { RowActionsMenu } from "../shared/RowActionsMenu"
import { useResourceEntryRow } from "./hooks/use-resource-entry-row"
import { useRowClick } from "./hooks/use-row-click"
import { SelectionKind } from "@lib/workspace/selection-target"
import { NodeRow, SidebarRow } from "@seldon/components/custom-components"
import { IconProps } from "@seldon/components/custom-components"
import { TextLabelProps } from "@seldon/components/primitives/TextLabel"
import { Combobox } from "../properties/controls/combobox/Combobox"

const rowWrapperStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
}

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

type RowResourceEntryProps = {
  config: ResourceRowConfig
  entryId: string
  show?: boolean
  parentIsSelected?: boolean
}

/**
 * One resource board variant entry (theme, font collection, icon set, or
 * media). Renders as a leaf row: the board shows its default entry and custom
 * variants. Selecting the row highlights and scrolls to its canvas preview.
 */
export function RowResourceEntry({
  config,
  entryId,
  show = true,
  parentIsSelected = false,
}: RowResourceEntryProps) {
  const { workspace, dispatch } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()
  const { selectResourceEntry } = useSelection()
  const { isEditingName, setEditingName, submitLabel } = useResourceEntryRow(
    config,
    entryId,
  )

  const isSelected = useIsResourceEntrySelected(config.kind, entryId)
  const isActive = parentIsSelected || isSelected

  const onClick = useRowClick({
    activeTool,
    onSelect: () => selectResourceEntry(config.kind, entryId),
  })

  const entry = config.getEntry(workspace, entryId)
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

  if (!show || !entry) return null

  // Mirrors resettable variant nodes: the selected default entry always offers
  // "Reset to Catalog" (idempotent without overrides), a selected variant entry
  // offers "Reset to Default" only when it carries overrides.
  const buildResetAction = config.buildResetAction
  const canReset =
    Boolean(buildResetAction) &&
    isSelected &&
    (entry.isDefault || entry.hasOverrides === true)
  const resetActions: MenuEntry[] =
    buildResetAction && canReset
      ? [
          {
            id: "reset",
            label: entry.isDefault ? "Reset to Catalog" : "Reset to Default",
            onSelect: () => dispatch(buildResetAction(entryId)),
            testId: `${config.testId}-${entryId}-reset`,
          },
        ]
      : []

  const actionsSlot =
    resetActions.length > 0 ? (
      <RowActionsMenu items={resetActions} color={iconColor} />
    ) : undefined

  const icon2: IconProps = {
    icon: config.icon,
    ...(iconColor ? { style: { color: iconColor } } : {}),
  }

  const labelChildren =
    isEditingName && config.buildLabelAction ? (
      <Combobox
        mode="standalone"
        initialValue={entry.label}
        onSubmit={submitLabel}
      />
    ) : (
      entry.label
    )

  const textLabel = {
    children: labelChildren,
    ...(labelColor ? { style: { color: labelColor } } : {}),
  } as unknown as TextLabelProps

  return (
    <SidebarRow
      style={rowWrapperStyle}
      selectionId={entryId}
      selectionKind={config.selectionKind}
    >
      <NodeRow
        buttonIconic={{}}
        icon={{ style: { color: "transparent" } }}
        icon2={icon2}
        textLabel={textLabel}
        actionsSlot={actionsSlot}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        data-testid={config.testId}
        data-resource-entry-id={entryId}
        data-resource-kind={config.kind}
        data-active={isActive}
        style={combinedRowStyle}
      />
    </SidebarRow>
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
