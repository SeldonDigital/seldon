"use client"

import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useResolvedInterfaceMode } from "@app/editor/hooks/use-system-color-scheme"
import { useNodeTheme } from "@app/themes/hooks/use-node-theme"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { Frame } from "@seldon/components/frames/Frame"
import { getVisibleVariantRootIds } from "@seldon/editor/lib/canvas/get-visible-variant-root-ids"
import { resolveComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { useMemo, useRef } from "react"

import { Align, ValueType } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import { resolveFontFamily } from "@seldon/core/helpers/resolution/resolve-font-family"
import { getBoardThemeRef } from "@seldon/core/workspace/helpers/components/get-board-theme-ref"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"

import { CanvasNode } from "../CanvasNode"
import { CssPortal } from "../CssPortal"
import { StyleTag } from "../StyleTag.bespoke"
import { useActiveBoardState } from "../hooks/use-board-state-store"
import { useCanvasReorderFlip } from "../hooks/use-canvas-reorder-flip"

import type { Board } from "@seldon/core"
import type { AlignValue } from "@seldon/core/properties/values/layout/align"
import type { FontFamilyValue } from "@seldon/core/properties/values/typography/font/font-family"
import type { ThemeInstanceId } from "@seldon/core/themes/types"
import type { CSSProperties, ReactNode } from "react"

export type ComponentBoardProps = {
  board: Board
  /**
   * Explicit variant roots to render. Isolation's dependency boards pass the
   * used set; omit to fall back to the selection-driven visible variants.
   */
  variantRootIds?: string[]
  /**
   * Resolve the board key from `board` instead of the current selection. The
   * isolation gallery renders many boards at once, so each must key off itself.
   */
  useOwnKey?: boolean
  /**
   * Caption rendered at the board's top-left. The isolation gallery passes the
   * board name; the normal single-board canvas omits it.
   */
  boardLabel?: string
  /**
   * Canvas size in pixels for the isolation gallery, applied inline so it wins
   * over the board's generated class. The workspace `board` property is
   * untouched, so leaving isolation restores the board's own size.
   */
  boardSize?: IsolationBoardSize
}

export interface IsolationBoardSize {
  width?: number
  height?: number
}

const boardRootStyle: CSSProperties = { position: "static" }
const boardWrapperStyle: CSSProperties = { position: "relative" }

// The board root carries the theme's primary font so canvas text that inherits
// its family (e.g. a cleared `@font.normal` look on Link) follows the active
// theme and updates on theme switch, matching the exported `html/body` base.
const PRIMARY_FONT_FAMILY = {
  type: ValueType.THEME_CATEGORICAL,
  value: "@fontFamily.primary",
} as unknown as FontFamilyValue

const CENTERED_ALIGN: AlignValue = { type: ValueType.OPTION, value: Align.CENTER }

/**
 * Native table-part elements (`<td>`, `<th>`, `<tr>`, `<thead>`, `<tbody>`) are
 * invalid as a direct child of the board `<div>` and trigger a DOM nesting
 * warning when their board is selected. On the canvas only, wrap such a board's
 * roots in the minimal valid table ancestor chain. Export and AI output are
 * unaffected since this lives in the editor.
 */
type TableWrapperKind = "cell" | "row" | "section"
const TABLE_PART_WRAPPERS: Partial<Record<ComponentId, TableWrapperKind>> = {
  [ComponentId.TABLE_DATA]: "cell",
  [ComponentId.TABLE_HEADER]: "cell",
  [ComponentId.TABLE_ROW_DATA]: "row",
  [ComponentId.TABLE_HEAD]: "section",
  [ComponentId.TABLE_BODY]: "section",
}
const tableWrapperStyle: CSSProperties = { width: "100%" }

function wrapTablePartBoard(kind: TableWrapperKind | undefined, children: ReactNode): ReactNode {
  switch (kind) {
    case "cell":
      return (
        <Frame wrapperElement="table" style={tableWrapperStyle}>
          <Frame wrapperElement="tbody">
            <Frame wrapperElement="tr">{children}</Frame>
          </Frame>
        </Frame>
      )
    case "row":
      return (
        <Frame wrapperElement="table" style={tableWrapperStyle}>
          <Frame wrapperElement="tbody">{children}</Frame>
        </Frame>
      )
    case "section":
      return (
        <Frame wrapperElement="table" style={tableWrapperStyle}>
          {children}
        </Frame>
      )
    default:
      return children
  }
}

export function ComponentBoard({
  board,
  variantRootIds: explicitVariantRootIds,
  useOwnKey,
  boardLabel,
  boardSize,
}: ComponentBoardProps) {
  const { workspace } = useWorkspace()
  const { selectedBoardId, selectedNodeRootId } = useSelection()
  const { isolatedView, isolatedBoardKey } = useEditorConfig()
  const resolvedMode = useResolvedInterfaceMode()
  const boardKey = useOwnKey
    ? resolveComponentKey(board, workspace)
    : (selectedBoardId ?? resolveComponentKey(board, workspace))
  const boardEntry = workspace.boards[boardKey] ?? board
  const theme = useNodeTheme(boardEntry)
  const className = `board-${boardKey}`
  // Key the active interaction state by the displayed board's own identity, not
  // the current selection, so switching boards always shows that board's state
  // (Normal until changed) instead of inheriting the previously selected board's.
  const stateBoardKey = resolveComponentKey(board, workspace)
  const activeState = useActiveBoardState(stateBoardKey)
  const boardProperties = getNodeProperties(boardEntry, workspace)
  const boardRootRef = useRef<HTMLDivElement>(null)

  // Isolation sizes each board to hold its node with slack around it, so center
  // the content rather than letting it sit in the top-left corner. The anchored
  // board keeps its own alignment: it is the reference rendering, and the widths
  // of every other board are read from how its nodes lay out. The workspace
  // `align` property is untouched, so leaving isolation restores the board's own
  // alignment.
  const centersContent = isolatedView && boardKey !== isolatedBoardKey
  const properties = centersContent
    ? { ...boardProperties, align: CENTERED_ALIGN }
    : boardProperties

  useCanvasReorderFlip(boardRootRef, workspace)

  const baseFontFamily = useMemo(
    () => resolveFontFamily({ fontFamily: PRIMARY_FONT_FAMILY, theme })?.value,
    [theme],
  )
  const rootStyle = useMemo<CSSProperties>(() => {
    const style: CSSProperties = { ...boardRootStyle }

    if (baseFontFamily) style.fontFamily = baseFontFamily
    if (boardSize?.width) style.width = boardSize.width
    if (boardSize?.height) style.height = boardSize.height

    return style
  }, [baseFontFamily, boardSize?.width, boardSize?.height])

  const visibleVariantRootIds =
    explicitVariantRootIds ??
    getVisibleVariantRootIds(boardEntry, { isolatedView, selectedNodeRootId })
  const tableWrapperKind = TABLE_PART_WRAPPERS[boardKey as ComponentId]
  const initialThemeId = (getBoardThemeRef(boardEntry) ?? "default") as ThemeInstanceId

  // The canvas is pinned to the default (light) theme, so its swatch variables
  // never invert. Pick the interface-mode foreground here so the chrome caption
  // follows the editor mode: dark text in light mode, light text in dark mode.
  const labelColor =
    resolvedMode === "dark" ? "var(--sdn-swatch-offWhite)" : "var(--sdn-swatch-offBlack)"
  const labelStyle = useMemo<CSSProperties>(() => ({ color: labelColor }), [labelColor])
  const labelNode = boardLabel ? (
    <Frame className="isolation-board-label" style={labelStyle}>
      {boardLabel}
    </Frame>
  ) : null

  return (
    <>
      <CssPortal>
        <StyleTag
          css={getCssFromProperties(
            properties,
            {
              theme,
              properties,
              parentContext: null,
            },
            className,
          )}
        />
      </CssPortal>
      <Frame style={boardWrapperStyle}>
        {labelNode}
        <Frame ref={boardRootRef} data-board-id={boardKey} className={className} style={rootStyle}>
          {wrapTablePartBoard(
            tableWrapperKind,
            visibleVariantRootIds.map((variantId) => {
              return (
                <CanvasNode
                  key={variantId}
                  nodeId={variantId}
                  initialThemeId={initialThemeId}
                  parentNode={boardEntry}
                  rootPath={variantId}
                  isRoot
                  activeState={activeState}
                />
              )
            }),
          )}
        </Frame>
      </Frame>
    </>
  )
}
