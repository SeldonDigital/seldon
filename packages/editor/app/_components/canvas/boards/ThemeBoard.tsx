"use client"

import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { useMemo } from "react"
import { Board, Properties, Scroll, Unit, ValueType } from "@seldon/core"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { isThemeBoard } from "@seldon/core/workspace/model/components"
import { themeService } from "@seldon/core/workspace/services/theme/theme.service"
import type { Workspace } from "@seldon/core/workspace/types"
import { getDialogPreviewBase } from "@lib/themes/build-dialog-preview"
import { usePreview } from "@lib/hooks/use-preview"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { Frame } from "../../seldon/frames/Frame"
import { CssPortal } from "../CssPortal"
import { BoardPreviewNode } from "./BoardPreviewNode"

export type ThemeBoardProps = {
  board: Board
}

/**
 * Theme board canvas: board chrome and a placeholder until a v0 preview fixture exists.
 */
export function ThemeBoard({ board }: ThemeBoardProps) {
  const { workspace } = useWorkspace()
  const boardKey = getComponentKey(board)
  const className = `board-${boardKey}`
  const properties = getNodeProperties(board, workspace)
  const { device, isInPreviewMode } = usePreview()

  // The board chrome renders with the board's own theme so its background and
  // border resolve, independent of which variant (if any) is selected. The
  // per-variant dialogs below are themed individually.
  const boardTheme = useMemo(
    () => themeService.getObjectTheme(board, workspace),
    [board, workspace],
  )

  const variantEntryIds = isThemeBoard(board)
    ? board.variants.map((variant) => variant.id)
    : []

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
      theme: boardTheme ?? undefined,
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
          flexWrap: "wrap",
          gap: "2rem",
          alignItems: "flex-start",
          justifyContent: "center",
          minHeight: "100%",
          padding: "2rem",
        }}
      >
        {variantEntryIds.map((variantEntryId) => (
          <ThemeVariantDialog
            key={variantEntryId}
            variantEntryId={variantEntryId}
            themes={workspace.themes}
          />
        ))}
      </Frame>
    </>
  )
}

type ThemeVariantDialogProps = {
  variantEntryId: string
  themes: Workspace["themes"]
}

/**
 * Renders a single Dialog preview themed by one workspace theme entry.
 */
function ThemeVariantDialog({ variantEntryId, themes }: ThemeVariantDialogProps) {
  const { workspace: dialogBase, rootId } = getDialogPreviewBase()

  const previewWorkspace = useMemo(() => {
    if (!rootId) {
      return null
    }
    const root = dialogBase.nodes[rootId]
    return {
      ...dialogBase,
      themes,
      nodes: {
        ...dialogBase.nodes,
        [rootId]: { ...root, theme: variantEntryId },
      },
    } as Workspace
  }, [dialogBase, rootId, themes, variantEntryId])

  if (!previewWorkspace || !rootId) {
    return null
  }

  return (
    <BoardPreviewNode
      nodeId={rootId}
      workspace={previewWorkspace}
      scope={variantEntryId}
      isRoot
    />
  )
}
