import { getSuggestTaskForObject } from "@lib/suggest/get-suggest-variables-for-target"
import { MouseEventHandler, useCallback } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useThrottledCallback } from "use-debounce"
import { InstanceId, VariantId, invariant } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId } from "@seldon/core/components/constants"
import { ErrorMessages } from "@seldon/core/workspace/constants"
import { getNodeOrientation } from "@seldon/core/workspace/helpers/get-node-orientation"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useDialog } from "@lib/hooks/use-dialog"
import { usePreview } from "@lib/hooks/use-preview"
import { useTool } from "@lib/hooks/use-tool"
import {
  HoverState,
  useCanvasHoverState,
} from "../../../../lib/hooks/use-canvas-hover-state"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { useAddToast } from "@components/toaster/use-add-toast"
import { getBoardIdForEventTarget } from "../helpers/get-board-id-for-event-target"
import { getChildNodesWithNodeId } from "../helpers/get-child-nodes-with-node-id"
import { getNodeIdForEventTarget } from "../helpers/get-node-id-for-event-target"

export function useCanvas() {
  const { selectNode } = useSelection()
  const { workspace } = useWorkspace()
  const { activeTool } = useTool()
  const { openDialog } = useDialog()
  const { hoverState, setHoverState } = useCanvasHoverState()
  const { isInPreviewMode } = usePreview()
  const addToast = useAddToast()

  /**
   * When hovering over a node within the canvas, we want to show a highlight around or next to a node.
   * So traverse up the DOM from the event target to find the first node with a node id.
   */
  const handleMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      // Don't show highlights in preview mode
      if (isInPreviewMode) {
        setHoverState(null)
        return
      }

      const element = event.target as HTMLDivElement
      const boardId =
        activeTool === "sketch" || activeTool === "component"
          ? (getBoardIdForEventTarget(element) as ComponentId)
          : null

      const nodeId = getNodeIdForEventTarget(element) as
        | InstanceId // Child node
        | VariantId // Variant

      const objectId = boardId ?? nodeId

      if (!objectId) {
        setHoverState(null)
        return
      }

      let lastChildNodeBeforeCursor: InstanceId | null = null
      const orientation = getNodeOrientation(objectId, workspace)
      const { clientX, clientY } = event

      // Find all children that have a data-node-id attribute
      const nodesWithNodeId = getChildNodesWithNodeId(element)

      // If there are children with a data-node-id attribute, we want to find the last child before the cursor
      // That means we want to find the child that is closest to the left for horizontal oriented nodes
      // or to the top of the cursor for vertical oriented nodes
      if (nodesWithNodeId.length > 0) {
        let lastNodeBeforeCursor

        for (const curr of nodesWithNodeId) {
          const currRect = curr.getBoundingClientRect()

          if (orientation === "horizontal") {
            if (clientX > currRect.left + currRect.width / 2) {
              lastNodeBeforeCursor = curr
            }
          } else {
            if (clientY > currRect.top + currRect.height / 2) {
              lastNodeBeforeCursor = curr
            }
          }
        }

        // We can safely assume that the node as a data-node-id attribute
        // because getChildNodesWithNodeId only returns nodes with a data-node-id attribute
        if (lastNodeBeforeCursor) {
          lastChildNodeBeforeCursor = lastNodeBeforeCursor.dataset
            .nodeId! as InstanceId
        }
      }

      const rect = element.getBoundingClientRect()
      // If the cursor is on the left or top side of the node, we want to show the highlight before the node
      // Otherwise we show it after the node
      const placement =
        orientation === "horizontal"
          ? clientX < rect.left + rect.width / 2
            ? "before"
            : "after"
          : clientY < rect.top + rect.height / 2
            ? "before"
            : "after"

      const objectType = boardId ? "board" : "node"

      if (
        objectId !== hoverState?.objectId ||
        objectType !== hoverState?.objectType ||
        placement !== hoverState?.placement ||
        lastChildNodeBeforeCursor !== hoverState?.lastChildNodeBeforeCursor
      ) {
        if (objectType === "board") {
          setHoverState({
            objectId: objectId as ComponentId,
            objectType: "board",
            placement,
            lastChildNodeBeforeCursor,
          })
        } else {
          setHoverState({
            objectId: objectId as VariantId | InstanceId,
            objectType: "node",
            placement,
            lastChildNodeBeforeCursor,
          })
        }
      }
    },
    [
      isInPreviewMode,
      activeTool,
      workspace,
      hoverState?.objectId,
      hoverState?.objectType,
      hoverState?.placement,
      hoverState?.lastChildNodeBeforeCursor,
      setHoverState,
    ],
  )

  const sketchVariant = useCallback(() => {
    invariant(hoverState, "Hover state is required")

    if (!hoverState.lastChildNodeBeforeCursor) {
      openDialog("sketch", {
        nodeId: hoverState.objectId,
        index: 0,
      })

      return
    }
    const variant = workspaceService.getVariant(
      hoverState.lastChildNodeBeforeCursor as VariantId,
      workspace,
    )
    let index = workspaceService.getVariantIndex(variant, workspace)

    if (hoverState.placement === "after") {
      index += 1
    }

    openDialog("sketch", {
      nodeId: hoverState.objectId,
      index,
    })
  }, [hoverState, openDialog, workspace])

  const sketchNode = useCallback(() => {
    invariant(hoverState, "Hover state is required")

    openDialog("sketch", {
      nodeId: hoverState.objectId,
      index: 0,
    })
  }, [hoverState, openDialog])

  const insertNextToChild = useCallback(
    (hoverState: HoverState) => {
      const childNodeId = hoverState.lastChildNodeBeforeCursor!
      const parentNode = workspaceService.findParentNode(childNodeId, workspace)

      invariant(parentNode, "Container node not found")
      if (!workspaceService.canNodeHaveChildren(parentNode)) {
        const schema = getComponentSchema(parentNode.component)
        addToast(ErrorMessages.cannotAddChild(schema.name))
        return
      }

      let index = parentNode.children!.indexOf(childNodeId as InstanceId)
      if (hoverState.placement === "after") {
        index += 1
      }

      openDialog("component", {
        nodeId: parentNode.id,
        index,
      })
    },
    [workspace, openDialog, addToast],
  )

  const insertIntoNode = useCallback(
    (nodeId: InstanceId | VariantId) => {
      const node = workspaceService.getNode(nodeId, workspace)
      if (workspaceService.canNodeHaveChildren(node)) {
        openDialog("component", {
          nodeId: nodeId,
          index: 0,
        })
      } else {
        // Otherwise, the target is the parent node of the hovered object
        const parentNode = workspaceService.findParentNode(nodeId, workspace)
        invariant(parentNode, "Parent node not found for node " + nodeId)
        let index = parentNode.children!.indexOf(nodeId as InstanceId)
        if (hoverState?.placement === "after") {
          index += 1
        }

        openDialog("component", {
          nodeId: parentNode.id,
          index,
        })
      }
    },
    [openDialog, workspace, hoverState?.placement],
  )

  const suggestVariant = useCallback(
    (hoverState: HoverState) => {
      openDialog("suggest", {
        nodeId: hoverState.objectId,
        index: 0,
      })
    },
    [openDialog],
  )

  const executeToolAction = useCallback(() => {
    if (!hoverState) {
      return
    }

    switch (activeTool) {
      case "select":
        if (hoverState.objectType === "node") {
          selectNode(hoverState.objectId)
        }
        break
      case "component":
        if (hoverState.objectType === "node") {
          const task = getSuggestTaskForObject(hoverState.objectId, workspace)

          if (task) {
            openDialog("suggest", {
              nodeId: hoverState.objectId,
              index: 0,
            })
          } else {
            if (hoverState.lastChildNodeBeforeCursor) {
              insertNextToChild(hoverState)
            } else {
              insertIntoNode(
                workspaceService.findContainerNode(
                  hoverState.objectId as InstanceId | VariantId,
                  workspace,
                ).id,
              )
            }
          }
        } else {
          suggestVariant(hoverState)
        }
        break

      case "sketch":
        if (hoverState.objectType === "board") {
          sketchVariant()
        }

        if (hoverState.objectType === "node") {
          sketchNode()
        }
        break
    }
  }, [
    hoverState,
    activeTool,
    selectNode,
    workspace,
    openDialog,
    insertNextToChild,
    insertIntoNode,
    suggestVariant,
    sketchVariant,
    sketchNode,
  ])

  /**
   * When clicking on a node within the canvas, we want to select it.
   * So traverse up the DOM from the event target to find the node id and highlight it.
   */
  const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.stopPropagation()

      executeToolAction()
    },
    [executeToolAction],
  )

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = useCallback(
    () => setHoverState(null),
    [setHoverState],
  )

  // Update the indicator position no more than 60 times per second (60 FPS)
  const throttledMouseMove = useThrottledCallback(handleMouseMove, 1000 / 60)

  useHotkeys("i", executeToolAction, {
    preventDefault: true,
    enabled: !!hoverState,
  })

  return {
    onCanvasMouseLeave: handleMouseLeave,
    onCanvasMouseMove: throttledMouseMove,
    onCanvasClick: handleClick,
  }
}
