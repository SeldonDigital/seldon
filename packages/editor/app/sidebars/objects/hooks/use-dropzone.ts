import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { Placement } from "@lib/types"
import { useEffect, useRef, useState } from "react"
import { Board, Instance, Variant, Workspace, invariant } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { isComponentId } from "@seldon/core/components/constants"
import { rules } from "@seldon/core/rules/config/rules.config"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import type { EntryNode } from "@seldon/core/workspace/types"
import { getNodeCatalogComponentId } from "@lib/workspace/node-tree"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"

export type DropzoneParams = {
  target: Board | Variant | Instance | EntryNode
  placement: Placement
  onDragEnter?: () => void
  onDragLeave?: () => void
}

/**
 * Makes an element a dropzone for drag-and-drop operations with validation.
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
  const isBoardTarget = isBoard(target)

  useEffect(() => {
    const el = ref.current
    invariant(el, "Element ref is not set")

    return dropTargetForElements({
      element: el,
      getData: ({ input }) => {
        if (isBoardTarget) {
          return {
            targetBoard: target,
            placement,
            duplicate: false,
          }
        }

        return {
          targetNode: target,
          placement,
          duplicate: input.altKey,
        }
      },
      getDropEffect: ({ input }) => {
        if (isBoardTarget) {
          return "move"
        }

        return input.altKey ? "copy" : "move"
      },
      onDragEnter: ({ source }) => {
        onDragEnter?.()

        if (isBoardTarget) {
          const subjectBoard = source.data.subjectBoard as Board
          const isValid = isValidTargetForSubjectBoard(target, subjectBoard)
          setValidDropTarget(isValid)
        } else {
          const subjectNode = source.data.subjectNode as
            | Variant
            | Instance
            | EntryNode
          const isValid = isValidTargetForSubjectNode(
            target as Variant | Instance | EntryNode,
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
        if (isBoardTarget) {
          const subjectBoard = source.data.subjectBoard as Board
          return isValidTargetForSubjectBoard(target, subjectBoard)
        } else {
          const subjectNode = source.data.subjectNode as
            | Variant
            | Instance
            | EntryNode
          return isValidTargetForSubjectNode(
            target as Variant | Instance | EntryNode,
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
  }, [placement, onDragEnter, onDragLeave, target, isBoardTarget, workspace])

  return {
    ref,
    isValidDropTarget,
  }
}

function getBoardCatalogId(board: Board): string | null {
  if ("catalogId" in board && board.catalogId) {
    return board.catalogId
  }
  const legacyId = (board as { id?: string }).id
  return legacyId ?? null
}

function isValidTargetForSubjectBoard(
  target: Board,
  subject: Board,
): boolean {
  if (getComponentKey(target) === getComponentKey(subject)) return false

  const targetCatalogId = getBoardCatalogId(target)
  const subjectCatalogId = getBoardCatalogId(subject)
  if (!targetCatalogId || !subjectCatalogId) return false
  if (!isComponentId(targetCatalogId) || !isComponentId(subjectCatalogId)) {
    return false
  }

  return (
    getComponentSchema(targetCatalogId).level ===
    getComponentSchema(subjectCatalogId).level
  )
}

function isValidTargetForSubjectNode(
  target: Variant | Instance | EntryNode,
  subject: Variant | Instance | EntryNode,
  placement: Placement,
  workspace: Workspace,
): boolean {
  if (!target || !subject) return false

  if (workspace.nodes[target.id] === undefined) {
    return false
  }

  if (placement === "inside") {
    const targetEntityType = workspaceService.getEntityType(target)
    if (!rules.mutations.insertInto[targetEntityType].allowed) {
      return false
    }
  }

  const subjectComponentId = getNodeCatalogComponentId(subject, workspace)
  const targetComponentId = getNodeCatalogComponentId(target, workspace)

  if (
    workspaceService.isInstance(subject) &&
    workspaceService.isInstance(target) &&
    subjectComponentId &&
    targetComponentId &&
    workspaceService.areWithinSameVariant(target, subject, workspace)
  ) {
    if (placement === "inside") {
      return (
        workspaceService.canComponentBeParentOf(
          targetComponentId,
          subjectComponentId,
        ) &&
        !workspaceService.hasAncestorWithComponentId(
          subjectComponentId,
          target,
          workspace,
        )
      )
    }

    return true
  }

  // Variant subject dropped inside a container instantiates a new child instance.
  // The insertInto allowance for the target was already checked above; here we
  // confirm the variant can be instantiated and the container accepts its level.
  if (
    workspaceService.isVariant(subject) &&
    placement === "inside" &&
    subjectComponentId &&
    targetComponentId
  ) {
    const subjectEntityType = workspaceService.getEntityType(subject)
    if (!rules.mutations.instantiate[subjectEntityType].allowed) {
      return false
    }

    return (
      workspaceService.canComponentBeParentOf(
        targetComponentId,
        subjectComponentId,
      ) &&
      !workspaceService.hasAncestorWithComponentId(
        subjectComponentId,
        target,
        workspace,
      )
    )
  }

  if (
    workspaceService.isVariant(subject) &&
    workspaceService.isVariant(target) &&
    subjectComponentId &&
    targetComponentId &&
    subjectComponentId === targetComponentId &&
    placement !== "inside"
  ) {
    return true
  }

  return false
}
