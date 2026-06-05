import { MouseEventHandler, useCallback } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useThrottledCallback } from "use-debounce"
import { InstanceId, VariantId, invariant } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId } from "@seldon/core/components/constants"
import { ErrorMessages } from "@seldon/core/workspace/constants"
import { getNodeOrientation } from "@lib/workspace/get-node-orientation"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useDialog } from "@lib/hooks/use-dialog"
import { usePreview } from "@lib/hooks/use-preview"
import { useTool } from "@lib/hooks/use-tool"
import {
  HoverState,
  useCanvasHoverState,
} from "../../../lib/hooks/use-canvas-hover-state"
import { getNodeCatalogComponentId, getNodeChildIds } from "@lib/workspace/node-tree"
import { useSelection } from "@lib/workspace/use-selection"
import {
  getSelectionTarget,
  selectFromTarget,
} from "@lib/workspace/selection-target"
import { useSetHoveredId } from "@lib/workspace/use-object-hover"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { useAddToast } from "@components/toaster/hooks/use-add-toast"
import { checkInsertionPoint } from "../../tracking/helpers/check-insertion-point"
import { getBoardIdForEventTarget } from "../helpers/get-board-id-for-event-target"
import { getChildNodesWithNodeId } from "../helpers/get-child-nodes-with-node-id"
import { getNodeIdForEventTarget } from "../helpers/get-node-id-for-event-target"

export function useCanvas() {
  const {
    selectNode,
    selectBoard,
    selectThemeEntry,
    selectFontCollectionEntry,
    selectResourceItem,
  } = useSelection()
  const { workspace } = useWorkspace()
  const { activeTool } = useTool()
  const { openDialog } = useDialog()
  const { hoverState, setHoverState } = useCanvasHoverState()
  const setHoveredId = useSetHoveredId()
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
        setHoveredId(null)
        return
      }

      // Select tool: one path resolves the hovered selectable (node, theme
      // variant, font specimen) and feeds the shared hover bridge. Insertion
      // placement below is component/sketch only.
      if (activeTool === "select") {
        const target = getSelectionTarget(event.target as Element)
        setHoveredId(target?.id ?? null)
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

      // The child-before-cursor lookup is only used to place insertion
      // indicators for the component/sketch tools. The select tool never reads
      // it, so skip the per-child measurement loop to keep hover cheap.
      const needsChildLookup =
        activeTool === "component" || activeTool === "sketch"

      // Find all children that have a data-node-id attribute
      const nodesWithNodeId = needsChildLookup
        ? getChildNodesWithNodeId(element)
        : []

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

      // For component/sketch tools, check if insertion is allowed before setting hover state
      // This prevents showing indicators for default variants and their nested children
      if (
        (activeTool === "component" || activeTool === "sketch") &&
        objectType === "node"
      ) {
        const insertionAllowed = checkInsertionPoint(
          objectId as InstanceId | VariantId,
          objectType,
          placement,
          workspace,
          activeTool,
        )

        if (!insertionAllowed) {
          setHoverState(null)
          return
        }
      }

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
      setHoveredId,
    ],
  )

  const insertNextToChild = useCallback(
    (hoverState: HoverState) => {
      const childNodeId = hoverState.lastChildNodeBeforeCursor!
      const parentNode = workspaceService.findParentNode(childNodeId, workspace)

      invariant(parentNode, "Container node not found")
      if (!workspaceService.canNodeHaveChildren(parentNode)) {
        const catalogId = getNodeCatalogComponentId(parentNode, workspace)
        invariant(catalogId, "Parent node has no catalog component")
        const schema = getComponentSchema(catalogId)
        addToast(ErrorMessages.cannotAddChild(schema.name))
        return
      }

      // Prevent insertion into default variants
      if (
        workspaceService.isVariant(parentNode) &&
        workspaceService.isDefaultVariant(parentNode)
      ) {
        return
      }

      const childIds = getNodeChildIds(parentNode, workspace)
      let index = childIds.indexOf(childNodeId)
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
        // Prevent insertion into default variants
        if (
          workspaceService.isVariant(node) &&
          workspaceService.isDefaultVariant(node)
        ) {
          return
        }

        openDialog("component", {
          nodeId: nodeId,
          index: 0,
        })
      } else {
        // Otherwise, the target is the parent node of the hovered object
        const parentNode = workspaceService.findParentNode(nodeId, workspace)
        invariant(parentNode, "Parent node not found for node " + nodeId)

        // Prevent insertion into default variants
        if (
          workspaceService.isVariant(parentNode) &&
          workspaceService.isDefaultVariant(parentNode)
        ) {
          return
        }

        const childIds = getNodeChildIds(parentNode, workspace)
        let index = childIds.indexOf(nodeId)
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

  const insertOnBoard = useCallback(
    (hoverState: HoverState) => {
      openDialog("component", {
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
      case "component":
      case "sketch":
        if (hoverState.objectType === "node") {
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
        } else {
          insertOnBoard(hoverState)
        }
        break
    }
  }, [
    hoverState,
    activeTool,
    workspace,
    insertNextToChild,
    insertIntoNode,
    insertOnBoard,
  ])

  /**
   * When clicking on a node within the canvas, we want to select it.
   * So traverse up the DOM from the event target to find the node id and highlight it.
   */
  const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.stopPropagation()

      // Select tool: select whatever selectable was clicked, using the same
      // typed setters the sidebar rows use, so canvas and sidebar clicks match.
      if (activeTool === "select") {
        const target = getSelectionTarget(event.target as Element)
        if (target) {
          selectFromTarget(target, {
            selectNode,
            selectBoard,
            selectThemeEntry,
            selectFontCollectionEntry,
            selectResourceItem,
          })
        }
        return
      }

      executeToolAction()
    },
    [
      activeTool,
      executeToolAction,
      selectNode,
      selectBoard,
      selectThemeEntry,
      selectFontCollectionEntry,
      selectResourceItem,
    ],
  )

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    setHoverState(null)
    setHoveredId(null)
  }, [setHoverState, setHoveredId])

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
