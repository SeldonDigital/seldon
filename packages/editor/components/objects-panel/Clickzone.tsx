import { useCanvasHoverState } from "@lib/hooks/use-canvas-hover-state"
import { useDialog } from "@lib/hooks/use-dialog"
import { useTool } from "@lib/hooks/use-tool"
import { Placement } from "@lib/types"
import { cn } from "@lib/utils/cn"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { useCallback, useMemo } from "react"

import { Variant, invariant } from "@seldon/core"
import { Instance } from "@seldon/core/index"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"

import { Indicator } from "./Indicator"

type ClickzoneProps = {
  target: Instance | Variant
  placement: Placement
}

export function Clickzone({ target, placement }: ClickzoneProps) {
  const { hoverState, setHoverState } = useCanvasHoverState()
  const { workspace } = useWorkspace({ usePreview: false })
  const { openDialog } = useDialog()
  const { activeTool } = useTool()
  const isVariant = workspaceService.isVariant(target)

  const isInsertionAllowed = useMemo(() => {
    if (isVariant) {
      return true
    } else {
      if (placement === "inside") {
        return workspaceService.canNodeHaveChildren(target)
      } else {
        const parentNode = workspaceService.findParentNode(target.id, workspace)
        invariant(parentNode, "Parent node not found")
        return workspaceService.canNodeHaveChildren(parentNode)
      }
    }
  }, [isVariant, placement, target, workspace])

  // This useMemo determines whether the hit area is hovered and thus should be highlighted.
  const isHovered = useMemo(() => {
    // When the placement is inside, hightlight the hit area when the hover state is inside and the object id matches this node's id.
    if (placement === "inside") {
      return (
        hoverState?.objectId === target.id && hoverState?.placement === "inside"
      )
    }

    const lastChildBeforeCursorNode = hoverState?.lastChildNodeBeforeCursor
      ? workspaceService.getNode(
          hoverState?.lastChildNodeBeforeCursor,
          workspace,
        )
      : null

    const parent = workspaceService.isVariant(target)
      ? workspaceService.getBoard(target.component, workspace)
      : workspaceService.findParentNode(target.id, workspace)

    // When the placement is before, we should only show the hightlight when the hoverstate object id has an index of 1 less than this target id.
    // This is because the lastChildBeforeCursor equals the target id of the previous node.
    if (placement === "before" && parent) {
      const ownIndex = workspaceService.isInstance(target)
        ? workspaceService.getInstanceIndex(target, workspace)
        : workspaceService.getVariantIndex(target, workspace)

      const childBeforeCursorIndex = lastChildBeforeCursorNode
        ? workspaceService.isInstance(lastChildBeforeCursorNode)
          ? workspaceService.getInstanceIndex(
              lastChildBeforeCursorNode,
              workspace,
            )
          : workspaceService.getVariantIndex(
              lastChildBeforeCursorNode,
              workspace,
            )
        : -1

      return (
        hoverState?.objectId === parent.id &&
        hoverState?.placement === "before" &&
        ownIndex - childBeforeCursorIndex === 1
      )
    }

    // When the placement is after, we should only show the hightlight when the hoverstate object id has an index of 1 greater than this target id.
    // This is because the lastChildBeforeCursor equals the target id.
    if (placement === "after" && parent) {
      return (
        hoverState?.objectId === parent.id &&
        hoverState?.placement === "after" &&
        hoverState?.lastChildNodeBeforeCursor === target.id
      )
    }

    return false
  }, [
    placement,
    target,
    workspace,
    hoverState?.objectId,
    hoverState?.placement,
    hoverState?.lastChildNodeBeforeCursor,
  ])

  const handleClick = () => {
    if (!isInsertionAllowed) return
    const dialog = activeTool === "sketch" ? "sketch" : "component"

    // User targetted inside a variant or instance
    if (placement === "inside") {
      openDialog(dialog, {
        nodeId: target.id,
        index: target.children!.length,
      })
    } else {
      // If user targetted before or after a variant, we need to open the dialog for the board
      if (isVariant) {
        const board = workspaceService.findBoardForVariant(target, workspace)
        invariant(board, "Board not found for variant" + target.id)

        const currentIndex = workspaceService.getVariantIndex(target, workspace)
        openDialog(dialog, {
          nodeId: board.id,
          index: placement === "before" ? currentIndex : currentIndex + 1,
        })
        // User is targetted before or after an instance, we need to open the dialog for the parent node
      } else {
        const parentNode = workspaceService.findParentNode(target.id, workspace)

        invariant(parentNode, "Parent node not found")

        const currentIndex = workspaceService.getInstanceIndex(
          target,
          workspace,
        )

        openDialog(activeTool === "sketch" ? "sketch" : "component", {
          nodeId: parentNode.id,
          index: placement === "before" ? currentIndex : currentIndex + 1,
        })
      }
    }
  }

  // Here we update the hover state based on the hit area this is currently hovered over.
  // The hit areas representing "before" and "after" are actually representing the gaps before and after the target node.
  // So, if we are hovering over "before" or "after", we're not actually hovering over the node itself, but of the gap, meaning we're hovering over the parent of the current node.
  // So we need to add the parent node to the hover state in these cases.
  const onMouseEnter = useCallback(() => {
    if (placement === "inside") {
      setHoverState({
        objectId: target.id,
        objectType: "node",
        placement,
        lastChildNodeBeforeCursor: null,
      })
    } else {
      const targetPlacement = placement === "before" ? "before" : "self"

      const parentNode = workspaceService.isVariant(target)
        ? workspaceService.getBoard(target.component, workspace)
        : workspaceService.findParentNode(target.id, workspace)

      invariant(parentNode, "Parent node not found")

      if (
        workspaceService.isBoard(parentNode) &&
        workspaceService.isVariant(target)
      ) {
        setHoverState({
          objectId: parentNode.id,
          objectType: "board",
          placement,
          lastChildNodeBeforeCursor:
            targetPlacement === "before"
              ? (workspaceService.findAdjacentVariant(
                  target,
                  targetPlacement,
                  workspace,
                )?.id ?? null)
              : target.id,
        })
      } else if (
        workspaceService.isVariant(parentNode) &&
        workspaceService.isInstance(target)
      ) {
        setHoverState({
          objectId: parentNode.id,
          objectType: "node",
          placement,
          lastChildNodeBeforeCursor:
            targetPlacement === "before"
              ? (workspaceService.findAdjacentNode(
                  target,
                  targetPlacement,
                  workspace,
                )?.id ?? null)
              : target.id,
        })
      }
    }
  }, [placement, setHoverState, target, workspace])

  return (
    <div
      className={cn([
        "flex-1",
        !isInsertionAllowed ? "cursor-not-allowed" : "cursor-copy",
      ])}
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => setHoverState(null)}
      onClick={(event) => {
        event.stopPropagation()
        handleClick()
      }}
    >
      {isHovered && isInsertionAllowed && (
        <Indicator
          placement={placement}
          color={activeTool === "sketch" ? "yellow" : "magenta"}
        />
      )}
    </div>
  )
}
