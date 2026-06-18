"use client"

import { CSSProperties } from "react"
import { Board } from "@seldon/core"
import { ThemeInstanceId } from "@seldon/core/themes/types"
import { getBoardThemeRef } from "@seldon/core/workspace/helpers/components/get-board-theme-ref"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { resolveComponentKey } from "@lib/workspace/workspace-accessors"
import { Label } from "@seldon/components/chrome/primitives/Label"
import { PlaceholderBox } from "@seldon/components/custom-components"
import { CanvasNode } from "../Node"

export type SandboxCanvasProps = {
  board: Board
}

const playgroundStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
}

/**
 * Renders a playground's Sandbox roots directly on the shared canvas. Each
 * Sandbox positions itself absolutely through its own computed `position`
 * (`top`/`left`) inside the relative playground container, so the canvas does
 * not add a second positioning wrapper.
 */
export function SandboxCanvas({ board }: SandboxCanvasProps) {
  const { workspace } = useWorkspace()
  const playgroundKey = resolveComponentKey(board, workspace)
  const playground = workspace.playgrounds?.[playgroundKey] ?? board
  const themeId = (getBoardThemeRef(playground) ?? "default") as ThemeInstanceId

  if (playground.variants.length === 0) {
    return (
      <PlaceholderBox
        boardId={playgroundKey}
        className={`board-${playgroundKey}`}
      >
        <Label className="seldon-instance">No Sandboxes</Label>
      </PlaceholderBox>
    )
  }

  return (
    <div
      className={`playground playground-${playgroundKey}`}
      style={playgroundStyle}
    >
      {playground.variants.map((ref) => (
        <CanvasNode
          key={ref.id}
          nodeId={ref.id}
          initialThemeId={themeId}
          parentNode={playground}
          rootPath={ref.id}
          isRoot
        />
      ))}
    </div>
  )
}
