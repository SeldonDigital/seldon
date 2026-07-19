import { MouseEventHandler, useCallback } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useThrottledCallback } from "use-debounce"
import { InstanceId, VariantId, invariant } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId } from "@seldon/core/components/constants"
import { ErrorMessages } from "@seldon/core/workspace/constants"
import { isThemeBoard } from "@seldon/core/workspace/model/components"
import {
  nodeRetrievalService,
  nodeTraversalService,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import { useSetHoveredId } from "@app/workspace/hooks/use-object-hover"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { usePanel } from "@app/editor/hooks/use-panel"
import { usePreview } from "@app/editor/hooks/use-preview"
import { useTool } from "@app/editor/hooks/use-tool"
import {
  HoverState,
  useCanvasHoverState,
} from "@app/canvas/hooks/use-canvas-hover-state"
import { canNodeAcceptChildren } from "@seldon/editor/lib/workspace/can-node-accept-children"
import { getNodeOrientation } from "@seldon/editor/lib/workspace/get-node-orientation"
import {
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "@seldon/editor/lib/workspace/node-tree"
import {
  getSelectionTarget,
  selectFromTarget,
} from "@app/workspace/selection-target"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { checkInsertionPoint } from "../../tracking/helpers/check-insertion-point"
import { getBoardIdForEventTarget } from "../helpers/get-board-id-for-event-target"
import { getChildNodesWithNodeId } from "../helpers/get-child-nodes-with-node-id"
import { getNodeIdForEventTarget } from "../helpers/get-node-id-for-event-target"

export function useCanvas() {
  const { selectNode, selectBoard, selectResourceEntry, selectResourceItem } =
    useSelection()
  const { workspace } = useWorkspace()
  const { activeBoard } = useActiveBoard()
  const { activeTool, setActiveTool } = useTool()
  const { openPanel } = usePanel()
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

      // Theme boards suppress the hover overlay. They are previews, not an
      // editable node tree, so silently clear hover and stop.
      if (activeBoard && isThemeBoard(activeBoard)) {
        setHoverState(null)
        setHoveredId(null)
        return
      }

      // Resolve the hovered selectable (node, theme variant, font specimen) and
      // feed the shared hover bridge for both tools. The select tool stops here;
      // the component tool also drives the accent hover box from this id, then
      // computes insertion placement below.
      const selectionTarget = getSelectionTarget(event.target as Element)
      setHoveredId(
        selectionTarget?.id ?? null,
        selectionTarget?.kind,
        selectionTarget?.rootId,
      )
      if (activeTool === "select") {
        return
      }

      const element = event.target as HTMLDivElement
      const boardId =
        activeTool === "component"
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
      // indicators for the component tool. The select tool never reads it, so
      // skip the per-child measurement loop to keep hover cheap.
      const needsChildLookup = activeTool === "component"

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

      // For the component tool, check if insertion is allowed before setting hover state
      // This prevents showing indicators for default variants and their nested children
      if (activeTool === "component" && objectType === "node") {
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
      activeBoard,
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
      const parentNode = nodeTraversalService.findParentNode(
        childNodeId,
        workspace,
      )

      invariant(parentNode, "Container node not found")
      if (!canNodeAcceptChildren(parentNode, workspace)) {
        const catalogId = getNodeCatalogComponentId(parentNode, workspace)
        invariant(catalogId, "Parent node has no catalog component")
        const schema = getComponentSchema(catalogId)
        addToast(ErrorMessages.cannotAddChild(schema.name))
        return
      }

      // Prevent insertion into default variants
      if (
        typeCheckingService.isVariant(parentNode) &&
        typeCheckingService.isDefaultVariant(parentNode)
      ) {
        return
      }

      const childIds = getNodeChildIds(parentNode, workspace)
      let index = childIds.indexOf(childNodeId)
      if (hoverState.placement === "after") {
        index += 1
      }

      openPanel("component", {
        nodeId: parentNode.id,
        index,
      })
    },
    [workspace, openPanel, addToast],
  )

  const insertIntoNode = useCallback(
    (nodeId: InstanceId | VariantId) => {
      const node = nodeRetrievalService.getNode(nodeId, workspace)
      if (canNodeAcceptChildren(node, workspace)) {
        // Prevent insertion into default variants
        if (
          typeCheckingService.isVariant(node) &&
          typeCheckingService.isDefaultVariant(node)
        ) {
          return
        }

        openPanel("component", {
          nodeId: nodeId,
          index: 0,
        })
      } else {
        // Otherwise, the target is the parent node of the hovered object
        const parentNode = nodeTraversalService.findParentNode(
          nodeId,
          workspace,
        )
        invariant(parentNode, "Parent node not found for node " + nodeId)

        // Prevent insertion into default variants
        if (
          typeCheckingService.isVariant(parentNode) &&
          typeCheckingService.isDefaultVariant(parentNode)
        ) {
          return
        }

        const childIds = getNodeChildIds(parentNode, workspace)
        let index = childIds.indexOf(nodeId)
        if (hoverState?.placement === "after") {
          index += 1
        }

        openPanel("component", {
          nodeId: parentNode.id,
          index,
        })
      }
    },
    [openPanel, workspace, hoverState?.placement],
  )

  const insertOnBoard = useCallback(
    (hoverState: HoverState) => {
      openPanel("component", {
        nodeId: hoverState.objectId,
        index: 0,
      })
    },
    [openPanel],
  )

  const executeToolAction = useCallback(() => {
    if (!hoverState) {
      return
    }

    switch (activeTool) {
      case "component":
        if (hoverState.objectType === "node") {
          if (hoverState.lastChildNodeBeforeCursor) {
            insertNextToChild(hoverState)
          } else {
            // Insert into the hovered node when it accepts children, otherwise
            // insertIntoNode resolves to its parent container. Avoids the throw
            // from findContainerNode when the hovered node is a `node:` linked
            // root (user variant or instance) with no container above it.
            insertIntoNode(hoverState.objectId as InstanceId | VariantId)
          }
        } else {
          insertOnBoard(hoverState)
        }
        break
    }
  }, [hoverState, activeTool, insertNextToChild, insertIntoNode, insertOnBoard])

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
            selectResourceEntry,
            selectResourceItem,
          })
        } else if (activeBoard) {
          selectBoard(getComponentKey(activeBoard))
        } else {
          selectNode(null)
        }
        return
      }

      // Component tool: clicking empty canvas (no board or node under the
      // cursor) cancels the tool and returns to select.
      const element = event.target as HTMLDivElement
      const clickedBoardId = getBoardIdForEventTarget(element)
      const clickedNodeId = getNodeIdForEventTarget(element)
      if (!clickedBoardId && !clickedNodeId) {
        setActiveTool("select")
        return
      }

      executeToolAction()
    },
    [
      activeTool,
      activeBoard,
      executeToolAction,
      setActiveTool,
      selectNode,
      selectBoard,
      selectResourceEntry,
      selectResourceItem,
    ],
  )

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> =
    useCallback(() => {
      setHoverState(null)
      setHoveredId(null)
    }, [setHoverState, setHoveredId])

  // Update the indicator position no more than 60 times per second (60 FPS)
  const throttledMouseMove = useThrottledCallback(handleMouseMove, 1000 / 60)

  useHotkeys("enter", executeToolAction, {
    preventDefault: true,
    enabled: activeTool === "component" && !!hoverState,
  })

  return {
    onCanvasMouseLeave: handleMouseLeave,
    onCanvasMouseMove: throttledMouseMove,
    onCanvasClick: handleClick,
  }
}
