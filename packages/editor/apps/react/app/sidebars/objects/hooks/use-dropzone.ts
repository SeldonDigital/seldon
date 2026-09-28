import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { resolveComponentDrop } from "@seldon/editor/lib/workspace/component-drag"
import { isNoOpDrop, isValidDropTarget } from "@seldon/editor/lib/workspace/drop-validity"
import { getNodeChildIds } from "@seldon/editor/lib/workspace/node-tree"
import { useEffect, useRef, useState } from "react"

import {
  invariant,
  nodeRelationshipService,
  nodeTraversalService,
  typeCheckingService,
} from "@seldon/core"

import type { Instance, Variant, Workspace } from "@seldon/core"
import type { EntryNode } from "@seldon/core/workspace/types"
import type { Placement } from "@seldon/editor/lib/types"
import type {
  ComponentDragPayload,
  ComponentDropTarget,
} from "@seldon/editor/lib/workspace/component-drag"

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
        componentTarget: getComponentTarget(target, placement, workspace),
      }),
      getDropEffect: ({ input }) => (input.altKey ? "copy" : "move"),
      onDragEnter: ({ source, location }) => {
        onDragEnter?.()

        const isValid = isComponentPaletteDrag(source.data.action)
          ? canDropComponent(
              source.data.payload as ComponentDragPayload,
              getComponentTarget(target, placement, workspace),
              workspace,
            )
          : isDroppable({
              target,
              subject: source.data.subjectNode as Variant | Instance | EntryNode,
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
        if (isComponentPaletteDrag(source.data.action)) {
          const componentTarget = getComponentTarget(target, placement, workspace)
          const isValid = canDropComponent(
            source.data.payload as ComponentDragPayload,
            componentTarget,
            workspace,
          )
          return isValid
        }

        return isDroppable({
          target,
          subject: source.data.subjectNode as Variant | Instance | EntryNode,
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

function isComponentPaletteDrag(action: unknown): boolean {
  return action === "component-palette-insert"
}

function canDropComponent(
  payload: ComponentDragPayload,
  target: ComponentDropTarget | null,
  workspace: Workspace,
): boolean {
  return target !== null && resolveComponentDrop(payload, target, workspace).isValid
}

function getComponentTarget(
  target: Variant | Instance | EntryNode,
  placement: Placement,
  workspace: Workspace,
): ComponentDropTarget | null {
  if (!typeCheckingService.isInstance(target) && !typeCheckingService.isVariant(target)) {
    return null
  }

  if (placement === "inside") {
    return {
      nodeId: target.id,
      index: getNodeChildIds(target, workspace).length,
    }
  }

  const parent = nodeTraversalService.findParentNode(target.id, workspace)

  if (!parent) return null

  const index = typeCheckingService.isInstance(target)
    ? nodeRelationshipService.getInstanceIndex(target, workspace)
    : nodeRelationshipService.getVariantIndex(target, workspace)

  return {
    nodeId: parent.id,
    index: placement === "before" ? index : index + 1,
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
