"use client"

import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { Frame } from "@seldon/components/frames/Frame"
import { getIsolationCanvasGroups } from "@seldon/editor/lib/canvas/get-isolation-canvas-groups"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { CSSProperties, useMemo } from "react"

import { boardOrderService } from "@seldon/core/workspace/services"

import { ComponentBoard } from "./ComponentBoard"

const columnStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "4rem",
  padding: "2rem",
}

const rowStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "flex-start",
  gap: "2rem",
}

/**
 * Isolation gallery: the anchored board plus every dependency board it uses,
 * grouped by component level. Levels stack vertically; boards within a level
 * sit in a row. Each dependency board renders only the variant roots the
 * anchored board references; the anchored board renders its selected variant.
 */
export function IsolationBoards() {
  const { workspace } = useWorkspace()
  const { isolatedBoardKey, isolatedVariantRootId } = useEditorConfig()

  const boards = useMemo(
    () => boardOrderService.getBoards(workspace),
    [workspace],
  )
  const isolatedBoard = isolatedBoardKey
    ? workspace.boards[isolatedBoardKey]
    : null

  const rows = useMemo(() => {
    if (!isolatedBoard) return []
    const groups = getIsolationCanvasGroups(
      isolatedBoard,
      isolatedVariantRootId,
      workspace,
      boards,
    )
    return groups.map((group) => ({
      level: group.level,
      boards: group.items.map((item) => ({
        key: getComponentKey(item.board),
        board: item.board,
        label: item.board.label,
        // The anchored board renders only the variant frozen on enable, so
        // selecting other components never brings its other variants back.
        variantRootIds: item.isIsolatedBoard
          ? isolatedVariantRootId
            ? [isolatedVariantRootId]
            : item.variantRootIds
          : item.variantRootIds,
      })),
    }))
  }, [isolatedBoard, workspace, boards, isolatedVariantRootId])

  if (!isolatedBoard) return null

  return (
    <Frame style={columnStyle}>
      {rows.map((row) => (
        <Frame key={row.level} style={rowStyle}>
          {row.boards.map((item) => (
            <ComponentBoard
              key={item.key}
              board={item.board}
              variantRootIds={item.variantRootIds}
              boardLabel={item.label}
              useOwnKey
            />
          ))}
        </Frame>
      ))}
    </Frame>
  )
}
