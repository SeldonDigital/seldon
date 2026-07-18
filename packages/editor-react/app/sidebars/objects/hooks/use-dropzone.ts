import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { Placement } from "@lib/types"
import { useEffect, useRef, useState } from "react"
import { Instance, Variant, Workspace, invariant } from "@seldon/core"
import { rules } from "@seldon/core/rules/config/rules.config"
import {
  nodeRelationshipService,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import type { EntryNode } from "@seldon/core/workspace/types"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { getNodeCatalogComponentId } from "@lib/workspace/node-tree"

type DropzoneParams = {
  target: Variant | Instance | EntryNode
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

  useEffect(() => {
    const el = ref.current
    invariant(el, "Element ref is not set")

    return dropTargetForElements({
      element: el,
      getData: ({ input }) => ({
        targetNode: target,
        placement,
        duplicate: input.altKey,
      }),
      getDropEffect: ({ input }) => (input.altKey ? "copy" : "move"),
      onDragEnter: ({ source }) => {
        onDragEnter?.()

        const subjectNode = source.data.subjectNode as
          | Variant
          | Instance
          | EntryNode
        const isValid = isValidTargetForSubjectNode(
          target,
          subjectNode,
          placement,
          workspace,
        )
        setValidDropTarget(isValid)
      },
      onDragLeave: () => {
        onDragLeave?.()
        setValidDropTarget(false)
      },
      canDrop: ({ source }) => {
        const subjectNode = source.data.subjectNode as
          | Variant
          | Instance
          | EntryNode
        return isValidTargetForSubjectNode(
          target,
          subjectNode,
          placement,
          workspace,
        )
      },
      onDrop: () => {
        setValidDropTarget(false)
      },
    })
  }, [placement, onDragEnter, onDragLeave, target, workspace])

  return {
    ref,
    isValidDropTarget,
  }
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
    const targetEntityType = typeCheckingService.getEntityType(target)
    if (!rules.mutations.insertInto[targetEntityType].allowed) {
      return false
    }
  }

  const subjectComponentId = getNodeCatalogComponentId(subject, workspace)
  const targetComponentId = getNodeCatalogComponentId(target, workspace)

  if (
    typeCheckingService.isInstance(subject) &&
    typeCheckingService.isInstance(target) &&
    subjectComponentId &&
    targetComponentId &&
    nodeRelationshipService.areWithinSameVariant(target, subject, workspace)
  ) {
    if (placement === "inside") {
      return (
        typeCheckingService.canComponentBeParentOf(
          targetComponentId,
          subjectComponentId,
        ) &&
        !nodeRelationshipService.hasAncestorWithComponentId(
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
    typeCheckingService.isVariant(subject) &&
    placement === "inside" &&
    subjectComponentId &&
    targetComponentId
  ) {
    const subjectEntityType = typeCheckingService.getEntityType(subject)
    if (!rules.mutations.instantiate[subjectEntityType].allowed) {
      return false
    }

    return (
      typeCheckingService.canComponentBeParentOf(
        targetComponentId,
        subjectComponentId,
      ) &&
      !nodeRelationshipService.hasAncestorWithComponentId(
        subjectComponentId,
        target,
        workspace,
      )
    )
  }

  if (
    typeCheckingService.isVariant(subject) &&
    typeCheckingService.isVariant(target) &&
    subjectComponentId &&
    targetComponentId &&
    subjectComponentId === targetComponentId &&
    placement !== "inside"
  ) {
    return true
  }

  return false
}
