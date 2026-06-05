"use client"

import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { useMemo } from "react"
import { Board, Properties, Scroll, Unit, ValueType } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import type { IconId } from "@seldon/core/icon-sets"
import { iconLabels } from "@seldon/core/icon-sets"
import { isIconSetBoard } from "@seldon/core/workspace/model/components"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { themeService } from "@seldon/core/workspace/services/theme/theme.service"
import { workspaceIconSetService } from "@seldon/core/workspace/services/icon-set/icon-set.service"
import type { Workspace } from "@seldon/core/workspace/types"
import { getIconSheetPreviewBase } from "@lib/icon-sets/build-icon-sheet-preview"
import { usePreview } from "@lib/hooks/use-preview"
import { getNodeCatalogComponentId } from "@lib/workspace/node-tree"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { formatResourceItemKey } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { Frame } from "../../seldon/chrome/frames/Frame"
import { CssPortal } from "../CssPortal"
import { canvasSelectionId } from "../helpers/canvas-selection-target"
import { BoardPreviewNode } from "./BoardPreviewNode"

export type IconSetBoardProps = {
  board: Board
}

/**
 * Icon set board canvas: board chrome plus one Iconic Avatar preview per
 * included icon. The avatars wrap into a grid. Mirrors the font collection
 * board, swapping the Type Specimen preview for an Iconic Avatar preview.
 */
export function IconSetBoard({ board }: IconSetBoardProps) {
  const { workspace } = useWorkspace()
  const boardKey = getComponentKey(board)
  const className = `board-${boardKey}`
  const properties = getNodeProperties(board, workspace)
  const { device, isInPreviewMode } = usePreview()

  const boardTheme = useMemo(
    () => themeService.getObjectTheme(board, workspace),
    [board, workspace],
  )

  const icons = useMemo(() => {
    const entryIds = isIconSetBoard(board)
      ? board.variants.map((variant) => variant.id)
      : []
    return entryIds.flatMap((entryId) =>
      workspaceIconSetService
        .getIncludedIcons(entryId, workspace)
        .map((iconId) => ({ entryId, iconId })),
    )
  }, [board, workspace])

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
            componentKey: boardKey,
            entryId,
            slot: iconId,
          })
          return (
            <IconAvatarPreview
              key={`${entryId}-${iconId}`}
              scope={`${boardKey}-${entryId}-${iconId}`}
              entryId={entryId}
              resourceItemKey={selectionKey}
              iconId={iconId}
              themes={workspace.themes}
              boardThemeId={board.componentTheme}
            />
          )
        })}
      </Frame>
    </>
  )
}

type IconAvatarPreviewProps = {
  scope: string
  entryId: string
  resourceItemKey: string
  iconId: IconId
  themes: Workspace["themes"]
  boardThemeId: string
}

/**
 * Renders a single Iconic Avatar preview for one icon.
 *
 * The icon id is injected as a `symbol` override on every Icon node of the
 * cloned preview workspace, so the avatar shows that icon. Mirrors the font
 * collection type specimen, swapping the injected property.
 */
function IconAvatarPreview({
  scope,
  entryId,
  resourceItemKey,
  iconId,
  themes,
  boardThemeId,
}: IconAvatarPreviewProps) {
  const { workspace: avatarBase, rootId } = getIconSheetPreviewBase()

  const label = iconLabels[iconId as keyof typeof iconLabels] ?? iconId

  const previewWorkspace = useMemo(() => {
    if (!rootId) {
      return null
    }
    const nodes = Object.fromEntries(
      Object.entries(avatarBase.nodes).map(([id, node]) => {
        const isIcon =
          getNodeCatalogComponentId(node, avatarBase) === ComponentId.ICON
        const isTitle =
          getNodeCatalogComponentId(node, avatarBase) === ComponentId.TITLE
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
              ...(isTitle
                ? {
                    content: { type: ValueType.EXACT, value: label },
                  }
                : {}),
            },
            ...(id === rootId ? { theme: boardThemeId } : {}),
          },
        ]
      }),
    )
    return {
      ...avatarBase,
      themes,
      nodes,
    } as Workspace
  }, [avatarBase, rootId, themes, boardThemeId, iconId, label])

  if (!previewWorkspace || !rootId) {
    return null
  }

  return (
    <div
      data-canvas-selection-id={canvasSelectionId(resourceItemKey, entryId)}
      data-selection-id={resourceItemKey}
      data-selection-kind="resourceItem"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <BoardPreviewNode
        nodeId={rootId}
        workspace={previewWorkspace}
        scope={scope}
        isRoot
      />
    </div>
  )
}
