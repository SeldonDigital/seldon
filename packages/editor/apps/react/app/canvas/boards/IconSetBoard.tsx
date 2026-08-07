"use client"

import { useNodeTheme } from "@app/themes/hooks/use-node-theme"
import { formatResourceItemKey } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { Frame } from "@seldon/components/frames/Frame"
import { canvasSelectionId } from "@seldon/editor/lib/canvas/overlay/selection-target"
import { getIconSheetPreviewBase } from "@seldon/editor/lib/icon-sets/build-icon-sheet-preview"
import { getNodeCatalogComponentId } from "@seldon/editor/lib/workspace/node-tree"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { getCssObjectFromProperties } from "@seldon/factory/styles/css-properties/get-css-object-from-properties"
import { useMemo } from "react"

import { ValueType } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import { getIconLabel } from "@seldon/core/icon-sets"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"

import { CssPortal } from "../CssPortal"
import { StyleTag } from "../StyleTag.bespoke"
import { useIconSetBoardIcons } from "../hooks/use-icon-set-board-icons"
import { BoardPreviewNode } from "./BoardPreviewNode"
import { PreviewItemWrapper } from "./PreviewItemWrapper"
import { injectBoardBackground } from "./inject-board-background"

import type { Board, Properties } from "@seldon/core"
import type { IconId } from "@seldon/core/icon-sets"
import type { Workspace } from "@seldon/core/workspace/types"
import type { CSSProperties } from "react"

/**
 * Cap on previews rendered per icon set board. Each preview renders a full
 * themed Icon component tree, so an unbounded "enable all" on a large set
 * (thousands of icons) would mount thousands of trees and can hang or crash the
 * tab. The cap bounds render cost; the symbol picker still reaches every enabled
 * icon. Set comfortably above the default curated sets.
 */
const MAX_RENDERED_BOARD_ICONS = 750

const ICON_SET_OVERFLOW_STYLE: CSSProperties = {
  width: "100%",
  padding: "1rem",
  fontStyle: "italic",
  opacity: 0.7,
}

// Fallback board layout: a wrapping horizontal grid of icon previews. The
// board's own component properties (orientation, align, margin, padding, gap,
// wrap, clip, background) are resolved to CSS and spread over this, so any
// LAYOUT control the user sets wins while an unset property keeps this default.
// `position` and `minHeight` are canvas-only and always stay.
const boardLayoutFallback: CSSProperties = {
  position: "static",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "1rem",
  alignItems: "flex-start",
  alignContent: "flex-start",
  minHeight: "100%",
  padding: "2rem",
}

export type IconSetBoardProps = {
  board: Board
}

/**
 * Icon set board canvas: board chrome plus one Icon preview per included icon.
 * The icons wrap into a grid and show their name in a hover tooltip. Mirrors the
 * font collection board, swapping the Type Specimen preview for an Icon preview.
 */
export function IconSetBoard({ board }: IconSetBoardProps) {
  const { workspace } = useWorkspace()
  const boardKey = getComponentKey(board)
  const className = `board-${boardKey}`
  const properties = getNodeProperties(board, workspace)

  const boardTheme = useNodeTheme(board)
  const icons = useIconSetBoardIcons(board)

  const styleContext = {
    theme: boardTheme ?? undefined,
    properties,
    parentContext: null,
  }
  const boardCss = getCssFromProperties(properties, styleContext, className)

  // Resolve the board's own component properties to CSS and layer them over the
  // fallback, so Direction, Orientation, Align, Margin, Padding, Gap, Wrap, and
  // Clip take effect. Unset properties are absent here and keep the fallback.
  const resolvedBoardStyle = getCssObjectFromProperties(properties, styleContext) as CSSProperties
  const boardStyle: CSSProperties = { ...boardLayoutFallback, ...resolvedBoardStyle }

  const visibleIcons =
    icons.length > MAX_RENDERED_BOARD_ICONS ? icons.slice(0, MAX_RENDERED_BOARD_ICONS) : icons
  const overflowCount = icons.length - visibleIcons.length
  const overflowLabel = `Showing ${visibleIcons.length} of ${icons.length} icons. Turn off categories in this icon set to preview the rest.`

  const iconPreviews = visibleIcons.map(({ entryId, iconId }) => {
    const selectionKey = formatResourceItemKey({
      resource: "icon-set",
      boardKey: boardKey,
      entryId,
      slot: iconId,
    })

    return (
      <IconPreview
        key={`${entryId}-${iconId}`}
        scope={`${boardKey}-${entryId}-${iconId}`}
        entryId={entryId}
        resourceItemKey={selectionKey}
        iconId={iconId}
        themes={workspace.themes}
        boardThemeId={board.componentTheme}
        boardBackground={properties.background}
      />
    )
  })

  const overflowNotice =
    overflowCount > 0 ? (
      <div className={`${className}-overflow`} style={ICON_SET_OVERFLOW_STYLE}>
        {overflowLabel}
      </div>
    ) : null

  return (
    <>
      <CssPortal>
        <StyleTag css={boardCss} />
      </CssPortal>
      <Frame data-board-id={boardKey} className={className} style={boardStyle}>
        {iconPreviews}
        {overflowNotice}
      </Frame>
    </>
  )
}

type IconPreviewProps = {
  scope: string
  entryId: string
  resourceItemKey: string
  iconId: IconId
  themes: Workspace["themes"]
  boardThemeId: string
  /**
   * Board background injected onto the preview workspace's board so the Icon's
   * `HIGH_CONTRAST_COLOR` resolves against the board surface instead of the
   * preview component board's transparent default.
   */
  boardBackground: Properties["background"]
}

/**
 * Renders a single Icon preview for one icon.
 *
 * The icon id is injected as a `symbol` override on every Icon node of the
 * cloned preview workspace, so the preview shows that icon. The icon name is
 * shown in a hover tooltip. Mirrors the font collection type specimen, swapping
 * the injected property.
 */
function IconPreview({
  scope,
  entryId,
  resourceItemKey,
  iconId,
  themes,
  boardThemeId,
  boardBackground,
}: IconPreviewProps) {
  const { workspace: iconBase, rootId } = getIconSheetPreviewBase()

  const label = getIconLabel(iconId)

  const previewWorkspace = useMemo(() => {
    if (!rootId) {
      return null
    }

    const nodes = Object.fromEntries(
      Object.entries(iconBase.nodes).map(([id, node]) => {
        const isIcon = getNodeCatalogComponentId(node, iconBase) === ComponentId.ICON

        return [
          id,
          {
            ...node,
            overrides: {
              ...node.overrides,
              ...(isIcon
                ? {
                    symbol: { type: ValueType.OPTION, value: iconId },
                  }
                : {}),
            },
            ...(id === rootId ? { theme: boardThemeId } : {}),
          },
        ]
      }),
    )

    return {
      ...iconBase,
      themes,
      nodes,
      boards: injectBoardBackground(iconBase.boards, boardBackground),
    } as Workspace
  }, [iconBase, rootId, themes, boardThemeId, iconId, boardBackground])

  if (!previewWorkspace || !rootId) {
    return null
  }

  return (
    <PreviewItemWrapper
      title={label}
      canvasSelectionId={canvasSelectionId(resourceItemKey, entryId)}
      selectionId={resourceItemKey}
      selectionKind="resourceItem"
    >
      <BoardPreviewNode nodeId={rootId} workspace={previewWorkspace} scope={scope} isRoot />
    </PreviewItemWrapper>
  )
}
