"use client"

import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { CSSProperties, ReactNode, useRef } from "react"
import { Board, Properties, Scroll, Unit, ValueType } from "@seldon/core"
import { ThemeInstanceId } from "@seldon/core/themes/types"
import { getBoardThemeRef } from "@seldon/core/workspace/helpers/components/get-board-theme-ref"
import { getBoardVariantRootIds } from "@seldon/core/workspace/helpers/components/get-board-variant-root-ids"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import { ComponentId } from "@seldon/core/components/constants"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { usePreview } from "@lib/hooks/use-preview"
import { useCanvasReorderFlip } from "../hooks/use-canvas-reorder-flip"
import { resolveComponentKey } from "@lib/workspace/workspace-accessors"
import {
  BoardCanvasFrame,
  StyleTag,
} from "@seldon/components/custom-components"
import { CssPortal } from "../CssPortal"
import { CanvasNode } from "../Node"

export type ComponentBoardProps = {
  board: Board
}

const boardRootStyle: CSSProperties = { position: "static" }

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
        <table style={tableWrapperStyle}>
          <tbody>
            <tr>{children}</tr>
          </tbody>
        </table>
      )
    case "row":
      return (
        <table style={tableWrapperStyle}>
          <tbody>{children}</tbody>
        </table>
      )
    case "section":
      return <table style={tableWrapperStyle}>{children}</table>
    default:
      return children
  }
}

export function ComponentBoard({ board }: ComponentBoardProps) {
  const { workspace } = useWorkspace()
  const { selectedBoardId } = useSelection()
  const boardKey = selectedBoardId ?? resolveComponentKey(board, workspace)
  const boardEntry = workspace.boards[boardKey] ?? board
  const theme = workspaceThemeService.getObjectTheme(boardEntry, workspace)
  const className = `board-${boardKey}`
  const properties = getNodeProperties(boardEntry, workspace)
  const { device, isInPreviewMode } = usePreview()
  const boardRootRef = useRef<HTMLDivElement>(null)
  useCanvasReorderFlip(boardRootRef, workspace)

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
      <BoardCanvasFrame
        ref={boardRootRef}
        boardId={boardKey}
        className={className}
        style={boardRootStyle}
      >
        {wrapTablePartBoard(
          TABLE_PART_WRAPPERS[boardKey as ComponentId],
          getBoardVariantRootIds(boardEntry).map((variantId) => {
            return (
              <CanvasNode
                key={variantId}
                nodeId={variantId}
                initialThemeId={
                  (getBoardThemeRef(boardEntry) ?? "default") as ThemeInstanceId
                }
                parentNode={boardEntry}
                rootPath={variantId}
                isRoot
              />
            )
          }),
        )}
      </BoardCanvasFrame>
    </>
  )
}
