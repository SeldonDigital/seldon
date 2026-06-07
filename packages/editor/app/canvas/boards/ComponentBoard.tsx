"use client"

import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { Board, Properties, Scroll, Unit, ValueType } from "@seldon/core"
import { ThemeId } from "@seldon/core/themes/types"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { getBoardThemeRef } from "@seldon/core/workspace/helpers/components/get-board-theme-ref"
import { getBoardVariantRootIds } from "@seldon/core/workspace/helpers/components/get-board-variant-root-ids"
import { resolveComponentKey } from "@lib/workspace/workspace-accessors"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import { usePreview } from "@lib/hooks/use-preview"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { CssPortal } from "../CssPortal"
import { CanvasNode } from "../Node"

export type ComponentBoardProps = {
  board: Board
}
export function ComponentBoard({ board }: ComponentBoardProps) {
  const { workspace } = useWorkspace()
  const { selectedBoardId } = useSelection()
  const boardKey =
    selectedBoardId ?? resolveComponentKey(board, workspace)
  const boardEntry = workspace.components[boardKey] ?? board
  const theme = workspaceThemeService.getObjectTheme(boardEntry, workspace)
  const className = `board-${boardKey}`
  const properties = getNodeProperties(boardEntry, workspace)
  const { device, isInPreviewMode } = usePreview()

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
        <style>
          {getCssFromProperties(
            patchedProperties,
            {
              theme,
              properties: patchedProperties,
              parentContext: null,
            },
            className,
          )}
        </style>
      </CssPortal>
      <div
        data-board-id={boardKey}
        className={className}
        style={{ position: "static" }}
      >
        {getBoardVariantRootIds(boardEntry).map((variantId) => {
          return (
            <CanvasNode
              key={variantId}
              nodeId={variantId}
              initialThemeId={
                (getBoardThemeRef(boardEntry) ?? "default") as ThemeId
              }
              parentNode={boardEntry}
              isRoot
            />
          )
        })}
      </div>
    </>
  )
}
