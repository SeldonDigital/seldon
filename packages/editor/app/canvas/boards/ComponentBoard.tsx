"use client"

import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { CSSProperties, ReactNode, useMemo, useRef } from "react"
import { Board, Properties, Scroll, Unit, ValueType } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import { resolveFontFamily } from "@seldon/core/helpers/resolution/resolve-font-family"
import type { FontFamilyValue } from "@seldon/core/properties/values/typography/font/font-family"
import { ThemeInstanceId } from "@seldon/core/themes/types"
import { getBoardThemeRef } from "@seldon/core/workspace/helpers/components/get-board-theme-ref"
import { getBoardVariantRootIds } from "@seldon/core/workspace/helpers/components/get-board-variant-root-ids"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { useNodeTheme } from "@lib/themes/hooks/use-node-theme"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { usePreview } from "@lib/hooks/use-preview"
import { useActiveBoardState } from "../hooks/use-board-state-store"
import { useCanvasReorderFlip } from "../hooks/use-canvas-reorder-flip"
import { resolveComponentKey } from "@lib/workspace/workspace-accessors"
import { Frame } from "@seldon/components/frames/Frame"
import { CssPortal } from "../CssPortal"
import { CanvasNode } from "../Node"
import { StyleTag } from "../StyleTag.bespoke"

export type ComponentBoardProps = {
  board: Board
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

function wrapTablePartBoard(
  kind: TableWrapperKind | undefined,
  children: ReactNode,
): ReactNode {
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

export function ComponentBoard({ board }: ComponentBoardProps) {
  const { workspace } = useWorkspace()
  const { selectedBoardId } = useSelection()
  const boardKey = selectedBoardId ?? resolveComponentKey(board, workspace)
  const boardEntry = workspace.boards[boardKey] ?? board
  const theme = useNodeTheme(boardEntry)
  const className = `board-${boardKey}`
  // Key the active interaction state by the displayed board's own identity, not
  // the current selection, so switching boards always shows that board's state
  // (Normal until changed) instead of inheriting the previously selected board's.
  const stateBoardKey = resolveComponentKey(board, workspace)
  const activeState = useActiveBoardState(stateBoardKey)
  const properties = getNodeProperties(boardEntry, workspace)
  const { device, isInPreviewMode } = usePreview()
  const boardRootRef = useRef<HTMLDivElement>(null)
  useCanvasReorderFlip(boardRootRef, workspace)

  const baseFontFamily = useMemo(
    () => resolveFontFamily({ fontFamily: PRIMARY_FONT_FAMILY, theme })?.value,
    [theme],
  )
  const rootStyle = useMemo<CSSProperties>(
    () =>
      baseFontFamily
        ? { ...boardRootStyle, fontFamily: baseFontFamily }
        : boardRootStyle,
    [baseFontFamily],
  )

  const patchedProperties: Properties = isInPreviewMode
    ? {
        ...properties,
        board: {
          ...(properties.board ?? {}),
          width: {
            type: ValueType.EXACT,
            value: { unit: Unit.PX, value: device.width },
          },
          height: {
            type: ValueType.EXACT,
            value: { unit: Unit.PX, value: device.height },
          },
        },
        scroll: {
          type: ValueType.OPTION,
          value: Scroll.VERTICAL,
        },
      }
    : properties

  return (
    <>
      <CssPortal>
        <StyleTag
          css={getCssFromProperties(
            patchedProperties,
            {
              theme,
              properties: patchedProperties,
              parentContext: null,
            },
            className,
          )}
        />
      </CssPortal>
      <Frame style={boardWrapperStyle}>
        <Frame
          ref={boardRootRef}
          data-board-id={boardKey}
          className={className}
          style={rootStyle}
        >
          {wrapTablePartBoard(
            TABLE_PART_WRAPPERS[boardKey as ComponentId],
            getBoardVariantRootIds(boardEntry).map((variantId) => {
              return (
                <CanvasNode
                  key={variantId}
                  nodeId={variantId}
                  initialThemeId={
                    (getBoardThemeRef(boardEntry) ??
                      "default") as ThemeInstanceId
                  }
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
