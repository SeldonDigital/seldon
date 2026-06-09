"use client"

import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { CSSProperties, useRef } from "react"
import { Board, Properties, Scroll, Unit, ValueType } from "@seldon/core"
import { ThemeInstanceId } from "@seldon/core/themes/types"
import { getBoardThemeRef } from "@seldon/core/workspace/helpers/components/get-board-theme-ref"
import { getBoardVariantRootIds } from "@seldon/core/workspace/helpers/components/get-board-variant-root-ids"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
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
        {getBoardVariantRootIds(boardEntry).map((variantId) => {
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
        })}
      </BoardCanvasFrame>
    </>
  )
}
