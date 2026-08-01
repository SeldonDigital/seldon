import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { isNoOpDrop, isValidDropTarget } from "@seldon/editor/lib/workspace/drop-validity"
import { useEffect, useRef, useState } from "react"

import { invariant } from "@seldon/core"

import type { Instance, Variant, Workspace } from "@seldon/core"
import type { EntryNode } from "@seldon/core/workspace/types"
import type { Placement } from "@seldon/editor/lib/types"

type DropzoneParams = {
  target: Variant | Instance | EntryNode
  placement: Placement
  onDragEnter?: () => void
  onDragLeave?: () => void
}

/**
 * Makes an element a dropzone for drag-and-drop operations with validation.
 */
export function useDropzone({ target, placement, onDragEnter, onDragLeave }: DropzoneParams) {
  const ref = useRef(null)
  const [isValidTarget, setValidTarget] = useState(false)
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
      onDragEnter: ({ source, location }) => {
        onDragEnter?.()

        const subjectNode = source.data.subjectNode as Variant | Instance | EntryNode
        const isValid = isDroppable({
          target,
          subject: subjectNode,
          placement,
          duplicate: location.current.input.altKey,
          workspace,
        })

        setValidTarget(isValid)
      },
      onDragLeave: () => {
        onDragLeave?.()
        setValidTarget(false)
      },
      canDrop: ({ source, input }) => {
        const subjectNode = source.data.subjectNode as Variant | Instance | EntryNode

        return isDroppable({
          target,
          subject: subjectNode,
          placement,
          duplicate: input.altKey,
          workspace,
        })
      },
      onDrop: () => {
        setValidTarget(false)
      },
    })
  }, [placement, onDragEnter, onDragLeave, target, workspace])

  return {
    ref,
    isValidDropTarget: isValidTarget,
  }
}

interface DroppableParams {
  target: Variant | Instance | EntryNode
  subject: Variant | Instance | EntryNode
  placement: Placement
  duplicate: boolean
  workspace: Workspace
}

/**
 * A drop is offered when it is structurally valid and would actually change the
 * order. Alt-drag duplicates instead of moving, and a copy placed next to the
 * original is a real edit, so the no-op rule does not apply to it.
 */
function isDroppable({
  target,
  subject,
  placement,
  duplicate,
  workspace,
}: DroppableParams): boolean {
  if (!isValidDropTarget(target, subject, placement, workspace)) return false

  return duplicate || !isNoOpDrop(target, subject, placement, workspace)
}
