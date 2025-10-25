"use client"

import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { Board, Properties, Scroll, Unit, ValueType } from "@seldon/core"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"
import { themeService } from "@seldon/core/workspace/services/theme.service"
import { usePreview } from "@lib/hooks/use-preview"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { CssPortal } from "./CssPortal"
import { CanvasNode } from "./Node"

export type CanvasBoardProps = {
  board: Board
}
export function CanvasBoard({ board }: CanvasBoardProps) {
  const { workspace } = useWorkspace()
  const theme = themeService.getObjectTheme(board, workspace)
  const className = `board-${board.id}`
  const properties = getNodeProperties(board, workspace)
  const { device, isInPreviewMode } = usePreview()

  const patchedProperties: Properties = isInPreviewMode
    ? {
        ...properties,
        screenWidth: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: device.width },
        },
        screenHeight: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: device.height },
        },
        scroll: {
          type: ValueType.PRESET,
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
        data-board-id={board.id}
        className={className}
        style={{ position: "static" }}
      >
        {Object.values(board.variants).map((variantId) => {
          return (
            <CanvasNode
              key={variantId}
              nodeId={variantId}
              initialThemeId={board.theme}
              parentNode={board}
              isRoot
            />
          )
        })}
      </div>
    </>
  )
}
