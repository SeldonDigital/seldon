"use client"

import { getIconSheetPreviewBase } from "@lib/icon-sets/build-icon-sheet-preview"
import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { useMemo } from "react"
import { Board, Properties, Scroll, Unit, ValueType } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import type { IconId } from "@seldon/core/icon-sets"
import { iconLabels } from "@seldon/core/icon-sets"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import type { Workspace } from "@seldon/core/workspace/types"
import { useNodeTheme } from "@app/themes/hooks/use-node-theme"
import { formatResourceItemKey } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { usePreview } from "@app/hooks/use-preview"
import { useIconSetBoardIcons } from "../hooks/use-icon-set-board-icons"
import { getNodeCatalogComponentId } from "@lib/workspace/node-tree"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { Frame } from "@seldon/components/frames/Frame"
import { CssPortal } from "../CssPortal"
import { StyleTag } from "../StyleTag.bespoke"
import { canvasSelectionId } from "../helpers/canvas-selection-target"
import { BoardPreviewNode } from "./BoardPreviewNode"
import { PreviewItemWrapper } from "./PreviewItemWrapper"
import { injectBoardBackground } from "./inject-board-background"

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
  const { device, isInPreviewMode } = usePreview()

  const boardTheme = useNodeTheme(board)
  const icons = useIconSetBoardIcons(board)

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
        <StyleTag css={boardCss} />
      </CssPortal>
      <Frame
        data-board-id={boardKey}
        className={className}
        style={{
          position: "static",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "flex-start",
          alignContent: "flex-start",
          minHeight: "100%",
          padding: "2rem",
        }}
      >
        {icons.map(({ entryId, iconId }) => {
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
        })}
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

  const label = iconLabels[iconId as keyof typeof iconLabels] ?? iconId

  const previewWorkspace = useMemo(() => {
    if (!rootId) {
      return null
    }
    const nodes = Object.fromEntries(
      Object.entries(iconBase.nodes).map(([id, node]) => {
        const isIcon =
          getNodeCatalogComponentId(node, iconBase) === ComponentId.ICON
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
      <BoardPreviewNode
        nodeId={rootId}
        workspace={previewWorkspace}
        scope={scope}
        isRoot
      />
    </PreviewItemWrapper>
  )
}
