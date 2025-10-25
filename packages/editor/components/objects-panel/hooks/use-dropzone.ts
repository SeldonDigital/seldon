import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { Placement } from "@lib/types"
import { useEffect, useRef, useState } from "react"
import { Board, Instance, Variant, Workspace, invariant } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useWorkspace } from "@lib/workspace/use-workspace"

export type DropzoneParams = {
  target: Board | Variant | Instance
  placement: Placement
  onDragEnter?: () => void
  onDragLeave?: () => void
}

/*
 * Drag and drop has 3 parts: draggable, dropzone and monitor
 * This is the hook for making an element a dropzone with validation
 */
export function useDropzone({
  target,
  placement,
  onDragEnter,
  onDragLeave,
}: DropzoneParams) {
  const ref = useRef(null)
  const [isValidDropTarget, setValidDropTarget] = useState(false)
  const { workspace } = useWorkspace({ usePreview: false })
  const isBoard = workspaceService.isBoard(target)

  useEffect(() => {
    const el = ref.current
    invariant(el, "Element ref is not set")

    return dropTargetForElements({
      element: el,
      getData: ({ input }) => {
        if (isBoard) {
          // Board
          return {
            targetBoard: target,
            placement,
            duplicate: false,
          }
        }

        // Node
        return {
          targetNode: target,
          placement,
          duplicate: input.altKey,
        }
      },
      getDropEffect: ({ input }) => {
        if (isBoard) {
          return "move"
        }

        return input.altKey ? "copy" : "move"
      },
      onDragEnter: ({ source }) => {
        onDragEnter?.()

        if (isBoard) {
          const subjectBoard = source.data.subjectBoard as Board
          const isValid = isValidTargetForSubjectBoard(target, subjectBoard)
          setValidDropTarget(isValid)
        } else {
          const subjectNode = source.data.subjectNode as Variant | Instance
          const isValid = isValidTargetForSubjectNode(
            target,
            subjectNode,
            placement,
            workspace,
          )
          setValidDropTarget(isValid)
        }
      },
      onDragLeave: () => {
        onDragLeave?.()
        setValidDropTarget(false)
      },
      canDrop: ({ source }) => {
        if (isBoard) {
          const subjectBoard = source.data.subjectBoard as Board
          return isValidTargetForSubjectBoard(target, subjectBoard)
        } else {
          const subjectNode = source.data.subjectNode as Variant | Instance
          return isValidTargetForSubjectNode(
            target,
            subjectNode,
            placement,
            workspace,
          )
        }
      },
      onDrop: () => {
        setValidDropTarget(false)
      },
    })
  }, [placement, onDragEnter, onDragLeave, target, isBoard, workspace])

  return {
    ref,
    isValidDropTarget,
  }
}

/**
 * Check if a board can be dropped before or after another board
 * @param target The board that is being dropped on
 * @param subject The board that is being dropped
 * @returns True if the board can be dropped before/after another board
 */
function isValidTargetForSubjectBoard(target: Board, subject: Board): boolean {
  if (target.id === subject.id) return false

  return (
    getComponentSchema(target.id).level === getComponentSchema(subject.id).level
  )
}

/**
 * Check if a node can be dropped before, after or inside another node
 * @param target The node that is being dropped on
 * @param subject The node that is being dropped
 * @param placement The placement of the node
 * @param workspace The workspace
 * @returns True if the node can be dropped before/after another node
 */
function isValidTargetForSubjectNode(
  target: Variant | Instance,
  subject: Variant | Instance,
  placement: Placement,
  workspace: Workspace,
): boolean {
  if (!target || !subject) return false

  // Nodes can only be moved inside another node within the same variant
  if (
    workspaceService.isInstance(subject) &&
    workspaceService.isInstance(target) &&
    workspaceService.areWithinSameVariant(target, subject, workspace)
  ) {
    if (placement === "inside") {
      return (
        workspaceService.canComponentBeParentOf(
          target.component,
          subject.component,
        ) &&
        !workspaceService.hasAncestorWithComponentId(
          subject.component,
          target,
          workspace,
        )
      )
    }

    return true
  }

  // Variants can only be moved to a new position within the same board
  if (
    workspaceService.isVariant(subject) &&
    workspaceService.isVariant(target) &&
    subject.component === target.component &&
    placement !== "inside" // We cannot drop a variant inside another variant
  ) {
    return true
  }

  return false
}
