"use client"

import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { Board, Properties, Scroll, Unit, ValueType } from "@seldon/core"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { themeService } from "@seldon/core/workspace/services/theme/theme.service"
import { usePreview } from "@lib/hooks/use-preview"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { Frame } from "../../seldon/chrome/frames/Frame"
import { CssPortal } from "../CssPortal"

export type IconSetBoardPlaceholderProps = {
  board: Board
}

export function IconSetBoardPlaceholder({ board }: IconSetBoardPlaceholderProps) {
  const { workspace } = useWorkspace()
  const theme = themeService.getObjectTheme(board, workspace)
  const boardKey = getComponentKey(board)
  const className = `board-${boardKey}`
  const properties = getNodeProperties(board, workspace)
  const { device, isInPreviewMode } = usePreview()

  const computedProperties: Properties = isInPreviewMode
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

  const boardCss = getCssFromProperties(
    computedProperties,
    {
      theme,
      properties: computedProperties,
      parentContext: null,
    },
    className,
  )

  return (
    <>
      <CssPortal>
        <style>{boardCss}</style>
      </CssPortal>
      <Frame
        data-board-id={boardKey}
        className={className}
        style={{
          position: "static",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100%",
        }}
      >
        <p
          style={{
            fontFamily: "IBM Plex Sans",
            fontSize: "0.875rem",
            color: "hsl(0deg 0% 100% / 0.6)",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          Icon set editing is not available yet in this workspace format.
        </p>
      </Frame>
    </>
  )
}
