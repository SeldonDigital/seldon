import {
  HoverState,
  useCanvasHoverState,
} from "@app/canvas/hooks/use-canvas-hover-state"
import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { usePanel } from "@app/editor/hooks/use-panel"
import { useTool } from "@app/editor/hooks/use-tool"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import { useSetHoveredId } from "@app/workspace/hooks/use-object-hover"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import {
  getSelectionTarget,
  selectFromTarget,
} from "@app/workspace/selection-target"
import { getNodeIdForEventTarget } from "@seldon/editor/lib/canvas/dom/canvas-elements"
import {
  getEditableControl,
  isEditableControlFocused,
  isEditableControlNodeSelected,
} from "@seldon/editor/lib/canvas/dom/editable-control"
import { resolveCanvasNodeSelection } from "@seldon/editor/lib/canvas/resolve-node-selection"
import { canNodeAcceptChildren } from "@seldon/editor/lib/workspace/can-node-accept-children"
import { getNodeOrientation } from "@seldon/editor/lib/workspace/get-node-orientation"
import {
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "@seldon/editor/lib/workspace/node-tree"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { MouseEventHandler, useCallback, useEffect, useRef } from "react"
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

import { checkInsertionPoint } from "../../tracking/helpers/check-insertion-point"
import { getBoardIdForEventTarget } from "../helpers/get-board-id-for-event-target"
import { getChildNodesWithNodeId } from "../helpers/get-child-nodes-with-node-id"

/**
 * Delay before a single click commits its selection. A double click cancels the
 * pending single click within this window, so the two gestures stay distinct and
 * repeated double clicks can drill without a single click resetting to the root.
 */
const SINGLE_CLICK_DELAY_MS = 200

export function useCanvas() {
  const {
    selectNode,
    selectBoard,
    selectResourceEntry,
    selectResourceItem,
    selectedNodeId,
    selectedNodeRootId,
  } = useSelection()
  const { workspace } = useWorkspace()
  const { activeBoard } = useActiveBoard()
  const { directSelect } = useEditorConfig()
  const { activeTool, setActiveTool } = useTool()
  const { openPanel } = usePanel()
  const { hoverState, setHoverState } = useCanvasHoverState()
  const setHoveredId = useSetHoveredId()
  const addToast = useAddToast()

  // Pending deferred single-click selection. A double click clears it so the
  // single click never fires, letting the two gestures drive different behavior.
  const pendingSelectRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clearPendingSelect = useCallback(() => {
    if (pendingSelectRef.current !== null) {
      clearTimeout(pendingSelectRef.current)
      pendingSelectRef.current = null
    }
  }, [])
  useEffect(() => clearPendingSelect, [clearPendingSelect])

  /**
   * When hovering over a node within the canvas, we want to show a highlight around or next to a node.
   * So traverse up the DOM from the event target to find the first node with a node id.
   */
  const handleMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      // Theme boards suppress the hover overlay. They are previews, not an
      // editable node tree, so silently clear hover and stop.
      if (activeBoard && isThemeBoard(activeBoard)) {
        setHoverState(null)
        setHoveredId(null)
        return
      }

      // Resolve the hovered selectable (node, theme variant, font specimen).
      const selectionTarget = getSelectionTarget(event.target as Element)

      // Select tool: preview what a click will select. A plain hover highlights
      // the top-most node of the tree; holding cmd/ctrl previews the exact node
      // under the cursor, matching the click behavior. Non-node targets (boards,
      // resources) highlight as-is.
      if (activeTool === "select") {
        if (selectionTarget?.kind === "node") {
          const mode =
            event.metaKey || event.ctrlKey || directSelect ? "exact" : "root"
          const preview = resolveCanvasNodeSelection(
            selectionTarget.rootId ?? selectionTarget.id,
            selectedNodeRootId,
            mode,
          )
          setHoveredId(preview.id, "node", preview.rootId)
        } else {
          setHoveredId(
            selectionTarget?.id ?? null,
            selectionTarget?.kind,
            selectionTarget?.rootId,
          )
        }
        return
      }

      // Component tool: keep the exact node under the cursor. It drives the
      // accent hover box and the insertion placement computed below.
      setHoveredId(
        selectionTarget?.id ?? null,
        selectionTarget?.kind,
        selectionTarget?.rootId,
      )

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
      activeBoard,
      activeTool,
      workspace,
      directSelect,
      selectedNodeRootId,
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

      // Select tool: a plain click selects the top-most node of the clicked
      // tree, a double click drills one level, and cmd/ctrl click selects the
      // exact node under the cursor (the sidebar arrow behavior).
      if (activeTool === "select") {
        // While an input is being edited, clicks inside it stay native (caret
        // placement, text selection) and must not change the canvas selection.
        const editing = getEditableControl(event.target as Element)
        if (editing && isEditableControlFocused(editing)) {
          return
        }

        clearPendingSelect()
        const target = getSelectionTarget(event.target as Element)

        if (!target) {
          if (activeBoard) {
            selectBoard(getComponentKey(activeBoard))
          } else {
            selectNode(null)
          }
          return
        }

        // Boards and resource entries carry no node tree, so they select
        // directly through the shared typed setters.
        if (target.kind !== "node") {
          selectFromTarget(target, {
            selectNode,
            selectBoard,
            selectResourceEntry,
            selectResourceItem,
          })
          return
        }

        const clickedRootId = target.rootId ?? target.id
        // Direct select mode selects the exact node on a plain click, as if
        // cmd/ctrl were held, restoring the pre-drill selection behavior.
        const additive = event.metaKey || event.ctrlKey || directSelect
        if (additive) {
          const exact = resolveCanvasNodeSelection(
            clickedRootId,
            selectedNodeRootId,
            "exact",
          )
          selectNode(exact.id as VariantId | InstanceId, exact.rootId)
          // Sync hover to the selection so the coincident hover outline is
          // suppressed instead of leaving a stale second dashed border.
          setHoveredId(exact.id, "node", exact.rootId)
          return
        }

        // Defer the top-most selection so a double click can cancel it and drill
        // instead. The current selection is captured now for the drill baseline.
        const currentRootId = selectedNodeRootId
        pendingSelectRef.current = setTimeout(() => {
          pendingSelectRef.current = null
          const root = resolveCanvasNodeSelection(
            clickedRootId,
            currentRootId,
            "root",
          )
          selectNode(root.id as VariantId | InstanceId, root.rootId)
          setHoveredId(root.id, "node", root.rootId)
        }, SINGLE_CLICK_DELAY_MS)
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
      selectedNodeRootId,
      directSelect,
      clearPendingSelect,
      setHoveredId,
    ],
  )

  /**
   * Double click drills one level down the clicked tree toward the node under
   * the cursor, relative to the current selection. Only the select tool drills;
   * cmd/ctrl double clicks defer to the exact selection the click already made.
   */
  const handleDoubleClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (activeTool !== "select") return
      if (event.metaKey || event.ctrlKey) return

      // Double clicking a selected input enters edit instead of drilling. The
      // focus was granted on mousedown; here we only cancel the pending single
      // click so the selection stays on the input being edited.
      const control = getEditableControl(event.target as Element)
      if (
        control &&
        (isEditableControlFocused(control) ||
          isEditableControlNodeSelected(
            control,
            selectedNodeId,
            selectedNodeRootId,
          ))
      ) {
        clearPendingSelect()
        return
      }

      // Direct select mode selects the exact node on every click, so a double
      // click has nothing deeper to drill into.
      if (directSelect) return

      const target = getSelectionTarget(event.target as Element)
      if (!target || target.kind !== "node") return

      clearPendingSelect()
      const clickedRootId = target.rootId ?? target.id
      const drilled = resolveCanvasNodeSelection(
        clickedRootId,
        selectedNodeRootId,
        "drill",
      )
      selectNode(drilled.id as VariantId | InstanceId, drilled.rootId)
      // Sync hover to the drilled node. The mouse is stationary during a double
      // click, so without this the hover outline stays on the previous node and
      // draws a second dashed border next to the new selection.
      setHoveredId(drilled.id, "node", drilled.rootId)
    },
    [
      activeTool,
      selectedNodeId,
      selectedNodeRootId,
      directSelect,
      selectNode,
      clearPendingSelect,
      setHoveredId,
    ],
  )

  /**
   * Blocks native focus, caret, and the text cursor on canvas form controls so a
   * click selects the node instead. Editing is allowed only when the control is
   * already being edited, or when a double click lands on a control whose node is
   * already selected. The insert tool never grants editing.
   */
  const handleMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      const control = getEditableControl(event.target as Element)
      if (!control) return

      if (isEditableControlFocused(control)) return

      const enteringEdit =
        activeTool === "select" &&
        event.detail >= 2 &&
        isEditableControlNodeSelected(
          control,
          selectedNodeId,
          selectedNodeRootId,
        )
      if (enteringEdit) return

      event.preventDefault()
    },
    [activeTool, selectedNodeId, selectedNodeRootId],
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
    onCanvasMouseDown: handleMouseDown,
    onCanvasClick: handleClick,
    onCanvasDoubleClick: handleDoubleClick,
  }
}
